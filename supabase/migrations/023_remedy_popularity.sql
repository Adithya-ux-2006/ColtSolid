-- 023: Remedy Popularity — pre-computed popularity scores for usage-based re-ranking
-- Refreshed daily by the aggregate-popularity Netlify cron function

BEGIN;

CREATE TABLE IF NOT EXISTS public.remedy_popularity (
    symptom_id TEXT NOT NULL,
    remedy_id TEXT NOT NULL,
    popularity_score NUMERIC DEFAULT 0 CHECK (popularity_score >= 0 AND popularity_score <= 10),
    interaction_count INTEGER DEFAULT 0,
    last_computed TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (symptom_id, remedy_id)
);

-- RLS: public read (needed for client-side ranking), admin write
ALTER TABLE public.remedy_popularity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read popularity" ON public.remedy_popularity;
CREATE POLICY "Public can read popularity"
    ON public.remedy_popularity
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Service role can upsert popularity" ON public.remedy_popularity;
CREATE POLICY "Service role can upsert popularity"
    ON public.remedy_popularity
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

COMMIT;
