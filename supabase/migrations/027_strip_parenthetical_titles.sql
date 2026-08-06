-- 027: Remove parenthetical text from remedy titles
--
-- Strips the parenthetical qualifier from every remedy name so titles are
-- just the core name (e.g. 'Ibuprofen (Advil / Motrin)' -> 'Ibuprofen',
-- 'Vaginal Moisturizer (Non-Hormonal)' -> 'Vaginal Moisturizer').
-- Applied generically so any manually-added DB rows are covered too.
-- Safe to run more than once (no parentheses remain after the first pass).

UPDATE public.remedies
SET name = TRIM(BOTH ' ' FROM regexp_replace(name, '\s*\([^)]*\)', '', 'g'))
WHERE name ~ '\(';
