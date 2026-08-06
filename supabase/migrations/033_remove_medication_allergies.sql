-- Migration 020: Remove 'medication-allergies' from user health profiles
-- The option is being removed from onboarding and the rest of the app.
-- Strip any previously stored value so existing profiles are cleaned up.

UPDATE public.users
SET known_allergies = array_remove(known_allergies, 'medication-allergies')
WHERE known_allergies IS NOT NULL
  AND 'medication-allergies' = ANY(known_allergies);
