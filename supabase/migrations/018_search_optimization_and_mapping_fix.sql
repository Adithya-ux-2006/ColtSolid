-- 018: Search Optimization & Mapping Fix (v3 - self-contained, constraint-safe)
-- Drops all CHECK constraints, ensures data, recreates constraints

BEGIN;

-- ==============================================================
-- 0. DROP ALL CHECK CONSTRAINTS ON remedies (added manually in dashboard)
-- ==============================================================
ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_difficulty_check;
ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_cost_check;
ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_category_check;

-- ==============================================================
-- 1. ENSURE ALL REQUIRED SYMPTOMS EXIST
-- ==============================================================
INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('headache', 'Headache', '🤕', 'forest'),
  ('cold', 'Cold', '🤧', 'sage'),
  ('anxiety', 'Anxiety', '😰', 'amber'),
  ('insomnia', 'Insomnia', '😴', 'sage'),
  ('nausea', 'Nausea', '🤢', 'sage'),
  ('stress', 'Stress', '😩', 'amber'),
  ('back_pain', 'Back Pain', '💪', 'forest'),
  ('sore_throat', 'Sore Throat', '🤧', 'sage'),
  ('eye_strain', 'Eye Strain', '👁', 'amber'),
  ('period_cramps', 'Period Cramps', '🩹', 'forest'),
  ('fever', 'Fever', '🌡', 'sage'),
  ('skin_rash', 'Skin Rash', '🔴', 'sage'),
  ('ear_pain', 'Ear Pain', '👂', 'amber'),
  ('bloating', 'Bloating', '🤢', 'sage'),
  ('hangover', 'Hangover', '🤢', 'amber'),
  ('fatigue', 'Fatigue', '😴', 'forest'),
  ('cough', 'Cough', '🤧', 'sage'),
  ('congestion', 'Congestion', '🤧', 'sage'),
  ('sinus_pressure', 'Sinus Pressure', '🤧', 'amber'),
  ('dehydration', 'Dehydration', '💧', 'amber'),
  ('low_energy', 'Low Energy', '😴', 'forest'),
  ('burnout', 'Burnout', '🔥', 'amber'),
  ('brain_fog', 'Brain Fog', '🧠', 'amber'),
  ('muscle_pain', 'Muscle Pain', '💪', 'forest'),
  ('joint_pain', 'Joint Pain', '🦴', 'forest'),
  ('leg_pain', 'Leg Pain', '🦵', 'forest'),
  ('knee_pain', 'Knee Pain', '🦵', 'sage'),
  ('neck_pain', 'Neck Pain', '🧘', 'amber'),
  ('shoulder_pain', 'Shoulder Pain', '💪', 'forest'),
  ('eye_pain', 'Eye Pain', '👁', 'amber'),
  ('indigestion', 'Indigestion', '🤢', 'amber'),
  ('heartburn', 'Heartburn', '🔥', 'amber'),
  ('constipation', 'Constipation', '🤢', 'sage'),
  ('diarrhea', 'Diarrhea', '🤢', 'sage'),
  ('gas', 'Gas', '🤢', 'sage'),
  ('dry_skin', 'Dry Skin', '💧', 'sage'),
  ('acne', 'Acne', '🔴', 'sage'),
  ('pms', 'PMS', '🩹', 'forest'),
  ('menopause', 'Menopause', '🩹', 'amber')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- 2. ENSURE ALL REQUIRED REMEDIES EXIST
