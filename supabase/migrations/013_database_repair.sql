-- 013_database_repair.sql
-- Fixes orphan references, missing symptoms, and broken alias targets

BEGIN;

-- ==============================================================
-- 1. Add missing 'migraine' symptom
-- ==============================================================
INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('migraine', 'Migraine', '🤕', 'forest')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- 2. Create leg_pain remedies that were referenced but never created
-- ==============================================================
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_lp01', 'Rest, Ice, and Elevation Protocol', 'Lifestyle', 4.3, 234, 'Elevation and ice reduce swelling and improve recovery for general leg pain.', 'Ice reduces acute inflammation while elevation uses gravity to improve venous return. Together they form the standard first-line approach for most leg pain without fracture.', 'Apply ice pack to painful area 15-20 min. Elevate leg on 2-3 pillows above heart level. Rest for 24-48 hours before gradual return to activity.', 'Do not apply ice directly to skin. Suspected DVT or fracture requires medical attention. Seek care if calf is red, warm, or swollen.', ARRAY[]::text[], ARRAY['suspected_dvt', 'fracture'], 'Immediate', 'Easy', 'Free', false),
('rem_lp02', 'Gentle Calf & Hamstring Stretch', 'Lifestyle', 4.2, 187, 'Static stretching of posterior leg muscles to relieve tension and improve flexibility.', 'Gentle sustained stretching reduces muscle tension, improves circulation, and can alleviate mild leg soreness from prolonged standing or sitting.', 'Hold each stretch for 30s without bouncing: calf stretch against wall, seated hamstring stretch, standing quadriceps stretch. Repeat 2-3 rounds daily.', 'Stretch only to mild tension, not pain. Not for acute injuries.', ARRAY[]::text[], ARRAY['acute_muscle_tear'], '5-10 minutes', 'Easy', 'Free', false),
('rem_kp01', 'Rest, Ice, and Knee Protection', 'Lifestyle', 4.3, 198, 'Standard first-line protocol for acute knee pain with protection and ice.', 'Rest, ice, compression, and elevation (RICE) reduce acute knee inflammation. Protection prevents aggravating the injury.', 'Rest from painful activity. Ice 15-20 min every 2-3 hours. Use compression wrap. Elevate knee above heart. Switch to gentle motion after 48h.', 'Do not ice directly on skin. If knee locks or gives way, see a practitioner.', ARRAY[]::text[], ARRAY['knee_locking', 'fracture'], 'Immediate', 'Easy', 'Free', false),
('rem_kp02', 'Knee Straight Leg Raise', 'Lifestyle', 4.4, 256, 'Foundational quadriceps exercise that stabilizes the knee without joint stress.', 'Straight leg raises strengthen the quadriceps (specifically VMO) without bending the knee, making it safe for most knee pain.', 'Lie on back. Bend one knee, keep other straight. Tighten quad of straight leg. Lift 6-12 inches, hold 5s. Lower slowly. 3x15 daily.', 'Do not through sharp pain. If pain increases, stop and consult.', ARRAY[]::text[], ARRAY['acute_knee_injury'], 'Immediate', 'Easy', 'Free', false),
('rem_np01', 'Neck Heat Therapy', 'Lifestyle', 4.5, 312, 'Moist heat application that relaxes cervical muscles and relieves neck stiffness.', 'Heat increases blood flow to cervical muscles, reduces muscle guarding, and helps restore pain-free range of motion.', 'Apply warm moist towel or heating pad to neck for 15-20 min. Use 2-3 times daily. Gentle neck mobility after heat.', 'Avoid heat on numb areas or acute trauma. Not for cervical fracture or instability.', ARRAY[]::text[], ARRAY['cervical_fracture', 'cervical_instability'], '15-30 minutes', 'Easy', 'Free', false),
('rem_np02', 'Cervical Roll Support', 'Lifestyle', 4.1, 145, 'Using a cervical roll to maintain healthy neck curvature during sleep and rest.', 'A cervical roll supports the natural lordotic curve of the neck, reducing muscle strain during sleep and rest.', 'Place roll inside pillowcase at neck curve. Sleep on back or side with neutral spine. Replace every 6 months.', 'Not for acute whiplash or cervical injury.', ARRAY[]::text[], ARRAY['acute_whiplash'], '1-7 days cumulative', 'Easy', 'Low', false),
('rem_sp01', 'Rest and Ice for Shoulder', 'Lifestyle', 4.3, 176, 'Immediate first aid for acute shoulder pain with ice and activity modification.', 'Ice reduces acute inflammation. Rest prevents aggravating the rotator cuff or deltoid during initial pain phase.', 'Ice shoulder 15-20 min every 2-3 hours. Avoid overhead lifting and reaching behind. Sling only if needed for comfort (max 48h).', 'Do not immobilize for more than 48h without guidance. Seek care for weakness or severe pain.', ARRAY[]::text[], ARRAY['rotator_cuff_tear', 'fracture'], 'Immediate', 'Easy', 'Free', false),
('rem_sp02', 'Shoulder Pendulum Exercise', 'Lifestyle', 4.4, 234, 'Codman pendulum exercise that maintains shoulder mobility during recovery.', 'Gentle circumduction reduces adhesive capsulitis risk and promotes synovial fluid circulation without stressing the rotator cuff.', 'Lean forward supporting body with one hand. Let affected arm hang. Swing small circles (10 each direction). Perform 2-3x daily within pain-free range.', 'Pendulums only. Avoid any lifting or strengthening during acute phase.', ARRAY[]::text[], ARRAY['acute_rotator_cuff_tear', 'shoulder_fracture'], 'Immediate', 'Easy', 'Free', false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- 3. Add match_strength settings for newly created remedies + missing symptoms
-- ==============================================================
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength) VALUES
  ('rem_lp01', 'leg_pain', 'primary'),
  ('rem_lp02', 'leg_pain', 'primary'),
  ('rem_kp01', 'knee_pain', 'primary'),
  ('rem_kp02', 'knee_pain', 'primary'),
  ('rem_np01', 'neck_pain', 'primary'),
  ('rem_np02', 'neck_pain', 'primary'),
  ('rem_sp01', 'shoulder_pain', 'primary'),
  ('rem_sp02', 'shoulder_pain', 'primary')
