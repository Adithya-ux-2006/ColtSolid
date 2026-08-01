-- 020: Age range, child-safety metadata, and TCM category removal

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS age_range TEXT;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_age_range_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_age_range_check
  CHECK (age_range IS NULL OR age_range IN ('under-12', '12-17', '18-64', '65-plus', 'prefer-not-to-say'));

ALTER TABLE public.remedies
  ADD COLUMN IF NOT EXISTS child_safe BOOLEAN,
  ADD COLUMN IF NOT EXISTS child_safety_note TEXT;

UPDATE public.remedies
SET category = 'Lifestyle'
WHERE category = 'TCM';

UPDATE public.remedies
SET is_purchasable = false
WHERE category = 'Lifestyle'
  AND (
    name ILIKE '%acupressure%'
    OR name ILIKE '%massage%'
    OR name ILIKE '%tai chi%'
    OR name ILIKE '%qi gong%'
    OR name ILIKE '%cupping%'
    OR name ILIKE '%gua sha%'
    OR name ILIKE '%moxibustion%'
    OR name ILIKE '%acupuncture%'
  );

ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_category_check;

ALTER TABLE public.remedies
  ADD CONSTRAINT remedies_category_check
  CHECK (category IN ('Lifestyle', 'Natural', 'Ayurveda', 'Conventional'));
