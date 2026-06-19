-- 011: Symptom search fix — canonical symptom IDs, primary/secondary mappings, ingredients
-- Fixes cross-contamination: "eye pain" → eye_strain remedies, proper ranking, allergy filtering

BEGIN;

-- ===== 1. ADD MISSING CANONICAL SYMPTOM =====
INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('eye_pain', 'Eye Pain', '👁️', 'forest')
ON CONFLICT (id) DO NOTHING;

-- ===== 2. ADD ingredients COLUMN =====
ALTER TABLE public.remedies
  ADD COLUMN IF NOT EXISTS ingredients TEXT[] DEFAULT '{}';

-- ===== 3. ADD match_strength TO remedy_symptoms =====
ALTER TABLE public.remedy_symptoms
  ADD COLUMN IF NOT EXISTS match_strength TEXT NOT NULL DEFAULT 'primary'
  CHECK (match_strength IN ('primary', 'secondary'));

-- ===== 4. MAP eye_pain TO EXISTING EYE STRAIN REMEDIES =====
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength) VALUES
  ('rem_es01', 'eye_pain', 'primary'),
  ('rem_es02', 'eye_pain', 'primary')
ON CONFLICT (remedy_id, symptom_id) DO UPDATE SET
  match_strength = EXCLUDED.match_strength;

-- ===== 5. ADD eye_pain TO symptom_remedies =====
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('eye_pain', 'rem_es01', 8, 10),
  ('eye_pain', 'rem_es02', 5, 8)
ON CONFLICT (symptom_id, remedy_id) DO NOTHING;

-- ===== 6. SET PRIMARY SYMPTOMS (direct treatment) =====
UPDATE public.remedy_symptoms SET match_strength = 'primary' WHERE
  (remedy_id, symptom_id) IN (
    ('rem_h01', 'headache'), ('rem_h02', 'headache'), ('rem_h03', 'headache'),
    ('rem_h04', 'headache'), ('rem_h05', 'headache'),
    ('rem_c01', 'cold'), ('rem_c02', 'cold'), ('rem_c03', 'cold'),
    ('rem_c04', 'cold'), ('rem_c05', 'cold'),
    ('rem_a01', 'anxiety'), ('rem_a02', 'anxiety'), ('rem_a03', 'anxiety'),
    ('rem_a04', 'anxiety'), ('rem_a05', 'anxiety'),
    ('rem_i01', 'insomnia'), ('rem_i02', 'insomnia'), ('rem_i03', 'insomnia'),
    ('rem_i04', 'insomnia'), ('rem_i05', 'insomnia'),
    ('rem_n01', 'nausea'), ('rem_n02', 'nausea'), ('rem_n03', 'nausea'),
    ('rem_n04', 'nausea'), ('rem_n05', 'nausea'),
    ('rem_s01', 'stress'), ('rem_s02', 'stress'), ('rem_s03', 'stress'),
    ('rem_s04', 'stress'), ('rem_s05', 'stress'),
    ('rem_bp01', 'back_pain'), ('rem_bp02', 'back_pain'), ('rem_bp03', 'back_pain'),
    ('rem_st01', 'sore_throat'), ('rem_st02', 'sore_throat'),
    ('rem_es01', 'eye_strain'), ('rem_es02', 'eye_strain'),
    ('rem_pc01', 'period_cramps'), ('rem_pc02', 'period_cramps'),
    ('rem_fv01', 'fever'), ('rem_fv02', 'fever'),
    ('rem_sr01', 'skin_rash'), ('rem_sr02', 'skin_rash'),
    ('rem_ep01', 'ear_pain'), ('rem_ep02', 'ear_pain'),
    ('rem_bg01', 'bloating'), ('rem_bg02', 'bloating'),
    ('rem_ho01', 'hangover'), ('rem_ho02', 'hangover'),
    ('rem_ft01', 'fatigue'), ('rem_ft02', 'fatigue'),
    ('rem_lp01', 'leg_pain'), ('rem_lp02', 'leg_pain'),
    ('rem_kp01', 'knee_pain'), ('rem_kp02', 'knee_pain'),
    ('rem_np01', 'neck_pain'), ('rem_np02', 'neck_pain'),
    ('rem_sp01', 'shoulder_pain'), ('rem_sp02', 'shoulder_pain')
  );

-- ===== 7. SET SECONDARY SYMPTOMS (indirect / associated benefits) =====
UPDATE public.remedy_symptoms SET match_strength = 'secondary' WHERE
  (remedy_id, symptom_id) IN (
    ('rem_h01', 'stress'), ('rem_h02', 'insomnia'),
    ('rem_h03', 'stress'), ('rem_h04', 'cold'),
    ('rem_h05', 'nausea'), ('rem_c03', 'stress'),
    ('rem_c05', 'nausea'), ('rem_a01', 'stress'),
    ('rem_a02', 'stress'), ('rem_i03', 'anxiety'),
    ('rem_i05', 'stress'), ('rem_n02', 'headache'),
    ('rem_s01', 'anxiety'), ('rem_s02', 'insomnia'),
    ('rem_s03', 'anxiety'), ('rem_s04', 'insomnia'),
    ('rem_s05', 'headache'), ('rem_bp01', 'stress'),
    ('rem_st01', 'cold'), ('rem_st02', 'cold'),
    ('rem_es01', 'fatigue'), ('rem_pc02', 'nausea'),
    ('rem_fv01', 'cold'), ('rem_ep02', 'stress'),
    ('rem_bg01', 'nausea'),
    ('rem_ho01', 'headache'), ('rem_ho01', 'nausea'), ('rem_ho01', 'fatigue'),
    ('rem_ho02', 'nausea'), ('rem_ft01', 'stress')
  );