ON CONFLICT (remedy_id, symptom_id) DO UPDATE SET
  match_strength = EXCLUDED.match_strength;

-- ==============================================================
-- 4. Add symptom_remedies entries for the orphan symptom groups
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
SELECT rs.symptom_id, rs.remedy_id,
  CASE WHEN pc.count >= 2 THEN 8 WHEN pc.count = 1 THEN 5 ELSE 3 END AS evidence_score,
  5 AS priority_rank
FROM public.remedy_symptoms rs
LEFT JOIN (
  SELECT remedy_id, COUNT(*) AS count
  FROM public.research_papers
  GROUP BY remedy_id
) pc ON pc.remedy_id = rs.remedy_id
WHERE rs.remedy_id IN ('rem_lp01','rem_lp02','rem_kp01','rem_kp02','rem_np01','rem_np02','rem_sp01','rem_sp02')
  AND rs.symptom_id IN ('leg_pain','knee_pain','neck_pain','shoulder_pain')
ON CONFLICT (symptom_id, remedy_id) DO NOTHING;

-- ==============================================================
-- 5. Fix placeholder emojis in symptoms (cosmetic)
-- ==============================================================
UPDATE public.symptoms SET emoji = '🦵' WHERE id = 'leg_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🦵' WHERE id = 'knee_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🧘' WHERE id = 'neck_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '💪' WHERE id = 'shoulder_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🤧' WHERE id = 'cough' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🫁' WHERE id = 'congestion' AND emoji = '??';
UPDATE public.symptoms SET emoji = '😤' WHERE id = 'sinus_pressure' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🍽️' WHERE id = 'indigestion' AND emoji = '???';
UPDATE public.symptoms SET emoji = '🔥' WHERE id = 'heartburn' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🫧' WHERE id = 'constipation' AND emoji = '??';
UPDATE public.symptoms SET emoji = '💧' WHERE id = 'diarrhea' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🌫️' WHERE id = 'brain_fog' AND emoji = '???';
UPDATE public.symptoms SET emoji = '😮‍💨' WHERE id = 'burnout' AND emoji = '?????';
UPDATE public.symptoms SET emoji = '🦶' WHERE id = 'joint_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '💪' WHERE id = 'muscle_pain' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🧴' WHERE id = 'dry_skin' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🧏' WHERE id = 'acne' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🌙' WHERE id = 'pms' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🌸' WHERE id = 'menopause' AND emoji = '??';
UPDATE public.symptoms SET emoji = '💧' WHERE id = 'dehydration' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🔋' WHERE id = 'low_energy' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🤕' WHERE id = 'stomach_ache' AND emoji = '??';
UPDATE public.symptoms SET emoji = '🫧' WHERE id = 'gas' AND emoji = '??';

COMMIT;
