-- 025: Merge Ayurveda category into Natural
--
-- Every remedy previously tagged 'Ayurveda' becomes 'Natural', adopting
-- Natural's existing color, icon, and filter behavior. 'Ayurveda' is then
-- dropped from the category check constraint so it can no longer be used.

UPDATE public.remedies
SET category = 'Natural'
WHERE category = 'Ayurveda';

ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_category_check;

ALTER TABLE public.remedies
  ADD CONSTRAINT remedies_category_check
  CHECK (category IN ('Lifestyle', 'Natural', 'Conventional'));
