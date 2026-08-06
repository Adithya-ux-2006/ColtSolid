-- Migration 026: Add missing foreign key constraints
-- Adds FK constraints to remedy_schedules and remedy_interactions

BEGIN;

-- Step 1: Add FK for remedy_schedules.remedy_id → remedies(id)
-- First, clean up any orphaned records
DELETE FROM public.remedy_schedules
WHERE remedy_id NOT IN (SELECT id FROM public.remedies);

-- Add the FK constraint
ALTER TABLE public.remedy_schedules
  ADD CONSTRAINT fk_remedy_schedules_remedy_id
  FOREIGN KEY (remedy_id) REFERENCES public.remedies(id)
  ON DELETE SET NULL;

-- Step 2: Add FK for remedy_interactions.remedy_id → remedies(id)
-- Clean up orphaned records
DELETE FROM public.remedy_interactions
WHERE remedy_id NOT IN (SELECT id FROM public.remedies);

ALTER TABLE public.remedy_interactions
  ADD CONSTRAINT fk_remedy_interactions_remedy_id
  FOREIGN KEY (remedy_id) REFERENCES public.remedies(id)
  ON DELETE CASCADE;

-- Step 3: Add FK for remedy_interactions.symptom_id → symptoms(id)
-- Clean up orphaned records
DELETE FROM public.remedy_interactions
WHERE symptom_id NOT IN (SELECT id FROM public.symptoms);

ALTER TABLE public.remedy_interactions
  ADD CONSTRAINT fk_remedy_interactions_symptom_id
  FOREIGN KEY (symptom_id) REFERENCES public.symptoms(id)
  ON DELETE CASCADE;

-- Step 4: Add index for remedy_schedules.user_id (already used in RLS)
CREATE INDEX IF NOT EXISTS idx_remedy_schedules_user_id
  ON public.remedy_schedules (user_id);

COMMIT;
