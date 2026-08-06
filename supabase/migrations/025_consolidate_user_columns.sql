-- Migration 025: Consolidate duplicate user columns
-- Removes redundant university/year columns, keeping university_name/current_year as canonical
-- Merges data from legacy columns before dropping them

BEGIN;

-- Step 1: Migrate data from legacy columns to canonical columns
-- Copy university → university_name where university_name is NULL
UPDATE public.users
SET university_name = university
WHERE university_name IS NULL AND university IS NOT NULL;

-- Copy year → current_year where current_year is NULL
UPDATE public.users
SET current_year = year
WHERE current_year IS NULL AND year IS NULL;

-- Step 2: Drop legacy columns
ALTER TABLE public.users DROP COLUMN IF EXISTS university;
ALTER TABLE public.users DROP COLUMN IF EXISTS year;

-- Step 3: Update handle_new_user trigger to only use canonical columns
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, university_email, university_name, current_year, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Student'),
    NEW.raw_user_meta_data ->> 'university_email',
    NEW.raw_user_meta_data ->> 'university_name',
    NEW.raw_user_meta_data ->> 'current_year',
    COALESCE(NEW.raw_user_meta_data ->> 'gender', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    university_email = EXCLUDED.university_email,
    university_name = EXCLUDED.university_name,
    current_year = EXCLUDED.current_year,
    gender = EXCLUDED.gender;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add NOT NULL constraint to canonical columns if data exists
-- Only enforce if table has data (otherwise allow NULL for new users)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users LIMIT 1) THEN
    ALTER TABLE public.users ALTER COLUMN university_name SET NOT NULL;
    ALTER TABLE public.users ALTER COLUMN current_year SET NOT NULL;
  END IF;
END $$;

COMMIT;
