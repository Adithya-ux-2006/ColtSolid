-- Migration 027: Add rate limiting for analytics inserts
-- Creates a function to check rate limits before allowing analytics inserts
-- Limits: 10 events per session per minute for search_events, remedy_events, remedy_feedback

BEGIN;

-- Step 1: Create rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_session_id TEXT,
  p_table_name TEXT,
  p_limit INTEGER DEFAULT 10,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Count recent events from this session
  EXECUTE format(
    'SELECT COUNT(*) FROM public.%I WHERE session_id = $1 AND created_at > now() - interval ''%s seconds''',
    p_table_name,
    p_window_seconds
  ) INTO v_count USING p_session_id;

  -- Allow if under limit
  RETURN v_count < p_limit;
END;
$$;

-- Step 2: Create rate-limited insert functions for each analytics table

-- Search events rate limiter
CREATE OR REPLACE FUNCTION public.insert_search_event(
  p_session_id TEXT,
  p_source TEXT,
  p_query_text TEXT DEFAULT '',
  p_symptom_ids TEXT[] DEFAULT '{}',
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Check rate limit
  IF NOT public.check_rate_limit(p_session_id, 'search_events', 10, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 10 searches per minute.';
  END IF;

  -- Insert event
  INSERT INTO public.search_events (user_id, session_id, source, query_text, symptom_ids)
  VALUES (p_user_id, p_session_id, p_source, p_query_text, p_symptom_ids)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Remedy events rate limiter
CREATE OR REPLACE FUNCTION public.insert_remedy_event(
  p_session_id TEXT,
  p_remedy_id TEXT,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}',
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Check rate limit
  IF NOT public.check_rate_limit(p_session_id, 'remedy_events', 20, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 20 remedy events per minute.';
  END IF;

  -- Insert event
  INSERT INTO public.remedy_events (user_id, session_id, remedy_id, event_type, metadata)
  VALUES (p_user_id, p_session_id, p_remedy_id, p_event_type, p_metadata)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Remedy feedback rate limiter
CREATE OR REPLACE FUNCTION public.insert_remedy_feedback(
  p_session_id TEXT,
  p_remedy_id TEXT,
  p_vote TEXT,
  p_feedback_text TEXT DEFAULT '',
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Check rate limit (5 feedback per minute)
  IF NOT public.check_rate_limit(p_session_id, 'remedy_feedback', 5, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 5 feedback submissions per minute.';
  END IF;

  -- Insert feedback
  INSERT INTO public.remedy_feedback (user_id, session_id, remedy_id, vote, feedback_text)
  VALUES (p_user_id, p_session_id, p_remedy_id, p_vote, p_feedback_text)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Step 3: Update RLS policies to use functions instead of direct inserts
-- Drop old direct insert policies
DROP POLICY IF EXISTS "Anyone can insert search events" ON public.search_events;
DROP POLICY IF EXISTS "Anyone can insert remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Anyone can insert remedy feedback" ON public.remedy_feedback;

-- Create new policies that only allow service role (functions handle auth)
CREATE POLICY "Service role can insert search events"
  ON public.search_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert remedy events"
  ON public.remedy_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert remedy feedback"
  ON public.remedy_feedback
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Step 4: Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_search_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_remedy_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_remedy_feedback TO authenticated;

-- Also grant to anon for anonymous analytics
GRANT EXECUTE ON FUNCTION public.insert_search_event TO anon;
GRANT EXECUTE ON FUNCTION public.insert_remedy_event TO anon;
GRANT EXECUTE ON FUNCTION public.insert_remedy_feedback TO anon;

COMMIT;
