-- 021: Rename "Anxiety" symptom display label to "Anxious"
-- Display-only change; internal id stays 'anxiety' so routes/links/saved data are unaffected.

UPDATE public.symptoms
SET label = 'Anxious'
WHERE id = 'anxiety';
