-- 014: Add symptom_remedies entries for congestion, cough, and other orphan symptoms
-- Fixes "blocked nose → congestion → no remedies" bug

BEGIN;

-- ==============================================================
-- 1. Add symptom_remedies for CONGESTION
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('congestion', 'rem_c09', 7, 10),
  ('congestion', 'rem_c10', 6, 9),
  ('congestion', 'rem_c06', 6, 8),
  ('congestion', 'rem_c02', 5, 8),
  ('congestion', 'rem_c04', 5, 7),
  ('congestion', 'rem_c01', 3, 5)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- ==============================================================
-- 2. Add symptom_remedies for COUGH
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('cough', 'rem_c09', 7, 10),
  ('cough', 'rem_c05', 7, 9),
  ('cough', 'rem_c06', 6, 8),
  ('cough', 'rem_st06', 5, 7),
  ('cough', 'rem_c01', 4, 6),
  ('cough', 'rem_c02', 3, 5)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- ==============================================================
-- 3. Add remedy_symptoms entries linking congestion/cough to remedies
-- ==============================================================
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength) VALUES
  ('rem_c09', 'congestion', 'primary'),
  ('rem_c10', 'congestion', 'primary'),
  ('rem_c06', 'congestion', 'secondary'),
  ('rem_c02', 'congestion', 'primary'),
  ('rem_c04', 'congestion', 'primary'),
  ('rem_c01', 'congestion', 'secondary'),
  ('rem_c09', 'cough', 'primary'),
  ('rem_c05', 'cough', 'primary'),
  ('rem_c06', 'cough', 'secondary'),
  ('rem_st06', 'cough', 'secondary'),
  ('rem_c01', 'cough', 'secondary'),
  ('rem_c02', 'cough', 'secondary')
ON CONFLICT (remedy_id, symptom_id) DO UPDATE SET
  match_strength = EXCLUDED.match_strength;

COMMIT;