-- ===== 8. POPULATE ingredients FOR ALL REMEDIES =====
UPDATE public.remedies SET ingredients =
  CASE id
    WHEN 'rem_h01' THEN ARRAY['peppermint oil', 'menthol', 'carrier oil']
    WHEN 'rem_h02' THEN ARRAY['magnesium glycinate', 'cellulose capsule']
    WHEN 'rem_h03' THEN ARRAY[]::text[]
    WHEN 'rem_h04' THEN ARRAY['ibuprofen', 'cellulose', 'silica']
    WHEN 'rem_h05' THEN ARRAY['water', 'electrolytes']
    WHEN 'rem_c01' THEN ARRAY['zinc acetate', 'zinc gluconate', 'natural flavors']
    WHEN 'rem_c02' THEN ARRAY['sodium chloride', 'sodium bicarbonate', 'purified water']
    WHEN 'rem_c03' THEN ARRAY['herbal oil']
    WHEN 'rem_c04' THEN ARRAY['pseudoephedrine hydrochloride']
    WHEN 'rem_c05' THEN ARRAY['honey', 'lemon', 'water']
    WHEN 'rem_a01' THEN ARRAY['l-theanine', 'cellulose capsule']
    WHEN 'rem_a02' THEN ARRAY['ashwagandha root extract', 'cellulose']
    WHEN 'rem_a03' THEN ARRAY[]::text[]
    WHEN 'rem_a04' THEN ARRAY['propranolol hydrochloride']
    WHEN 'rem_a05' THEN ARRAY[]::text[]
    WHEN 'rem_i01' THEN ARRAY['melatonin', 'cellulose', 'magnesium stearate']
    WHEN 'rem_i02' THEN ARRAY['tart cherry concentrate', 'water']
    WHEN 'rem_i03' THEN ARRAY['vaccaria seeds', 'medical tape']
    WHEN 'rem_i04' THEN ARRAY['doxylamine succinate']
    WHEN 'rem_i05' THEN ARRAY[]::text[]
    WHEN 'rem_n01' THEN ARRAY['ginger root extract', 'cellulose capsule']
    WHEN 'rem_n02' THEN ARRAY['peppermint leaves', 'water']
    WHEN 'rem_n03' THEN ARRAY[]::text[]
    WHEN 'rem_n04' THEN ARRAY['ondansetron']
    WHEN 'rem_n05' THEN ARRAY['water', 'electrolytes', 'glucose']
    WHEN 'rem_s01' THEN ARRAY['rhodiola rosea extract', 'cellulose']
    WHEN 'rem_s02' THEN ARRAY['lemon balm leaves', 'water']
    WHEN 'rem_s03' THEN ARRAY[]::text[]
    WHEN 'rem_s04' THEN ARRAY['hydroxyzine']
    WHEN 'rem_s05' THEN ARRAY[]::text[]
    WHEN 'rem_bp01' THEN ARRAY[]::text[]
    WHEN 'rem_bp02' THEN ARRAY[]::text[]
    WHEN 'rem_bp03' THEN ARRAY['turmeric extract', 'curcumin', 'black pepper extract', 'cellulose']
    WHEN 'rem_st01' THEN ARRAY['sodium chloride', 'water']
    WHEN 'rem_st02' THEN ARRAY['honey', 'ginger', 'water']
    WHEN 'rem_es01' THEN ARRAY[]::text[]
    WHEN 'rem_es02' THEN ARRAY['water', 'cotton cloth']
    WHEN 'rem_pc01' THEN ARRAY[]::text[]
    WHEN 'rem_pc02' THEN ARRAY['ginger root extract']
    WHEN 'rem_fv01' THEN ARRAY['water', 'electrolytes']
    WHEN 'rem_fv02' THEN ARRAY['water', 'cotton cloth']
    WHEN 'rem_sr01' THEN ARRAY['colloidal oatmeal', 'water']
    WHEN 'rem_sr02' THEN ARRAY['water', 'cotton cloth']
    WHEN 'rem_ep01' THEN ARRAY['water', 'cotton cloth']
    WHEN 'rem_ep02' THEN ARRAY[]::text[]
    WHEN 'rem_bg01' THEN ARRAY['peppermint leaves', 'water']
    WHEN 'rem_bg02' THEN ARRAY[]::text[]
    WHEN 'rem_ho01' THEN ARRAY['water', 'electrolytes', 'glucose']
    WHEN 'rem_ho02' THEN ARRAY['ginger root', 'mint leaves', 'water']
    WHEN 'rem_ft01' THEN ARRAY[]::text[]
    WHEN 'rem_ft02' THEN ARRAY['protein', 'fiber', 'nuts', 'dairy']
    WHEN 'rem_lp01' THEN ARRAY['ice', 'water']
    WHEN 'rem_lp02' THEN ARRAY[]::text[]
    WHEN 'rem_kp01' THEN ARRAY['ice', 'water']
    WHEN 'rem_kp02' THEN ARRAY[]::text[]
    WHEN 'rem_np01' THEN ARRAY[]::text[]
    WHEN 'rem_np02' THEN ARRAY[]::text[]
    WHEN 'rem_sp01' THEN ARRAY['ice', 'water']
    WHEN 'rem_sp02' THEN ARRAY[]::text[]
    ELSE ARRAY[]::text[]
  END;

COMMIT;
