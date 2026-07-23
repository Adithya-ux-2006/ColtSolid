-- 015: Remedy Schedule Tracker
-- Tracks when users should take remedies (recurring or one-time)

BEGIN;

CREATE TABLE IF NOT EXISTS public.remedy_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    remedy_id TEXT NOT NULL,
    remedy_name TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    recurrence TEXT NOT NULL DEFAULT 'daily' CHECK (recurrence IN ('daily', 'weekly', 'once')),
    days_of_week INT[] DEFAULT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.remedy_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own remedy schedules" ON public.remedy_schedules;
CREATE POLICY "Users can manage their own remedy schedules"
    ON public.remedy_schedules
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMIT;
