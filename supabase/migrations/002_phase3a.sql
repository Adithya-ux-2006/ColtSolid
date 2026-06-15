ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS common_conditions text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS known_allergies text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS treatment_prefs text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS has_completed_onboarding boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notify_nearby_launch boolean DEFAULT false;

ALTER TABLE public.remedies
  ADD COLUMN IF NOT EXISTS allergen_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contraindications text[] DEFAULT '{}';

UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen'] WHERE id = 'rem_h01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_h02';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_h03';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_c01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_c03';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen'] WHERE id = 'rem_c05';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_a01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_a02';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_i01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen'] WHERE id = 'rem_i02';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_i03';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_n01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen'] WHERE id = 'rem_n02';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal'] WHERE id = 'rem_s01';
UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen'] WHERE id = 'rem_s02';

SELECT column_name FROM information_schema.columns
WHERE table_name = 'users';
