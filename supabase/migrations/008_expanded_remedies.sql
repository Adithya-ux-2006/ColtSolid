BEGIN;

INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('back_pain', 'Back Pain', '💪', 'forest'),
  ('sore_throat', 'Sore Throat', '🗣️', 'sage'),
  ('eye_strain', 'Eye Strain', '👀', 'amber'),
  ('period_cramps', 'Period Cramps', '🌙', 'forest'),
  ('fever', 'Fever', '🌡️', 'amber'),
  ('skin_rash', 'Skin Rash', '🩹', 'sage'),
  ('ear_pain', 'Ear Pain', '👂', 'forest'),
  ('bloating', 'Bloating', '🫧', 'sage'),
  ('hangover', 'Hangover', '🥴', 'amber'),
  ('fatigue', 'Fatigue', '🔋', 'forest')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  color_theme = EXCLUDED.color_theme;

INSERT INTO public.remedies (
  id, name, category, rating, review_count, short_description, long_description,
  how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured
) VALUES
  ('rem_bp01', 'Heat Therapy for Back Pain', 'Lifestyle', 4.7, 342, 'Warmth for tight lower-back and muscle pain after long sitting.', 'Heat increases local blood flow and can relax tense muscles that contribute to backache, lower back pain, and study-chair stiffness.', 'Apply a warm pack to the sore area for 15 to 20 minutes. Keep a cloth layer between heat and skin.', 'Avoid heat on fresh injuries, numb skin, swelling, or burns.', ARRAY[]::text[], ARRAY['fresh injury', 'burns', 'numb skin'], '15-30 minutes', 'Easy', '$', true),
  ('rem_bp02', 'Cat-Cow Mobility Break', 'Lifestyle', 4.5, 214, 'Gentle spinal movement for backache and sitting-related stiffness.', 'Slow flexion and extension can reduce muscle guarding and help students reset posture after hours at a desk.', 'Move through cat-cow slowly for 60 to 90 seconds, breathing steadily and staying within a pain-free range.', 'Stop if pain shoots down the leg or numbness appears.', ARRAY[]::text[], ARRAY['radiating pain', 'numbness'], '5-10 minutes', 'Easy', '$', false),
  ('rem_bp03', 'Turmeric Anti-inflammatory', 'Natural', 4.2, 188, 'A natural option for recurring muscle soreness and back discomfort.', 'Curcumin in turmeric has anti-inflammatory properties that may modestly support muscle pain recovery when used consistently.', 'Use turmeric in food or a standardized supplement with meals according to label directions.', 'May interact with blood thinners and can worsen reflux.', ARRAY['herbal'], ARRAY['blood thinners', 'reflux'], '1-2 weeks', 'Easy', '$$', false),
  ('rem_st01', 'Salt Water Gargle', 'Lifestyle', 4.6, 277, 'Simple relief for sore throat irritation and scratchiness.', 'Warm salt water can temporarily reduce throat swelling, loosen mucus, and soothe irritation from dry air or viral colds.', 'Mix half a teaspoon of salt in a mug of warm water. Gargle and spit up to several times daily.', 'Do not swallow large amounts of salt water.', ARRAY[]::text[], ARRAY['salt restriction'], '5-15 minutes', 'Easy', '$', true),
  ('rem_st02', 'Honey Ginger Throat Tea', 'Natural', 4.5, 241, 'Warm honey and ginger for sore throat and cough irritation.', 'Honey coats the throat while ginger adds warming compounds that may ease discomfort during mild upper respiratory symptoms.', 'Steep ginger in hot water, cool until warm, then stir in honey and sip slowly.', 'Use caution with diabetes. Do not give honey to infants.', ARRAY['herbal', 'pollen'], ARRAY['diabetes'], '15-30 minutes', 'Easy', '$', false),
  ('rem_es01', '20-20-20 Screen Reset', 'Lifestyle', 4.8, 506, 'A fast eye strain break for screen fatigue and dry, tired eyes.', 'Looking at a distant target relaxes focusing muscles and can reduce eye strain from long laptop or phone sessions.', 'Every 20 minutes, look 20 feet away for 20 seconds. Blink slowly several times before returning to the screen.', 'Seek care for eye pain, vision loss, or injury.', ARRAY[]::text[], ARRAY['vision loss', 'eye injury'], 'Immediate', 'Easy', '$', true),
  ('rem_es02', 'Warm Eye Compress', 'Lifestyle', 4.4, 193, 'Soothing warmth for screen fatigue and tired eyelids.', 'A warm compress can support tear film comfort and relax muscles around strained eyes after extended reading or coding.', 'Place a warm, clean cloth over closed eyes for 5 to 10 minutes.', 'Do not use heat with eye infection, injury, or significant redness.', ARRAY[]::text[], ARRAY['eye infection', 'eye injury'], '5-10 minutes', 'Easy', '$', false),
  ('rem_pc01', 'Heating Pad for Period Cramps', 'Lifestyle', 4.8, 462, 'Warmth for menstrual cramps and lower-abdominal muscle tension.', 'Heat therapy can reduce period pain by relaxing uterine and abdominal muscles and improving local blood flow.', 'Apply low to medium heat over the lower abdomen for 15 to 20 minutes.', 'Avoid sleeping on an electric heating pad.', ARRAY[]::text[], ARRAY['burn risk'], '15-30 minutes', 'Easy', '$', true),
  ('rem_pc02', 'Ginger for Menstrual Pain', 'Natural', 4.3, 205, 'Ginger support for period cramps and nausea around menstruation.', 'Ginger may reduce prostaglandin-related discomfort and can also help nausea that sometimes comes with menstrual pain.', 'Take ginger tea or capsules with food according to label directions during the first days of cramps.', 'May worsen heartburn or interact with blood thinners.', ARRAY['herbal'], ARRAY['blood thinners', 'heartburn'], '30-60 minutes', 'Easy', '$', false),
  ('rem_fv01', 'Fever Fluids and Rest Plan', 'Lifestyle', 4.6, 319, 'Supportive care for mild fever or high temperature.', 'Fever raises fluid needs. Rest, light clothing, and steady fluids help reduce dehydration and support recovery.', 'Sip water or oral rehydration fluids often, wear breathable layers, and rest in a cool room.', 'Seek urgent care for very high fever, stiff neck, confusion, rash, or trouble breathing.', ARRAY[]::text[], ARRAY['confusion', 'stiff neck', 'trouble breathing'], '30-60 minutes', 'Easy', '$', true),
  ('rem_fv02', 'Tepid Cooling Cloth', 'Lifestyle', 4.1, 132, 'Gentle cooling comfort for feverish chills and overheating.', 'A lukewarm cloth can improve comfort during fever without the shock of cold baths or alcohol rubs.', 'Use a lukewarm cloth on the forehead, neck, or wrists for short periods while resting.', 'Do not use ice baths or alcohol rubs. Seek care if fever is severe or persistent.', ARRAY[]::text[], ARRAY['severe fever'], '10-20 minutes', 'Easy', '$', false),
  ('rem_sr01', 'Oatmeal Bath for Skin Rash', 'Natural', 4.5, 228, 'Colloidal oatmeal can calm itchy skin rash and irritation.', 'Oatmeal contains soothing compounds that may reduce itch and support the skin barrier during mild irritation.', 'Soak in a lukewarm oatmeal bath for 10 to 15 minutes, then pat dry and moisturize.', 'Avoid if rash is rapidly spreading, infected, or linked with fever.', ARRAY['oat'], ARRAY['infected skin', 'fever with rash'], '15-30 minutes', 'Easy', '$', true),
  ('rem_sr02', 'Cool Compress for Itchy Irritation', 'Lifestyle', 4.3, 176, 'Cold comfort for mild rash, hives, or skin irritation.', 'Cool compresses can reduce itch signals and calm inflamed skin without scratching.', 'Apply a cool damp cloth for 10 minutes. Repeat as needed and avoid harsh soaps.', 'Seek care for facial swelling, breathing trouble, or blistering rash.', ARRAY[]::text[], ARRAY['facial swelling', 'breathing trouble'], '5-15 minutes', 'Easy', '$', false),
  ('rem_ep01', 'Warm Compress for Ear Pain', 'Lifestyle', 4.2, 159, 'Gentle warmth for earache pressure and mild ear pain.', 'Warmth around the ear may ease muscle tension and pressure discomfort while you monitor symptoms.', 'Hold a warm cloth against the outside of the ear for 10 to 15 minutes.', 'Do not put liquids in the ear. Seek care for drainage, fever, hearing loss, or severe pain.', ARRAY[]::text[], ARRAY['ear drainage', 'hearing loss'], '10-20 minutes', 'Easy', '$', true),
  ('rem_ep02', 'Jaw and Neck Relaxation', 'Lifestyle', 4.0, 88, 'Relaxation for earache linked to jaw clenching or neck tension.', 'TMJ tension and neck tightness can refer pain toward the ear, especially during exam stress.', 'Relax the jaw, place the tongue behind the front teeth, and gently stretch the neck for two minutes.', 'Stop if dizziness or sharp pain occurs.', ARRAY[]::text[], ARRAY['dizziness', 'sharp pain'], '5-10 minutes', 'Easy', '$', false),
  ('rem_bg01', 'Peppermint Bloating Tea', 'Natural', 4.4, 217, 'Peppermint support for bloating, gas, and stomach tightness.', 'Peppermint may relax gastrointestinal smooth muscle, which can reduce gas cramps and bloated discomfort.', 'Steep peppermint tea for five minutes and sip slowly after meals.', 'May worsen reflux or heartburn.', ARRAY['herbal'], ARRAY['reflux', 'heartburn'], '15-30 minutes', 'Easy', '$', true),
  ('rem_bg02', 'Post-Meal Walk', 'Lifestyle', 4.6, 331, 'Light movement to help bloating and trapped gas move through.', 'A gentle walk can stimulate gut motility and reduce bloating after large or rushed meals.', 'Walk at an easy pace for 10 to 15 minutes after eating.', 'Avoid intense exercise if nauseous or in severe abdominal pain.', ARRAY[]::text[], ARRAY['severe abdominal pain'], '10-20 minutes', 'Easy', '$', false),
  ('rem_ho01', 'Hangover Hydration Reset', 'Lifestyle', 4.5, 385, 'Fluids and electrolytes for hangover headache, nausea, and low energy.', 'Alcohol can disrupt sleep, irritate the stomach, and increase fluid loss. Rehydration and food can reduce hangover symptoms.', 'Sip water or electrolytes and eat a bland meal with carbs and protein.', 'Seek urgent help for confusion, repeated vomiting, or possible alcohol poisoning.', ARRAY[]::text[], ARRAY['alcohol poisoning', 'repeated vomiting'], '30-90 minutes', 'Easy', '$', true),
  ('rem_ho02', 'Ginger Mint Recovery Tea', 'Natural', 4.1, 144, 'A warm drink for hangover nausea and queasy stomach.', 'Ginger and mint can settle nausea while warm fluids support gradual rehydration.', 'Sip slowly and pair with small bites of bland food if tolerated.', 'Avoid more alcohol. Seek care if vomiting will not stop.', ARRAY['herbal'], ARRAY['persistent vomiting'], '20-45 minutes', 'Easy', '$', false),
  ('rem_ft01', 'Daylight Energy Walk', 'Lifestyle', 4.7, 426, 'Morning light and movement for fatigue and low energy.', 'Daylight exposure and easy movement can improve alertness when fatigue is tied to poor sleep, long study blocks, or staying indoors.', 'Take a 10 to 20 minute outdoor walk early in the day when possible.', 'Do not push through dizziness, chest pain, or severe illness.', ARRAY[]::text[], ARRAY['chest pain', 'dizziness'], '10-30 minutes', 'Easy', '$', true),
  ('rem_ft02', 'Protein Snack Reset', 'Lifestyle', 4.4, 238, 'A simple food strategy for low energy between classes.', 'A snack with protein and fiber can stabilize energy better than sugar alone when fatigue comes from skipped meals.', 'Eat yogurt, nuts, eggs, tofu, or hummus with fruit or whole-grain crackers.', 'Avoid allergens and seek care for fainting or unexplained severe fatigue.', ARRAY['nuts', 'dairy'], ARRAY['food allergy', 'fainting'], '20-45 minutes', 'Easy', '$', false)
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

