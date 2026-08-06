-- 029: Schedule Completion Tracking
-- Records when a user marks a specific reminder occurrence as completed.
-- One row per (schedule, day): a daily reminder can accumulate one completion
-- per day without overwriting history.

BEGIN;

CREATE TABLE IF NOT EXISTS public.schedule_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    schedule_id UUID REFERENCES public.remedy_schedules(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS schedule_completions_user_completed_at_idx
    ON public.schedule_completions (user_id, completed_at);

ALTER TABLE public.schedule_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own schedule completions" ON public.schedule_completions;
CREATE POLICY "Users can manage their own schedule completions"
    ON public.schedule_completions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMIT;
