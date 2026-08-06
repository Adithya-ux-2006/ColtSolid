-- Migration 030: Merge junction tables
-- Combines remedy_symptoms and symptom_remedies into a single canonical table
-- remedy_symptoms becomes the single source of truth with evidence_score and priority_rank

BEGIN;

-- Step 1: Add evidence_score and priority_rank columns to remedy_symptoms
ALTER TABLE public.remedy_symptoms
  ADD COLUMN IF NOT EXISTS evidence_score INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS priority_rank INTEGER DEFAULT 5;

-- Step 2: Migrate data from symptom_remedies to remedy_symptoms
-- Copy evidence_score and priority_rank where they exist
UPDATE public.remedy_symyps rs
SET
  evidence_score = COALESCE(sr.evidence_score, 5),
  priority_rank = COALESCE(sr.priority_rank, 5)
FROM public.symptom_remedies sr
WHERE rs.remedy_id = sr.remedy_id
  AND rs.symptom_id = sr.symptom_id;

-- Step 3: Insert any missing mappings from symptom_remedies
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength, evidence_score, priority_rank)
SELECT
  sr.remedy_id,
  sr.symptom_id,
  'primary',  -- Default match_strength for migrated data
  COALESCE(sr.evidence_score, 5),
  COALESCE(sr.priority_rank, 5)
FROM public.symptom_remedies sr
WHERE NOT EXISTS (
  SELECT 1 FROM public.remedy_symptoms rs
  WHERE rs.remedy_id = sr.remedy_id
    AND rs.symptom_id = sr.symptom_id
)
ON CONFLICT (remedy_id, symptom_id) DO NOTHING;

-- Step 4: Create view for backward compatibility
CREATE OR REPLACE VIEW public.symptom_remedies_view AS
SELECT
  symptom_id,
  remedy_id,
  evidence_score,
  priority_rank
FROM public.remedy_symptoms;

-- Step 5: Update RLS policy for the view
DROP POLICY IF EXISTS "Anyone can read symptom remedies" ON public.symptom_remedies;
DROP POLICY IF EXISTS "Allow public read access to symptom_remedies" ON public.symptom_remedies;

-- Step 6: Drop the old table (after confirming data migration)
-- First, verify no code references symptom_remedies directly
DO $$
BEGIN
  -- Log warning about dropped table
  RAISE NOTICE 'Table symptom_remedies will be dropped. Use remedy_symptoms instead.';
END $$;

DROP TABLE IF EXISTS public.symptom_remedies;

-- Step 7: Update remedy_symptoms RLS policy
DROP POLICY IF EXISTS "Allow public read access to remedy_symptoms" ON public.remedy_symptoms;
CREATE POLICY "remedy_symptoms_select_public"
  ON public.remedy_symptoms
  FOR SELECT
  TO public
  USING (true);

-- Service role can manage (for migrations and sync scripts)
CREATE POLICY "remedy_symptoms_all_service_role"
  ON public.remedy_symptoms
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;
