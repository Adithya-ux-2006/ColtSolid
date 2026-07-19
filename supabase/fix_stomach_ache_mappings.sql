-- =====================================================
-- FIX: stomach_ache remedy mappings
-- Safe to run directly against production
-- =====================================================

-- 1. Ensure stomach_ache symptom exists
INSERT INTO public.symptoms (id, label, emoji, color)
VALUES ('stomach_ache', 'Stomach Ache', '🤢', 'sage')
ON CONFLICT (id) DO NOTHING;

-- 2. Add symptom_remedies (stomach_ache → digestive remedies)
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
VALUES
  ('stomach_ache', 'rem_bg01', 9, 10),  -- Peppermint Bloating Tea
  ('stomach_ache', 'rem_bg02', 8, 9),   -- Post-Meal Walk
  ('stomach_ache', 'rem_n01', 8, 9),    -- Ginger Capsules
  ('stomach_ache', 'rem_n02', 7, 8),    -- Peppermint Tea
  ('stomach_ache', 'rem_n03', 7, 8),    -- P6 Wrist Acupressure
  ('stomach_ache', 'rem_c05', 6, 7)     -- Vitamin C (mild digestive support)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- 3. Add reverse mapping (remedy_symptoms)
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength)
VALUES
  ('rem_bg01', 'stomach_ache', 'primary'),
  ('rem_bg02', 'stomach_ache', 'primary'),
  ('rem_n01', 'stomach_ache', 'primary'),
  ('rem_n02', 'stomach_ache', 'primary'),
  ('rem_n03', 'stomach_ache', 'primary')
ON CONFLICT DO NOTHING;

-- 4. Verify: should return 6 rows
SELECT sr.symptom_id, sr.remedy_id, s.label, r.name
FROM public.symptom_remedies sr
JOIN public.symptoms s ON s.id = sr.symptom_id
JOIN public.remedies r ON r.id = sr.remediy_id
WHERE sr.symptom_id = 'stomach_ache'
ORDER BY sr.priority_rank DESC;
