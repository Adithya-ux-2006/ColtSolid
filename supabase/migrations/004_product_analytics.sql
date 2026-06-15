CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  source TEXT NOT NULL,
  query_text TEXT DEFAULT '',
  symptom_ids TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.remedy_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.remedy_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
  vote TEXT NOT NULL,
  feedback_text TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert search events" ON public.search_events;
DROP POLICY IF EXISTS "Authenticated users can read search events" ON public.search_events;
CREATE POLICY "Anyone can insert search events" ON public.search_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read search events" ON public.search_events FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can insert remedy events" ON public.remedy_events;
DROP POLICY IF EXISTS "Authenticated users can read remedy events" ON public.remedy_events;
CREATE POLICY "Anyone can insert remedy events" ON public.remedy_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read remedy events" ON public.remedy_events FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can insert remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Anyone can update remedy feedback" ON public.remedy_feedback;
DROP POLICY IF EXISTS "Authenticated users can read remedy feedback" ON public.remedy_feedback;
CREATE POLICY "Anyone can insert remedy feedback" ON public.remedy_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update remedy feedback" ON public.remedy_feedback FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can read remedy feedback" ON public.remedy_feedback FOR SELECT USING (auth.role() = 'authenticated');
