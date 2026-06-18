-- 010: Add distinct body-part pain symptoms with dedicated remedies
-- Fixes "leg pain" incorrectly resolving to back_pain

BEGIN;

-- ===== NEW SYMPTOMS =====
INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('leg_pain', 'Leg Pain', '🦵', 'forest'),
  ('knee_pain', 'Knee Pain', '🦵', 'sage'),
  ('neck_pain', 'Neck Pain', '🧘', 'amber'),
  ('shoulder_pain', 'Shoulder Pain', '💪', 'forest')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  color_theme = EXCLUDED.color_theme;

-- ===== NEW REMEDIES =====

-- Leg Pain remedies
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description,
    how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
  ('rem_lp01', 'Rest, Ice, and Elevation Protocol', 'Lifestyle', 4.6, 278,
   'A first-line approach for leg pain, muscle soreness, and mild strains.',
   'Rest, ice, compression, and elevation (RICE) reduce local inflammation and support recovery for common leg pain from overuse, minor injury, or prolonged standing.',
   'Rest the leg. Apply ice wrapped in a cloth for 15-20 minutes every 2-3 hours. Elevate the leg above heart level when resting.',
   'Do not apply ice directly to skin. Seek care for severe swelling, inability to bear weight, or signs of blood clot.',
   ARRAY[]::text[], ARRAY['severe swelling', 'blood clot symptoms'], '1-3 days', 'Easy', '$', true),
  ('rem_lp02', 'Gentle Leg Stretching Routine', 'Lifestyle', 4.3, 156,
   'Light stretching to relieve leg muscle tightness and improve mobility.',
   'Gentle calf, hamstring, and quadriceps stretches can reduce muscle tension and improve circulation when leg pain is related to tightness or mild overuse.',
   'Hold each stretch for 20-30 seconds without bouncing. Stop if pain increases.',
   'Do not stretch through sharp pain or if you suspect a muscle tear.',
   ARRAY[]::text[], ARRAY['muscle tear', 'sharp pain'], '10-20 minutes', 'Easy', '$', false),

  -- Knee Pain remedies
  ('rem_kp01', 'Knee Ice and Rest Therapy', 'Lifestyle', 4.5, 234,
   'Ice and activity modification for knee discomfort and mild strain.',
   'Rest and ice help reduce knee inflammation from prolonged sitting, walking, or minor overuse. Activity modification prevents further irritation.',
   'Apply ice for 15 minutes every 2-3 hours. Avoid high-impact activity until pain subsides.',
   'Seek care for locking, buckling, or inability to fully extend the knee.',
   ARRAY[]::text[], ARRAY['knee locking', 'knee buckling'], '1-3 days', 'Easy', '$', true),
  ('rem_kp02', 'Knee Support and Modified Activity', 'Lifestyle', 4.2, 132,
   'Supportive care for knee pain during daily activity and recovery.',
   'Reducing stair climbing, using a compression sleeve, and avoiding deep knee bends can reduce irritation and support recovery.',
   'Use a compression sleeve during activity. Take short rest breaks when walking. Avoid deep squats or lunges.',
   'Do not use compression if you have vascular issues or numbness.',
   ARRAY[]::text[], ARRAY['vascular conditions', 'numbness'], '1-7 days', 'Easy', '$', false),

  -- Neck Pain remedies
  ('rem_np01', 'Neck Stretching and Warmth Routine', 'Lifestyle', 4.7, 345,
   'Gentle stretches and warmth for neck tension and stiffness.',
   'Neck pain from desk posture, phone use, or sleep position often responds to gentle range-of-motion stretches and a warm compress to relax trapezius and sternocleidomastoid muscles.',
   'Apply a warm cloth or heating pad for 10 minutes. Then slowly tilt, turn, and nod the head within pain-free range.',
   'Stop if pain radiates down the arm or if dizziness occurs.',
   ARRAY[]::text[], ARRAY['radiating arm pain', 'dizziness'], '10-20 minutes', 'Easy', '$', true),
  ('rem_np02', 'Neck Support and Posture Reset', 'Lifestyle', 4.4, 198,
   'Ergonomic adjustments and postural awareness for neck pain prevention.',
   'Aligning the head over the shoulders, adjusting screen height, and using a supportive pillow can significantly reduce recurring neck pain.',
   'Raise screen to eye level. Keep ears aligned over shoulders. Use a cervical curve-supporting pillow at night.',
   'Seek care for persistent numbness, weakness, or loss of coordination.',
   ARRAY[]::text[], ARRAY['persistent numbness', 'weakness'], '1-7 days', 'Easy', '$', false),

  -- Shoulder Pain remedies
  ('rem_sp01', 'Shoulder Ice and Mobility Routine', 'Lifestyle', 4.5, 267,
   'Ice and gentle movement for shoulder soreness and stiffness.',
   'Shoulder pain from repetitive activity, poor posture, or mild strain responds to ice in the acute phase and gentle pendulum/circular mobility exercises.',
   'Apply ice for 15 minutes. Follow with gentle pendulum swings and shoulder rolls for 2-3 minutes. Stop if sharp pain occurs.',
   'Avoid overhead lifting until pain-free. Seek care for inability to raise the arm.',
   ARRAY[]::text[], ARRAY['frozen shoulder', 'rotator cuff injury'], '1-3 days', 'Easy', '$', true),
  ('rem_sp02', 'Shoulder Rest and Posture Check', 'Lifestyle', 4.1, 143,
   'Rest and ergonomic adjustments for shoulder pain from desk work.',
   'Shoulder pain often stems from rounded-forward posture during long study sessions. Rest, scapular retraction exercises, and desk ergonomics can reduce recurrence.',
   'Take breaks every 30 minutes. Roll shoulders back and down. Keep elbows at 90 degrees when typing.',
   'Seek care for sudden severe pain, popping with injury, or arm numbness.',
   ARRAY[]::text[], ARRAY['acute injury', 'arm numbness'], '1-7 days', 'Easy', '$', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  how_to_use = EXCLUDED.how_to_use,
  warnings = EXCLUDED.warnings,
  allergen_tags = EXCLUDED.allergen_tags,
  contraindications = EXCLUDED.contraindications,
  time_to_effect = EXCLUDED.time_to_effect,
  difficulty = EXCLUDED.difficulty,
  cost = EXCLUDED.cost,
  is_featured = EXCLUDED.is_featured;

-- ===== REMEDY_SYMPTOMS MAPPINGS =====
DELETE FROM public.remedy_symptoms WHERE remedy_id IN (
  'rem_lp01','rem_lp02','rem_kp01','rem_kp02',
  'rem_np01','rem_np02','rem_sp01','rem_sp02'
);

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES
  ('rem_lp01', 'leg_pain'),
  ('rem_lp02', 'leg_pain'),
  ('rem_kp01', 'knee_pain'),
  ('rem_kp02', 'knee_pain'),
  ('rem_np01', 'neck_pain'),
  ('rem_np02', 'neck_pain'),
  ('rem_sp01', 'shoulder_pain'),
  ('rem_sp02', 'shoulder_pain')
ON CONFLICT DO NOTHING;

-- ===== SYMPTOM_REMEDIES (CURATED RANKINGS) =====
DELETE FROM public.symptom_remedies WHERE remedy_id IN (
  'rem_lp01','rem_lp02','rem_kp01','rem_kp02',
  'rem_np01','rem_np02','rem_sp01','rem_sp02'
);

INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('leg_pain', 'rem_lp01', 5, 10),
  ('leg_pain', 'rem_lp02', 3, 8),
  ('knee_pain', 'rem_kp01', 5, 10),
  ('knee_pain', 'rem_kp02', 3, 8),
  ('neck_pain', 'rem_np01', 5, 10),
  ('neck_pain', 'rem_np02', 3, 8),
  ('shoulder_pain', 'rem_sp01', 5, 10),
  ('shoulder_pain', 'rem_sp02', 3, 8)
ON CONFLICT DO NOTHING;

COMMIT;
