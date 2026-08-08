-- Migration 039: Fix handle_new_user trigger to handle NULL metadata values
-- The trigger was inserting NULL for university_name and current_year when not provided in metadata,
-- but these columns have NOT NULL constraints (added in migration 025).
-- Fix: Use COALESCE to default to empty string instead of NULL.

BEGIN;

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
    COALESCE(NEW.raw_user_meta_data ->> 'university_email', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'university_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'current_year', ''),
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

COMMIT;