-- ==============================================================
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
  ('rem_h01', 'Peppermint Oil Roll-On', 'Natural', 4.6, 312, 'A cooling topical option that can ease tension headaches quickly.', 'Peppermint oil contains menthol, which produces a cooling sensation and may reduce perceived pain intensity in tension-type headaches when applied topically to the temples or forehead.', 'Apply a thin layer to the temples and back of the neck. Massage gently for 30 to 60 seconds. Reapply every few hours if needed.', 'Avoid contact with eyes. Do not ingest. Stop if skin irritation develops.', ARRAY['herbal', 'pollen'], ARRAY['skin irritation'], '10-15 minutes', 'Easy', '$', true),
  ('rem_h02', 'Magnesium Glycinate', 'Natural', 4.5, 248, 'A low-irritation magnesium supplement commonly used for migraine prevention.', 'Magnesium plays a role in neuromuscular signaling and vascular tone. Students with frequent headaches, especially migraines, may benefit when magnesium intake is low or sleep is irregular.', 'Take 200 to 400 mg in the evening with food. Use consistently for several weeks rather than as a one-time rescue treatment.', 'May cause loose stools in some people. Ask a clinician before use if you have kidney disease.', ARRAY['herbal'], ARRAY['kidney disease'], '1-4 weeks', 'Easy', '$$', false),
  ('rem_h03', 'LI4 Acupressure', 'TCM', 4.3, 186, 'A pressure-point technique on the hand used for headache relief.', 'LI4, or Hegu, is a traditional Chinese medicine point between the thumb and index finger. Gentle sustained pressure may reduce muscle tension and provide a short burst of relief for stress-related headaches.', 'Press the point on one hand for 1 to 2 minutes while breathing slowly. Repeat on the other hand. Use up to three rounds.', 'Avoid during pregnancy unless advised by a licensed clinician.', ARRAY['herbal'], ARRAY['pregnancy'], '5-10 minutes', 'Easy', '$', false),
  ('rem_h04', 'Ibuprofen 200-400 mg', 'Conventional', 4.8, 1045, 'A common NSAID that reduces headache pain and inflammation.', 'Ibuprofen works by blocking prostaglandin synthesis, making it effective for many tension headaches and mild migraines when taken early in the episode.', 'Take 200 to 400 mg with water and food if your stomach is sensitive. Follow label directions and avoid combining with other NSAIDs.', 'Can irritate the stomach and is not appropriate for some kidney, ulcer, or bleeding conditions.', ARRAY[]::text[], ARRAY['ulcer', 'kidney disease', 'bleeding conditions'], '20-30 minutes', 'Easy', '$', true),
  ('rem_h05', 'Hydration Reset', 'Lifestyle', 4.4, 401, 'Useful when headaches are driven by missed meals, heat, or dehydration.', 'Many students develop headaches after long study blocks, caffeine overuse, or poor fluid intake. Rehydration can reverse mild dehydration-related headache symptoms within an hour.', 'Drink 16 to 24 ounces of water over 30 minutes. Add a salty snack or electrolyte drink if you have been sweating heavily.', 'Do not force excessive fluids quickly if you feel nauseated or lightheaded.', ARRAY[]::text[], ARRAY['severe nausea'], '30-60 minutes', 'Easy', '$', false),
  ('rem_c01', 'Zinc Lozenges', 'Natural', 4.7, 521, 'May shorten the duration of a cold if started early.', 'Zinc acetate or gluconate lozenges appear to reduce cold duration in some studies when started within the first 24 hours of symptom onset.', 'Use one lozenge every 2 to 3 hours while awake according to package directions for a short course.', 'Can cause a metallic taste or nausea. Do not exceed labeled dosing.', ARRAY['herbal'], ARRAY['nausea'], '1-2 days', 'Easy', '$$', true),
  ('rem_c02', 'Saline Nasal Irrigation', 'Lifestyle', 4.6, 367, 'Helps clear nasal mucus and reduce congestion without medication.', 'Isotonic saline rinses can thin mucus, improve nasal airflow, and reduce the feeling of pressure during upper respiratory infections.', 'Use sterile, distilled, or previously boiled water. Irrigate each nostril once or twice daily using a squeeze bottle or neti pot.', 'Never use untreated tap water. Clean the device after each use.', ARRAY[]::text[], ARRAY['untreated tap water'], 'Immediate to 1 day', 'Moderate', '$', false),
  ('rem_c03', 'Gua Sha for Neck Tension', 'TCM', 4.1, 112, 'A scraping technique sometimes used to reduce muscular tension during early illness.', 'Gua sha is used in traditional East Asian practice to promote circulation and reduce neck and upper-back tightness that can accompany early cold symptoms.', 'Apply oil to the upper back or neck and use a smooth-edged tool with light to moderate pressure for several strokes.', 'Expect temporary redness or bruising. Avoid broken skin, clotting disorders, or severe illness.', ARRAY['herbal'], ARRAY['clotting disorders', 'broken skin'], 'Immediate', 'Moderate', '$', false),
  ('rem_c04', 'Pseudoephedrine', 'Conventional', 4.5, 688, 'An oral decongestant that can improve sinus pressure and stuffiness.', 'Pseudoephedrine constricts nasal blood vessels and is effective for short-term congestion relief when sinus pressure is the main complaint.', 'Follow package directions and avoid taking it too close to bedtime.', 'May raise heart rate or blood pressure and can worsen anxiety or insomnia.', ARRAY[]::text[], ARRAY['high blood pressure', 'insomnia'], '30-60 minutes', 'Easy', '$', true),
  ('rem_c05', 'Honey Lemon Warm Tea', 'Lifestyle', 4.4, 275, 'A soothing option for mild cough, throat irritation, and hydration.', 'Warm fluids can reduce throat discomfort and support hydration. Honey may reduce cough frequency in uncomplicated viral upper respiratory infections.', 'Stir one to two teaspoons of honey into warm water or tea with lemon. Sip slowly.', 'Do not give honey to infants under one year old. Use caution if you have diabetes.', ARRAY['herbal', 'pollen'], ARRAY['diabetes', 'infants under one year old'], '15-30 minutes', 'Easy', '$', false),
  ('rem_a01', 'L-Theanine', 'Natural', 4.7, 410, 'A green-tea amino acid used for calm focus without heavy sedation.', 'L-theanine may promote relaxation and reduce the physical edge of stress by influencing alpha brain wave activity and neurotransmitter signaling.', 'Take 100 to 200 mg before a stressful event or during an anxious study period.', 'May lower blood pressure in some people. Use caution with sedatives.', ARRAY['herbal'], ARRAY['low blood pressure', 'sedatives'], '30-45 minutes', 'Easy', '$$', true),
  ('rem_a02', 'Ashwagandha Root Extract', 'Natural', 4.4, 298, 'An adaptogenic herb studied for stress and anxiety symptoms.', 'Standardized ashwagandha extracts have shown modest reductions in stress scores in some adults when used consistently over several weeks.', 'Take a standardized daily dose according to the label, preferably with food.', 'Can interact with thyroid medication, sedatives, and some autoimmune conditions.', ARRAY['herbal'], ARRAY['thyroid medication', 'sedatives', 'autoimmune conditions'], '2-6 weeks', 'Easy', '$$', false),
  ('rem_a03', 'Yintang Acupressure', 'TCM', 4.2, 154, 'Gentle pressure between the eyebrows used for short-term calming.', 'Yintang is commonly used in traditional Chinese medicine to support relaxation, especially when anxiety presents with racing thoughts or facial tension.', 'Sit quietly and apply light circular pressure between the eyebrows for 1 to 2 minutes while breathing slowly.', 'Stop if it worsens dizziness or headache.', ARRAY[]::text[], ARRAY['dizziness'], '5-10 minutes', 'Easy', '$', false),
  ('rem_a04', 'Propranolol for Performance Anxiety', 'Conventional', 4.6, 336, 'A clinician-prescribed beta blocker that reduces physical anxiety symptoms.', 'Propranolol can blunt tremor, palpitations, and sweating during public speaking, interviews, or oral exams without treating the root psychological cause.', 'Use only as prescribed before known performance triggers.', 'Not appropriate for asthma, some heart conditions, or low blood pressure.', ARRAY[]::text[], ARRAY['asthma', 'heart conditions', 'low blood pressure'], '30-60 minutes', 'Moderate', '$$', false),
  ('rem_a05', 'Guided Box Breathing', 'Lifestyle', 4.8, 812, 'A rapid breathing pattern that helps slow a rising stress response.', 'Box breathing combines paced inhalation, holding, exhalation, and pause to bring down autonomic arousal during panic-prone moments.', 'Inhale for four counts, hold for four, exhale for four, hold for four. Repeat for three to five minutes.', 'If you feel faint, pause and return to normal breathing.', ARRAY[]::text[], ARRAY['lightheadedness'], '2-5 minutes', 'Easy', '$', true),
  ('rem_i01', 'Melatonin 1-3 mg', 'Natural', 4.5, 562, 'Helpful for delayed sleep schedules and circadian disruption.', 'Low-dose melatonin is most useful when the sleep issue is timing related, such as late-night studying, travel, or inconsistent wake times.', 'Take 1 to 3 mg about one to two hours before your target bedtime.', 'Can cause vivid dreams or morning grogginess if taken too late or at high doses.', ARRAY['herbal'], ARRAY['morning grogginess'], '1-7 days', 'Easy', '$', true),
  ('rem_i02', 'Tart Cherry Juice', 'Natural', 4.1, 177, 'Provides natural melatonin and may modestly improve sleep continuity.', 'Tart cherry products contain melatonin and polyphenols that may support sleep onset and sleep efficiency in some adults.', 'Drink a small glass in the evening or use a low-sugar concentrate.', 'Watch sugar intake if you have diabetes or reflux.', ARRAY['herbal', 'pollen'], ARRAY['diabetes', 'reflux'], '1-2 weeks', 'Easy', '$$', false),
  ('rem_i03', 'Shenmen Ear Acupressure', 'TCM', 4.0, 98, 'A low-risk ear pressure technique used for bedtime relaxation.', 'Shenmen is an auricular point often used in traditional practice to support calmness, especially when insomnia is tied to tension or overstimulation.', 'Use clean fingers or acupressure seeds to apply gentle pressure for one minute on each ear before bed.', 'Do not use on irritated or infected skin.', ARRAY['herbal'], ARRAY['irritated skin', 'infected skin'], '10-20 minutes', 'Easy', '$', false),
  ('rem_i04', 'Doxylamine', 'Conventional', 4.3, 264, 'An over-the-counter antihistamine that can help with short-term sleepless nights.', 'Sedating antihistamines can be useful for occasional insomnia, especially when a temporary reset is needed, though they are not ideal as a long-term strategy.', 'Take according to label directions on nights when you can allow for a full sleep window.', 'Can cause next-day grogginess, dry mouth, and impaired concentration. Avoid mixing with alcohol.', ARRAY[]::text[], ARRAY['alcohol', 'daytime alertness'], '30-60 minutes', 'Easy', '$', false),
  ('rem_i05', 'Stimulus Control Routine', 'Lifestyle', 4.9, 640, 'A CBT-I technique that retrains the bed to be associated with sleep.', 'Stimulus control is one of the strongest evidence-based behavioral tools for insomnia. It reduces the habit of lying awake in bed while studying, scrolling, or worrying.', 'Go to bed only when sleepy. If awake for about 20 minutes, get up and do a quiet activity until drowsy. Wake at the same time daily.', 'This can feel harder before it feels easier during the first week.', ARRAY[]::text[], ARRAY['first-week fatigue'], '1-3 weeks', 'Moderate', '$', true),
  ('rem_n01', 'Ginger Capsules', 'Natural', 4.7, 433, 'A well-studied option for mild nausea from motion, stress, or viral illness.', 'Ginger can support gastric motility and reduce nausea signals, making it a common first-line option for mild to moderate nausea.', 'Take 250 to 500 mg as needed with water or food.', 'Can worsen heartburn in some people and may interact with blood thinners.', ARRAY['herbal'], ARRAY['blood thinners', 'heartburn'], '20-40 minutes', 'Easy', '$', true),
  ('rem_n02', 'Peppermint Tea', 'Natural', 4.3, 201, 'Warm peppermint can help settle the stomach for some people.', 'Peppermint may reduce bloating and gastrointestinal spasm, which can make mild nausea feel more manageable during exams or viral illness.', 'Steep a tea bag or fresh leaves in hot water for five minutes and sip slowly.', 'May worsen reflux in people prone to heartburn.', ARRAY['herbal', 'pollen'], ARRAY['reflux'], '15-30 minutes', 'Easy', '$', false),
  ('rem_n03', 'P6 Wrist Acupressure', 'TCM', 4.5, 244, 'A pressure-point technique commonly used for nausea relief.', 'The P6 or Neiguan point on the inner wrist is one of the best studied acupressure points for nausea, including motion sickness and postoperative nausea.', 'Apply firm pressure three finger-widths below the wrist crease between the tendons for one to two minutes on each side.', 'Remove pressure if it causes pain or numbness.', ARRAY[]::text[], ARRAY['pain', 'numbness'], '5-15 minutes', 'Easy', '$', false),
  ('rem_n04', 'Ondansetron', 'Conventional', 4.8, 519, 'A prescription anti-nausea medication used when oral intake is difficult.', 'Ondansetron blocks serotonin receptors involved in nausea and vomiting and is commonly used after procedures, with gastroenteritis, or during severe nausea episodes.', 'Use only as prescribed by a clinician or according to discharge instructions.', 'Can cause constipation and, rarely, heart-rhythm issues in people with risk factors.', ARRAY[]::text[], ARRAY['heart rhythm issues'], '20-30 minutes', 'Moderate', '$$$', true),
  ('rem_n05', 'Oral Rehydration Sips', 'Lifestyle', 4.6, 287, 'Small, steady fluid replacement can calm nausea linked to dehydration.', 'When nausea follows heat, vomiting, or not eating for long periods, tiny sips of electrolyte fluid can be better tolerated than large glasses of water.', 'Take one to two sips every one to two minutes of an oral rehydration drink, chilled water, or ice chips.', 'Seek urgent care for persistent vomiting, blood, or signs of severe dehydration.', ARRAY[]::text[], ARRAY['persistent vomiting', 'severe dehydration'], '15-60 minutes', 'Easy', '$', false),
  ('rem_s01', 'Rhodiola Rosea', 'Natural', 4.2, 173, 'An adaptogenic herb sometimes used for mental fatigue and stress.', 'Rhodiola has been studied for stress-related fatigue and may modestly improve resilience during high-load academic periods.', 'Take a standardized morning dose according to the label to avoid bedtime stimulation.', 'Can feel activating in some people and may not suit panic-prone users.', ARRAY['herbal'], ARRAY['panic-prone users'], '1-2 weeks', 'Easy', '$$', false),
  ('rem_s02', 'Lemon Balm Tea', 'Natural', 4.1, 129, 'A calming herbal tea option for evenings or study breaks.', 'Lemon balm has mild anxiolytic and sedative properties in some small studies and can serve as a low-intensity tool for stress decompression.', 'Steep for five to ten minutes and drink warm in the late afternoon or evening.', 'May cause drowsiness in some people.', ARRAY['herbal', 'pollen'], ARRAY['drowsiness'], '20-40 minutes', 'Easy', '$', false),
  ('rem_s03', 'Tai Chi Flow Session', 'TCM', 4.5, 208, 'Slow movement practice that combines breathing, balance, and attention.', 'Tai chi can lower perceived stress while improving body awareness and breathing regularity, which makes it practical for students who dislike seated meditation.', 'Follow a guided beginner routine for 10 to 20 minutes in a quiet room or outdoor space.', 'Move within your comfort range if you have pain or dizziness.', ARRAY[]::text[], ARRAY['pain', 'dizziness'], '10-20 minutes', 'Moderate', '$', false),
  ('rem_s04', 'Hydroxyzine', 'Conventional', 4.3, 191, 'A prescription antihistamine sometimes used for short-term anxiety or stress-related insomnia.', 'Hydroxyzine can reduce acute somatic stress symptoms and is sometimes used when a non-habit-forming prescription option is preferred.', 'Use only as prescribed, usually in the evening or when sedation is acceptable.', 'Can impair alertness and should not be combined with alcohol or other sedatives.', ARRAY[]::text[], ARRAY['alcohol', 'other sedatives'], '30-60 minutes', 'Moderate', '$$', false),
  ('rem_s05', 'Ten-Minute Outdoor Walk', 'Lifestyle', 4.8, 734, 'Brief movement and daylight exposure can interrupt stress spirals fast.', 'A short walk outside combines light exercise, visual distance, and sunlight exposure, which can reset attention and reduce the sense of mental overload.', 'Leave your study area, walk at an easy pace for ten minutes, and avoid checking messages while you do it.', 'Choose a safe route and avoid intense exercise if you are ill or overheated.', ARRAY[]::text[], ARRAY['overheating'], '10-15 minutes', 'Easy', '$', true),
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
  ('rem_ft02', 'Protein Snack Reset', 'Lifestyle', 4.4, 238, 'A simple food strategy for low energy between classes.', 'A snack with protein and fiber can stabilize energy better than sugar alone when fatigue comes from skipped meals.', 'Eat yogurt, nuts, eggs, tofu, or hummus with fruit or whole-grain crackers.', 'Avoid allergens and seek care for fainting or unexplained severe fatigue.', ARRAY['nuts', 'dairy'], ARRAY['food allergy', 'fainting'], '20-45 minutes', 'Easy', '$', false),
  ('rem_lp01', 'Rest, Ice, and Elevation Protocol', 'Lifestyle', 4.3, 234, 'Elevation and ice reduce swelling and improve recovery for general leg pain.', 'Ice reduces acute inflammation while elevation uses gravity to improve venous return.', 'Apply ice pack to painful area 15-20 min. Elevate leg on 2-3 pillows above heart level.', 'Do not apply ice directly to skin. Seek care for severe swelling or signs of blood clot.', ARRAY[]::text[], ARRAY['severe swelling', 'blood clot'], '1-3 days', 'Easy', '$', true),
  ('rem_lp02', 'Gentle Calf & Hamstring Stretch', 'Lifestyle', 4.2, 187, 'Static stretching of posterior leg muscles to relieve tension and improve flexibility.', 'Gentle sustained stretching reduces muscle tension, improves circulation, and can alleviate mild leg soreness.', 'Hold each stretch for 30s without bouncing. Repeat 2-3 rounds daily.', 'Stretch only to mild tension, not pain. Not for acute injuries.', ARRAY[]::text[], ARRAY['acute muscle tear'], '5-10 minutes', 'Easy', '$', false),
  ('rem_kp01', 'Rest, Ice, and Knee Protection', 'Lifestyle', 4.3, 198, 'Standard first-line protocol for acute knee pain with protection and ice.', 'Rest, ice, compression, and elevation reduce acute knee inflammation.', 'Rest from painful activity. Ice 15-20 min every 2-3 hours.', 'If knee locks or gives way, see a practitioner.', ARRAY[]::text[], ARRAY['knee locking', 'fracture'], 'Immediate', 'Easy', '$', false),
  ('rem_kp02', 'Knee Straight Leg Raise', 'Lifestyle', 4.4, 256, 'Foundational quadriceps exercise that stabilizes the knee without joint stress.', 'Straight leg raises strengthen the quadriceps without bending the knee.', 'Lie on back. Bend one knee, keep other straight. Lift 6-12 inches, hold 5s. 3x15 daily.', 'Do not push through sharp pain.', ARRAY[]::text[], ARRAY['acute knee injury'], 'Immediate', 'Easy', '$', false),
  ('rem_np01', 'Neck Heat Therapy', 'Lifestyle', 4.5, 312, 'Moist heat application that relaxes cervical muscles and relieves neck stiffness.', 'Heat increases blood flow to cervical muscles and reduces muscle guarding.', 'Apply warm moist towel or heating pad to neck for 15-20 min. 2-3 times daily.', 'Avoid heat on numb areas or acute trauma.', ARRAY[]::text[], ARRAY['cervical fracture', 'cervical instability'], '15-30 minutes', 'Easy', '$', false),
  ('rem_np02', 'Cervical Roll Support', 'Lifestyle', 4.1, 145, 'Using a cervical roll to maintain healthy neck curvature during sleep and rest.', 'A cervical roll supports the natural lordotic curve of the neck.', 'Place roll inside pillowcase at neck curve. Sleep on back or side.', 'Not for acute whiplash or cervical injury.', ARRAY[]::text[], ARRAY['acute whiplash'], '1-7 days', 'Easy', '$', false),
  ('rem_sp01', 'Rest and Ice for Shoulder', 'Lifestyle', 4.3, 176, 'Immediate first aid for acute shoulder pain with ice and activity modification.', 'Ice reduces acute inflammation. Rest prevents aggravating the rotator cuff.', 'Ice shoulder 15-20 min every 2-3 hours. Avoid overhead lifting.', 'Seek care for weakness or severe pain.', ARRAY[]::text[], ARRAY['rotator cuff tear', 'fracture'], 'Immediate', 'Easy', '$', false),
  ('rem_sp02', 'Shoulder Pendulum Exercise', 'Lifestyle', 4.4, 234, 'Codman pendulum exercise that maintains shoulder mobility during recovery.', 'Gentle circumduction reduces adhesive capsulitis risk.', 'Lean forward, let arm hang, swing small circles 10 each direction. 2-3x daily.', 'Pendulums only during acute phase.', ARRAY[]::text[], ARRAY['acute rotator cuff tear', 'shoulder fracture'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- 3. CLEAR INCORRECT NEGATION MAPPINGS
-- ==============================================================
DELETE FROM public.symptom_remedies
WHERE (symptom_id, remedy_id) IN (
  ('headache', 'rem_n01'), ('headache', 'rem_n02'), ('headache', 'rem_n03'), ('headache', 'rem_n04'), ('headache', 'rem_n05'),
  ('cold', 'rem_h01'), ('cold', 'rem_h02'), ('cold', 'rem_h03'), ('cold', 'rem_h04'), ('cold', 'rem_h05'),
  ('anxiety', 'rem_c01'), ('anxiety', 'rem_c02'), ('anxiety', 'rem_c03'), ('anxiety', 'rem_c04'), ('anxiety', 'rem_c05'),
  ('insomnia', 'rem_s01'), ('insomnia', 'rem_s02'), ('insomnia', 'rem_s03'), ('insomnia', 'rem_s04'), ('insomnia', 'rem_s05')
);

DELETE FROM public.remedy_symptoms
WHERE (remedy_id, symptom_id) IN (
  ('rem_n01', 'headache'), ('rem_n02', 'headache'), ('rem_n03', 'headache'), ('rem_n04', 'headache'), ('rem_n05', 'headache'),
  ('rem_h01', 'cold'), ('rem_h02', 'cold'), ('rem_h03', 'cold'), ('rem_h04', 'cold'), ('rem_h05', 'cold'),
  ('rem_c01', 'anxiety'), ('rem_c02', 'anxiety'), ('rem_c03', 'anxiety'), ('rem_c04', 'anxiety'), ('rem_c05', 'anxiety'),
  ('rem_s01', 'insomnia'), ('rem_s02', 'insomnia'), ('rem_s03', 'insomnia'), ('rem_s04', 'insomnia'), ('rem_s05', 'insomnia')
);

-- ==============================================================
-- 4. ENSURE symptom_remedies TABLE EXISTS
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.symptom_remedies (
  symptom_id TEXT REFERENCES public.symptoms(id) ON DELETE CASCADE,
  remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
  evidence_score INTEGER NOT NULL DEFAULT 5,
  priority_rank INTEGER NOT NULL DEFAULT 5,
  PRIMARY KEY (symptom_id, remedy_id)
);

ALTER TABLE public.symptom_remedies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to symptom_remedies" ON public.symptom_remedies;
CREATE POLICY "Allow public read access to symptom_remedies" ON public.symptom_remedies FOR SELECT USING (true);

-- ==============================================================
-- 5. FORCE-MAP PRIMARY SYMPTOMS IN symptom_remedies
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank) VALUES
  ('headache', 'rem_h01', 9, 10), ('headache', 'rem_h02', 8, 9), ('headache', 'rem_h03', 7, 8), ('headache', 'rem_h04', 10, 10), ('headache', 'rem_h05', 8, 7),
  ('cold', 'rem_c01', 9, 10), ('cold', 'rem_c02', 8, 9), ('cold', 'rem_c03', 6, 7), ('cold', 'rem_c04', 9, 9), ('cold', 'rem_c05', 7, 8),
  ('anxiety', 'rem_a01', 9, 10), ('anxiety', 'rem_a02', 8, 9), ('anxiety', 'rem_a03', 7, 8), ('anxiety', 'rem_a04', 9, 9), ('anxiety', 'rem_a05', 8, 7),
  ('insomnia', 'rem_i01', 9, 10), ('insomnia', 'rem_i02', 7, 8), ('insomnia', 'rem_i03', 6, 7), ('insomnia', 'rem_i04', 8, 9), ('insomnia', 'rem_i05', 9, 10),
  ('nausea', 'rem_n01', 9, 10), ('nausea', 'rem_n02', 7, 8), ('nausea', 'rem_n03', 8, 9), ('nausea', 'rem_n04', 10, 10), ('nausea', 'rem_n05', 8, 7),
  ('stress', 'rem_s01', 8, 9), ('stress', 'rem_s02', 7, 8), ('stress', 'rem_s03', 8, 9), ('stress', 'rem_s04', 7, 8), ('stress', 'rem_s05', 9, 10),
  ('back_pain', 'rem_bp01', 9, 10), ('back_pain', 'rem_bp02', 8, 9), ('back_pain', 'rem_bp03', 7, 8),
  ('sore_throat', 'rem_st01', 9, 10), ('sore_throat', 'rem_st02', 8, 9),
  ('eye_strain', 'rem_es01', 10, 10), ('eye_strain', 'rem_es02', 8, 9),
  ('period_cramps', 'rem_pc01', 9, 10), ('period_cramps', 'rem_pc02', 8, 9),
  ('fever', 'rem_fv01', 9, 10), ('fever', 'rem_fv02', 7, 8),
  ('skin_rash', 'rem_sr01', 8, 9), ('skin_rash', 'rem_sr02', 7, 8),
  ('ear_pain', 'rem_ep01', 8, 9), ('ear_pain', 'rem_ep02', 6, 7),
  ('bloating', 'rem_bg01', 8, 9), ('bloating', 'rem_bg02', 7, 8),
  ('hangover', 'rem_ho01', 9, 10), ('hangover', 'rem_ho02', 7, 8),
  ('fatigue', 'rem_ft01', 8, 9), ('fatigue', 'rem_ft02', 7, 8),
  ('cough', 'rem_c01', 6, 7), ('cough', 'rem_c02', 5, 6), ('cough', 'rem_c05', 7, 8),
  ('congestion', 'rem_c02', 8, 9), ('congestion', 'rem_c04', 9, 10),
  ('sinus_pressure', 'rem_c02', 7, 8), ('sinus_pressure', 'rem_c04', 8, 9),
  ('dehydration', 'rem_fv01', 7, 8), ('dehydration', 'rem_ho01', 8, 9), ('dehydration', 'rem_ft01', 6, 7),
  ('low_energy', 'rem_ft01', 7, 8), ('low_energy', 'rem_ft02', 6, 7),
  ('burnout', 'rem_s01', 7, 8), ('burnout', 'rem_s03', 8, 9), ('burnout', 'rem_s05', 8, 9),
  ('brain_fog', 'rem_s05', 6, 7), ('brain_fog', 'rem_ft01', 7, 8),
  ('muscle_pain', 'rem_bp03', 7, 8), ('joint_pain', 'rem_bp03', 6, 7),
  ('leg_pain', 'rem_lp01', 8, 9), ('leg_pain', 'rem_lp02', 7, 8),
  ('knee_pain', 'rem_kp01', 8, 9), ('knee_pain', 'rem_kp02', 7, 8),
  ('neck_pain', 'rem_np01', 8, 9), ('neck_pain', 'rem_np02', 7, 8),
  ('shoulder_pain', 'rem_sp01', 8, 9), ('shoulder_pain', 'rem_sp02', 7, 8),
  ('eye_pain', 'rem_es01', 6, 7), ('eye_pain', 'rem_es02', 7, 8),
  ('indigestion', 'rem_bg01', 6, 7), ('indigestion', 'rem_bg02', 5, 6),
  ('heartburn', 'rem_bg01', 5, 6), ('constipation', 'rem_bg02', 5, 6),
  ('diarrhea', 'rem_n05', 6, 7), ('gas', 'rem_bg01', 5, 6),
  ('dry_skin', 'rem_sr01', 5, 6), ('acne', 'rem_sr02', 5, 6),
  ('pms', 'rem_pc01', 6, 7), ('pms', 'rem_pc02', 5, 6),
  ('menopause', 'rem_s02', 5, 6)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- ==============================================================
-- 6. ENSURE remedy_symptoms HAS match_strength COLUMN AND CORRECT MAPPINGS
-- ==============================================================
ALTER TABLE public.remedy_symptoms
  ADD COLUMN IF NOT EXISTS match_strength TEXT NOT NULL DEFAULT 'primary'
  CHECK (match_strength IN ('primary', 'secondary'));

DELETE FROM public.remedy_symptoms;

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength) VALUES
  ('rem_h01', 'headache', 'primary'), ('rem_h02', 'headache', 'primary'), ('rem_h03', 'headache', 'primary'), ('rem_h04', 'headache', 'primary'), ('rem_h05', 'headache', 'primary'),
  ('rem_c01', 'cold', 'primary'), ('rem_c02', 'cold', 'primary'), ('rem_c03', 'cold', 'primary'), ('rem_c04', 'cold', 'primary'), ('rem_c05', 'cold', 'primary'),
  ('rem_a01', 'anxiety', 'primary'), ('rem_a02', 'anxiety', 'primary'), ('rem_a03', 'anxiety', 'primary'), ('rem_a04', 'anxiety', 'primary'), ('rem_a05', 'anxiety', 'primary'),
  ('rem_i01', 'insomnia', 'primary'), ('rem_i02', 'insomnia', 'primary'), ('rem_i03', 'insomnia', 'primary'), ('rem_i04', 'insomnia', 'primary'), ('rem_i05', 'insomnia', 'primary'),
  ('rem_n01', 'nausea', 'primary'), ('rem_n02', 'nausea', 'primary'), ('rem_n03', 'nausea', 'primary'), ('rem_n04', 'nausea', 'primary'), ('rem_n05', 'nausea', 'primary'),
  ('rem_s01', 'stress', 'primary'), ('rem_s02', 'stress', 'primary'), ('rem_s03', 'stress', 'primary'), ('rem_s04', 'stress', 'primary'), ('rem_s05', 'stress', 'primary'),
  ('rem_bp01', 'back_pain', 'primary'), ('rem_bp02', 'back_pain', 'primary'), ('rem_bp03', 'back_pain', 'primary'),
  ('rem_st01', 'sore_throat', 'primary'), ('rem_st02', 'sore_throat', 'primary'),
  ('rem_es01', 'eye_strain', 'primary'), ('rem_es02', 'eye_strain', 'primary'),
  ('rem_pc01', 'period_cramps', 'primary'), ('rem_pc02', 'period_cramps', 'primary'),
  ('rem_fv01', 'fever', 'primary'), ('rem_fv02', 'fever', 'primary'),
  ('rem_sr01', 'skin_rash', 'primary'), ('rem_sr02', 'skin_rash', 'primary'),
  ('rem_ep01', 'ear_pain', 'primary'), ('rem_ep02', 'ear_pain', 'primary'),
  ('rem_bg01', 'bloating', 'primary'), ('rem_bg02', 'bloating', 'primary'),
  ('rem_ho01', 'hangover', 'primary'), ('rem_ho02', 'hangover', 'primary'),
  ('rem_ft01', 'fatigue', 'primary'), ('rem_ft02', 'fatigue', 'primary'),
  ('rem_lp01', 'leg_pain', 'primary'), ('rem_lp02', 'leg_pain', 'primary'),
  ('rem_kp01', 'knee_pain', 'primary'), ('rem_kp02', 'knee_pain', 'primary'),
  ('rem_np01', 'neck_pain', 'primary'), ('rem_np02', 'neck_pain', 'primary'),
  ('rem_sp01', 'shoulder_pain', 'primary'), ('rem_sp02', 'shoulder_pain', 'primary'),
  ('rem_h01', 'stress', 'secondary'), ('rem_h02', 'insomnia', 'secondary'), ('rem_h03', 'stress', 'secondary'), ('rem_h04', 'cold', 'secondary'), ('rem_h05', 'nausea', 'secondary'),
  ('rem_c03', 'stress', 'secondary'), ('rem_c05', 'nausea', 'secondary'),
  ('rem_a01', 'stress', 'secondary'), ('rem_a02', 'stress', 'secondary'),
  ('rem_i03', 'anxiety', 'secondary'), ('rem_i05', 'stress', 'secondary'),
  ('rem_n02', 'headache', 'secondary'),
  ('rem_s01', 'anxiety', 'secondary'), ('rem_s02', 'insomnia', 'secondary'), ('rem_s03', 'anxiety', 'secondary'), ('rem_s04', 'insomnia', 'secondary'), ('rem_s05', 'headache', 'secondary'),
  ('rem_bp01', 'stress', 'secondary'), ('rem_st01', 'cold', 'secondary'), ('rem_st02', 'cold', 'secondary'),
  ('rem_es01', 'fatigue', 'secondary'), ('rem_pc02', 'nausea', 'secondary'), ('rem_fv01', 'cold', 'secondary'),
  ('rem_ep02', 'stress', 'secondary'), ('rem_bg01', 'nausea', 'secondary'),
  ('rem_ho01', 'headache', 'secondary'), ('rem_ho01', 'nausea', 'secondary'), ('rem_ho01', 'fatigue', 'secondary'), ('rem_ho02', 'nausea', 'secondary'),
  ('rem_ft01', 'stress', 'secondary')
ON CONFLICT (remedy_id, symptom_id) DO UPDATE SET
  match_strength = EXCLUDED.match_strength;

-- ==============================================================
-- 7. RECREATE CHECK CONSTRAINTS with all values used in the app
-- ==============================================================
ALTER TABLE public.remedies
  ADD CONSTRAINT remedies_category_check
  CHECK (category IN ('Lifestyle', 'Natural', 'TCM', 'Ayurveda', 'Conventional'));

ALTER TABLE public.remedies
  ADD CONSTRAINT remedies_difficulty_check
  CHECK (difficulty IN ('Easy', 'Moderate'));

ALTER TABLE public.remedies
  ADD CONSTRAINT remedies_cost_check
  CHECK (cost IN ('$', '$$', '$$$'));

COMMIT;
