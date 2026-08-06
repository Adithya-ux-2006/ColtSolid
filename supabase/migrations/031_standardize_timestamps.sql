-- Migration 031: Standardize timestamp columns
-- Ensures all tables have consistent created_at and updated_at columns

BEGIN;

-- Step 1: Create trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Step 2: Add updated_at to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 3: Add updated_at to favorites table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'favorites'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.favorites ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 4: Add updated_at to appointments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'appointments'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 5: Add updated_at to remedy_schedules table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'remedy_schedules'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.remedy_schedules ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 6: Add updated_at to remedies table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'remedies'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.remedies ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 7: Add updated_at to symptoms table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'symptoms'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.symptoms ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Step 8: Create triggers for auto-updating updated_at

-- Users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Favorites
DROP TRIGGER IF EXISTS update_favorites_updated_at ON public.favorites;
CREATE TRIGGER update_favorites_updated_at
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Appointments
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Remedy schedules
DROP TRIGGER IF EXISTS update_remedy_schedules_updated_at ON public.remedy_schedules;
CREATE TRIGGER update_remedy_schedules_updated_at
  BEFORE UPDATE ON public.remedy_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Remedies
DROP TRIGGER IF EXISTS update_remedies_updated_at ON public.remedies;
CREATE TRIGGER update_remedies_updated_at
  BEFORE UPDATE ON public.remedies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Symptoms
DROP TRIGGER IF EXISTS update_symptoms_updated_at ON public.symptoms;
CREATE TRIGGER update_symptoms_updated_at
  BEFORE UPDATE ON public.symptoms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMIT;