DELETE FROM public.remedy_symptoms WHERE remedy_id IN (
  'rem_bp01','rem_bp02','rem_bp03','rem_st01','rem_st02',
  'rem_es01','rem_es02','rem_pc01','rem_pc02','rem_fv01','rem_fv02',
  'rem_sr01','rem_sr02','rem_ep01','rem_ep02','rem_bg01','rem_bg02',
  'rem_ho01','rem_ho02','rem_ft01','rem_ft02'
);

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES
  ('rem_bp01', 'back_pain'), ('rem_bp01', 'stress'),
  ('rem_bp02', 'back_pain'),
  ('rem_bp03', 'back_pain'),
  ('rem_st01', 'sore_throat'), ('rem_st01', 'cold'),
  ('rem_st02', 'sore_throat'), ('rem_st02', 'cold'),
  ('rem_es01', 'eye_strain'), ('rem_es01', 'fatigue'),
  ('rem_es02', 'eye_strain'),
  ('rem_pc01', 'period_cramps'),
  ('rem_pc02', 'period_cramps'), ('rem_pc02', 'nausea'),
  ('rem_fv01', 'fever'), ('rem_fv01', 'cold'),
  ('rem_fv02', 'fever'),
  ('rem_sr01', 'skin_rash'),
  ('rem_sr02', 'skin_rash'),
  ('rem_ep01', 'ear_pain'),
  ('rem_ep02', 'ear_pain'), ('rem_ep02', 'stress'),
  ('rem_bg01', 'bloating'), ('rem_bg01', 'nausea'),
  ('rem_bg02', 'bloating'),
  ('rem_ho01', 'hangover'), ('rem_ho01', 'headache'), ('rem_ho01', 'nausea'), ('rem_ho01', 'fatigue'),
  ('rem_ho02', 'hangover'), ('rem_ho02', 'nausea'),
  ('rem_ft01', 'fatigue'), ('rem_ft01', 'stress'),
  ('rem_ft02', 'fatigue')
ON CONFLICT DO NOTHING;

COMMIT;
