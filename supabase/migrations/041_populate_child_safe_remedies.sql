-- Migration 041: Populate child_safe and child_safety_note for remedies
-- Defines which remedies are safe for children based on medical guidelines

BEGIN;

-- Child SAFE remedies (generally safe for children with appropriate dosing/guidance)
UPDATE public.remedies SET
  child_safe = true,
  child_safety_note = 'Generally safe for children when used as directed. Consult pediatrician for children under 2.'
WHERE id IN (
  'rem_004', 'rem_021', 'rem_034', 'rem_041', 'rem_040',
  'rem_101', 'rem_103', 'rem_104', 'rem_105', 'rem_016',
  'rem_019', 'rem_106', 'rem_044', 'rem_001', 'rem_022',
  'rem_023', 'rem_045', 'rem_007'
);

-- Child SAFE but needs pediatrician guidance
UPDATE public.remedies SET
  child_safe = true,
  child_safety_note = 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.'
WHERE id IN (
  'rem_006', 'rem_009', 'rem_011', 'rem_026', 'rem_028',
  'rem_030', 'rem_033', 'rem_036', 'rem_037', 'rem_039',
  'rem_035'
);

-- NOT child safe / needs doctor guidance
UPDATE public.remedies SET
  child_safe = false,
  child_safety_note = 'Not recommended for children without clinician guidance.'
WHERE id IN (
  'rem_h04', 'rem_008', 'rem_010', 'rem_012', 'rem_013',
  'rem_014', 'rem_015', 'rem_017', 'rem_018', 'rem_020',
  'rem_024', 'rem_025', 'rem_027', 'rem_029', 'rem_031',
  'rem_032', 'rem_038', 'rem_102', 'rem_104', 'rem_105'
);

COMMIT;