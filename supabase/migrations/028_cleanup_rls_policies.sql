-- Migration 028: Cleanup duplicate RLS policies
-- Removes duplicate policy definitions and ensures clean, unique policies

BEGIN;

-- Step 1: Drop all existing analytics policies (will recreate below)
DROP POLICY IF EXISTS "Anyone can insert search events" ON public.search_events;
DROP POLICY IF EXISTS "Authenticated admins can read search events" ON public.search_events;
DROP POLICY IF EXISTS "Authenticated users can read search events" ON public.search_events;
DROP POLICY IF EXISTS "Service role can insert search events" ON public.search_events;

DROP POLICY IF EXISTS "Anyone can insert remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Authenticated admins can read remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Authenticated users can read remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Service role can insert remedy events" ON public.remedy_events;

DROP POLICY IF EXISTS "Anyone can insert remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Authenticated admins can read remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Authenticated users can read remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Service role can insert remedy feedback" ON public.remedy_feedback;

-- Step 2: Recreate clean, unique policies for search_events
CREATE POLICY "search_events_insert_service_role"
  ON public.search_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "search_events_select_admins"
  ON public.search_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Step 3: Recreate clean, unique policies for remedy_events
CREATE POLICY "remedy_events_insert_service_role"
  ON public.remedy_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "remedy_events_select_admins"
  ON public.remedy_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Step 4: Recreate clean, unique policies for remedy_feedback
CREATE POLICY "remedy_feedback_insert_service_role"
  ON public.remedy_feedback
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "remedy_feedback_update_own"
  ON public.remedy_feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "remedy_feedback_select_admins"
  ON public.remedy_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Step 5: Verify all tables have RLS enabled
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'sql_%'
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = t.tablename
      AND rowsecurity = true
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
      RAISE NOTICE 'Enabled RLS on %.%', 'public', t.tablename;
    END IF;
  END LOOP;
END $$;

COMMIT;
