-- Migration 019: Fix trigger, sync schema with migration state
-- Fixes:
-- 1. handle_new_user trigger had 10 VALUES for 8 columns
-- 2. Adds missing columns to remedies, users, remedy_symptoms
-- 3. Adds missing tables: symptom_remedies, search_events, remedy_events, remedy_feedback, remedy_schedules
-- 4. Adds RLS policies for all new tables

-- ── Fix trigger ──────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, avatar_url, email, role, university_name, current_year)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'),
        NEW.raw_user_meta_data->>'university_name',
        (NEW.raw_user_meta_data->>'current_year')::INTEGER
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Add missing columns ──────────────────────────────────────────────────────
DO $$
BEGIN
    -- remedies.ingredients
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'remedies' AND column_name = 'ingredients'
    ) THEN
        ALTER TABLE public.remedies ADD COLUMN ingredients TEXT[];
    END IF;

    -- users.search_count
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'search_count'
    ) THEN
        ALTER TABLE public.users ADD COLUMN search_count INTEGER DEFAULT 0;
    END IF;

    -- remedy_symptoms.match_strength
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'remedy_symptoms' AND column_name = 'match_strength'
    ) THEN
        ALTER TABLE public.remedy_symptoms ADD COLUMN match_strength TEXT;
    END IF;
END $$;

-- ── Add missing tables ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.symptom_remedies (
    symptom_id TEXT REFERENCES public.symptoms(id) ON DELETE CASCADE,
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    evidence_score NUMERIC(3,2) NOT NULL,
    priority_rank INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (symptom_id, remedy_id)
);

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

CREATE TABLE IF NOT EXISTS public.remedy_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    remedy_id TEXT NOT NULL,
    remedy_name TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    recurrence TEXT NOT NULL DEFAULT 'daily',
    days_of_week TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── Enable RLS ───────────────────────────────────────────────────────────────
ALTER TABLE public.symptom_remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_schedules ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can read symptom remedies" ON public.symptom_remedies;
CREATE POLICY "Anyone can read symptom remedies" ON public.symptom_remedies
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own remedy schedules" ON public.remedy_schedules;
CREATE POLICY "Users can manage own remedy schedules" ON public.remedy_schedules
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert search events" ON public.search_events;
CREATE POLICY "Anyone can insert search events" ON public.search_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can read search events" ON public.search_events;
CREATE POLICY "Authenticated admins can read search events" ON public.search_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true)
    );

DROP POLICY IF EXISTS "Anyone can insert remedy events" ON public.remedy_events;
CREATE POLICY "Anyone can insert remedy events" ON public.remedy_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can read remedy events" ON public.remedy_events;
CREATE POLICY "Authenticated admins can read remedy events" ON public.remedy_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true)
    );

DROP POLICY IF EXISTS "Anyone can insert remedy feedback" ON public.remedy_feedback;
CREATE POLICY "Anyone can insert remedy feedback" ON public.remedy_feedback
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own remedy feedback" ON public.remedy_feedback;
CREATE POLICY "Users can update their own remedy feedback" ON public.remedy_feedback
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated admins can read remedy feedback" ON public.remedy_feedback;
CREATE POLICY "Authenticated admins can read remedy feedback" ON public.remedy_feedback
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true)
    );
