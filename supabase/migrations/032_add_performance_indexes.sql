-- Migration 032: Add performance indexes
-- Creates indexes for common query patterns

BEGIN;

-- Step 1: Appointments - user calendar queries
CREATE INDEX IF NOT EXISTS idx_appointments_user_id_date
  ON public.appointments (user_id, apt_date);

-- Step 2: Remedy events - user activity history
CREATE INDEX IF NOT EXISTS idx_remedy_events_user_id_created
  ON public.remedy_events (user_id, created_at DESC);

-- Step 3: Search events - symptom array search (GIN index)
CREATE INDEX IF NOT EXISTS idx_search_events_symptom_ids
  ON public.search_events USING GIN (symptom_ids);

-- Step 4: Search events - session tracking
CREATE INDEX IF NOT EXISTS idx_search_events_session_id
  ON public.search_events (session_id);

-- Step 5: Remedy feedback - remedy lookup
CREATE INDEX IF NOT EXISTS idx_remedy_feedback_remedy_id
  ON public.remedy_feedback (remedy_id);

-- Step 6: Favorites - remedy lookup (for "who favorited this remedy" queries)
CREATE INDEX IF NOT EXISTS idx_favorites_remedy_id
  ON public.favorites (remedy_id);

-- Step 7: Research papers - remedy lookup
CREATE INDEX IF NOT EXISTS idx_research_papers_remedy_id
  ON public.research_papers (remedy_id);

-- Step 8: Remedy_symptoms - symptom lookup (for "what remedies treat this symptom" queries)
CREATE INDEX IF NOT EXISTS idx_remedy_symptoms_symptom_id
  ON public.remedy_symptoms (symptom_id);

-- Step 9: Audit log - table_name + created_at for time-range queries
CREATE INDEX IF NOT EXISTS idx_audit_log_table_created
  ON public.audit_log (table_name, created_at DESC);

-- Step 10: Users - admin lookup
CREATE INDEX IF NOT EXISTS idx_users_is_admin
  ON public.users (is_admin) WHERE is_admin = true;

COMMIT;
