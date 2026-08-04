-- 022: Remedy Interactions — anonymous usage tracking for popularity-based re-ranking
-- Tracks favorites, schedule additions, and detail views as aggregate signals

BEGIN;

CREATE TABLE IF NOT EXISTS public.remedy_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symptom_id TEXT NOT NULL,
    remedy_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('favorite', 'schedule_add', 'detail_view')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_remedy_interactions_lookup
    ON public.remedy_interactions (symptom_id, remedy_id, event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_remedy_interactions_recent
    ON public.remedy_interactions (created_at DESC);

-- RLS: public can insert (anonymous tracking), admin can read
ALTER TABLE public.remedy_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert interactions" ON public.remedy_interactions;
CREATE POLICY "Public can insert interactions"
    ON public.remedy_interactions
    FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read interactions" ON public.remedy_interactions;
CREATE POLICY "Admins can read interactions"
    ON public.remedy_interactions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

COMMIT;
