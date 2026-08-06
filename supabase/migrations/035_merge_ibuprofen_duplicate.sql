-- 026: Merge duplicate Ibuprofen entries
--
-- The local fallback catalog (src/data/remedies.js) carried a second
-- Ibuprofen row as 'rem_003' with the 'Over-the-Counter' category. The
-- database remedies row 'rem_h04' is the canonical entry. This migration
-- renames it to the user-facing product name so the title matches across
-- the live database and the local fallback after the duplicate id merge.

UPDATE public.remedies
SET name = 'Ibuprofen (Advil / Motrin)',
    category = 'Conventional'
WHERE id = 'rem_h04'
  AND name <> 'Ibuprofen (Advil / Motrin)';
