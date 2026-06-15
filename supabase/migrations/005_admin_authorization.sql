ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

DROP POLICY IF EXISTS "Authenticated users can read search events" ON public.search_events;
DROP POLICY IF EXISTS "Authenticated admins can read search events" ON public.search_events;
CREATE POLICY "Authenticated admins can read search events"
  ON public.search_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can read remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Authenticated admins can read remedy events" ON public.remedy_events;
CREATE POLICY "Authenticated admins can read remedy events"
  ON public.remedy_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can read remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Authenticated admins can read remedy feedback" ON public.remedy_feedback;
CREATE POLICY "Authenticated admins can read remedy feedback"
  ON public.remedy_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
