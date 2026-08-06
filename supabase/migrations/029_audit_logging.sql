-- Migration 029: Add audit logging for sensitive operations
-- Creates audit_log table and triggers for tracking changes to sensitive data

BEGIN;

-- Step 1: Create audit_log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Step 2: Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON public.audit_log (table_name, record_id);

-- Step 3: Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_record_id TEXT;
  v_user_id UUID;
BEGIN
  -- Get user_id from auth context
  v_user_id := auth.uid();

  -- Handle different operations
  IF TG_OP = 'INSERT' THEN
    v_new_data := to_jsonb(NEW);
    v_record_id := NEW.id::TEXT;
    INSERT INTO public.audit_log (user_id, table_name, record_id, action, new_data)
    VALUES (v_user_id, TG_TABLE_NAME, v_record_id, 'INSERT', v_new_data);
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
    v_record_id := NEW.id::TEXT;
    INSERT INTO public.audit_log (user_id, table_name, record_id, action, old_data, new_data)
    VALUES (v_user_id, TG_TABLE_NAME, v_record_id, 'UPDATE', v_old_data, v_new_data);
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    v_old_data := to_jsonb(OLD);
    v_record_id := OLD.id::TEXT;
    INSERT INTO public.audit_log (user_id, table_name, record_id, action, old_data)
    VALUES (v_user_id, TG_TABLE_NAME, v_record_id, 'DELETE', v_old_data);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Step 4: Apply audit triggers to sensitive tables

-- Users table
DROP TRIGGER IF EXISTS audit_users ON public.users;
CREATE TRIGGER audit_users
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

-- Favorites table
DROP TRIGGER IF EXISTS audit_favorites ON public.favorites;
CREATE TRIGGER audit_favorites
  AFTER INSERT OR UPDATE OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

-- Remedy schedules table
DROP TRIGGER IF EXISTS audit_remedy_schedules ON public.remedy_schedules;
CREATE TRIGGER audit_remedy_schedules
  AFTER INSERT OR UPDATE OR DELETE ON public.remedy_schedules
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

-- Remedy feedback table
DROP TRIGGER IF EXISTS audit_remedy_feedback ON public.remedy_feedback;
CREATE TRIGGER audit_remedy_feedback
  AFTER INSERT OR UPDATE OR DELETE ON public.remedy_feedback
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

-- Appointments table
DROP TRIGGER IF EXISTS audit_appointments ON public.appointments;
CREATE TRIGGER audit_appointments
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.audit_changes();

-- Step 5: Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
-- Only admins can read audit logs
CREATE POLICY "audit_log_select_admins"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Service role can insert (via triggers)
CREATE POLICY "audit_log_insert_service_role"
  ON public.audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Step 7: Create helper function to query audit logs
CREATE OR REPLACE FUNCTION public.get_audit_logs(
  p_table_name TEXT DEFAULT NULL,
  p_record_id TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  table_name TEXT,
  record_id TEXT,
  action TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT
    al.id,
    al.user_id,
    al.table_name,
    al.record_id,
    al.action,
    al.old_data,
    al.new_data,
    al.created_at
  FROM public.audit_log al
  WHERE (p_table_name IS NULL OR al.table_name = p_table_name)
    AND (p_record_id IS NULL OR al.record_id = p_record_id)
    AND (p_user_id IS NULL OR al.user_id = p_user_id)
  ORDER BY al.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_audit_logs TO authenticated;

COMMIT;
