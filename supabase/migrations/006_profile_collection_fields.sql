ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS university_email text,
  ADD COLUMN IF NOT EXISTS university_name text,
  ADD COLUMN IF NOT EXISTS current_year text,
  ADD COLUMN IF NOT EXISTS gender text;

UPDATE public.users
SET
  university_name = COALESCE(university_name, university),
  current_year = COALESCE(current_year, year)
WHERE university_name IS NULL OR current_year IS NULL;
