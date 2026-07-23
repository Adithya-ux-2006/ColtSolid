-- 016: Sexual wellness category
-- Adds symptoms, remedies, and symptom-remedy mappings for sexual wellness
-- NOTE: Run 015 first. If remedies_category_check blocks 'Conventional', run:
-- ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_category_check;
-- ALTER TABLE public.remedies ADD CONSTRAINT remedies_category_check
--   CHECK (category IN ('Lifestyle', 'Natural', 'TCM', 'Ayurveda', 'Conventional'));

BEGIN;

-- New symptoms
INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('low_libido', 'Low Libido', '💭', 'amber'),
  ('erectile_difficulty', 'Erectile Difficulty', '💙', 'sage'),
  ('vaginal_dryness', 'Vaginal Dryness', '🌸', 'forest'),
  ('painful_intercourse', 'Painful Intercourse', '⚠️', 'amber')
ON CONFLICT (id) DO NOTHING;

-- New remedies
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, time_to_effect, difficulty, cost, is_featured) VALUES
  ('rem_101', 'Sleep & Stress Reset Routine', 'Lifestyle', 4.3, 0,
   'Addresses two of the most common drivers of low desire - poor sleep and chronic stress.',
   'Low libido is frequently linked to chronic stress and sleep deprivation rather than a standalone issue. A consistent sleep schedule paired with a daily stress-reduction practice can meaningfully improve desire over several weeks.',
   '1. Keep a consistent sleep and wake time. 2. Add a 10-minute wind-down routine before bed. 3. Practice a short breathing or mindfulness exercise daily. 4. Reassess after 3-4 weeks.',
   'Not a substitute for medical evaluation if low libido is sudden, distressing, or persists despite lifestyle changes.',
   '2-4 weeks', 'Moderate', '$', false),
  ('rem_102', 'Maca Root Supplement', 'Natural', 4.1, 0,
   'A Peruvian root used traditionally to support energy and libido.',
   'Maca root has been studied in small clinical trials for its effect on sexual desire, independent of hormone levels. Effects are generally modest and build over weeks of consistent use.',
   '1. Take 1.5-3g daily with food. 2. Allow 6-8 weeks before assessing effect. 3. Discuss with a doctor if on other supplements.',
   'Avoid if you have a thyroid condition without medical guidance. Consult a doctor before use during pregnancy or breastfeeding.',
   '6-8 weeks', 'Easy', '$$', false),
  ('rem_103', 'Pelvic Floor Relaxation Exercises', 'Lifestyle', 4.2, 0,
   'Gentle pelvic floor and breathing exercises that reduce performance-anxiety-linked tension.',
   'Pelvic floor tension driven by stress or anxiety can contribute to both erectile difficulty and painful intercourse. Guided relaxation exercises paired with diaphragmatic breathing can reduce this tension over time.',
   '1. Lie down comfortably and breathe deeply into the belly. 2. Consciously relax the pelvic floor on each exhale. 3. Practice for 5-10 minutes daily.',
   'If pain is severe, sudden, or accompanied by other symptoms, see a doctor rather than self-treating.',
   '3-6 weeks', 'Moderate', '$', false),
  ('rem_104', 'Water-Based Personal Lubricant', 'Conventional', 4.7, 0,
   'The most immediate, well-established relief for dryness-related discomfort during intercourse.',
   'Water-based lubricants are a first-line, low-risk option for vaginal dryness, regardless of underlying cause. They are condom-safe and provide immediate relief.',
   '1. Apply a small amount as needed before intercourse. 2. Reapply as needed. 3. Choose fragrance-free, glycerin-free formulas if prone to irritation.',
   'Avoid oil-based lubricants with latex condoms. Discontinue if irritation occurs.',
   'Immediate', 'Easy', '$', true),
  ('rem_105', 'Vaginal Moisturizer (Non-Hormonal)', 'Conventional', 4.4, 0,
   'A longer-acting option than lubricant, used regularly rather than only during intercourse.',
   'Unlike lubricants, vaginal moisturizers are applied every few days to maintain tissue hydration over time, commonly recommended for dryness linked to menopause or hormonal changes.',
   '1. Apply every 2-3 days as directed. 2. Allow several weeks for full effect. 3. Consult a doctor if dryness persists.',
   'See a doctor if dryness is accompanied by bleeding, unusual discharge, or pain unrelated to intercourse.',
   '1-2 weeks', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- Symptom-remedy scored mappings (uses symptom_remedies table from migration 009)
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('low_libido', 'rem_101', 5, 2),
  ('low_libido', 'rem_102', 5, 3),
  ('erectile_difficulty', 'rem_103', 5, 1),
  ('painful_intercourse', 'rem_103', 5, 2),
  ('vaginal_dryness', 'rem_104', 8, 1),
  ('painful_intercourse', 'rem_104', 8, 1),
  ('vaginal_dryness', 'rem_105', 6, 2)
ON CONFLICT (symptom_id, remedy_id) DO NOTHING;

COMMIT;
