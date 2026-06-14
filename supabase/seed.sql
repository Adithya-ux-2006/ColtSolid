BEGIN;

INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('headache', 'Headache', '🤕', 'forest'),
  ('cold', 'Cold', '🤧', 'sage'),
  ('anxiety', 'Anxiety', '😰', 'amber'),
  ('insomnia', 'Insomnia', '😴', 'forest'),
  ('nausea', 'Nausea', '🤢', 'sage'),
  ('stress', 'Stress', '😤', 'amber')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  color_theme = EXCLUDED.color_theme;

INSERT INTO public.remedies (
  id, name, category, rating, review_count, short_description, long_description,
  how_to_use, warnings, time_to_effect, difficulty, cost, is_featured
) VALUES
  ('rem_h01', 'Peppermint Oil Roll-On', 'Natural', 4.6, 312, 'A cooling topical option that can ease tension headaches quickly.', 'Peppermint oil contains menthol, which produces a cooling sensation and may reduce perceived pain intensity in tension-type headaches when applied topically to the temples or forehead.', 'Apply a thin layer to the temples and back of the neck. Massage gently for 30 to 60 seconds. Reapply every few hours if needed.', 'Avoid contact with eyes. Do not ingest. Stop if skin irritation develops.', '10-15 minutes', 'Easy', '$', true),
  ('rem_h02', 'Magnesium Glycinate', 'Natural', 4.5, 248, 'A low-irritation magnesium supplement commonly used for migraine prevention.', 'Magnesium plays a role in neuromuscular signaling and vascular tone. Students with frequent headaches, especially migraines, may benefit when magnesium intake is low or sleep is irregular.', 'Take 200 to 400 mg in the evening with food. Use consistently for several weeks rather than as a one-time rescue treatment.', 'May cause loose stools in some people. Ask a clinician before use if you have kidney disease.', '1-4 weeks', 'Easy', '$$', false),
  ('rem_h03', 'LI4 Acupressure', 'TCM', 4.3, 186, 'A pressure-point technique on the hand used for headache relief.', 'LI4, or Hegu, is a traditional Chinese medicine point between the thumb and index finger. Gentle sustained pressure may reduce muscle tension and provide a short burst of relief for stress-related headaches.', 'Press the point on one hand for 1 to 2 minutes while breathing slowly. Repeat on the other hand. Use up to three rounds.', 'Avoid during pregnancy unless advised by a licensed clinician.', '5-10 minutes', 'Easy', '$', false),
  ('rem_h04', 'Ibuprofen 200-400 mg', 'Conventional', 4.8, 1045, 'A common NSAID that reduces headache pain and inflammation.', 'Ibuprofen works by blocking prostaglandin synthesis, making it effective for many tension headaches and mild migraines when taken early in the episode.', 'Take 200 to 400 mg with water and food if your stomach is sensitive. Follow label directions and avoid combining with other NSAIDs.', 'Can irritate the stomach and is not appropriate for some kidney, ulcer, or bleeding conditions.', '20-30 minutes', 'Easy', '$', true),
  ('rem_h05', 'Hydration Reset', 'Lifestyle', 4.4, 401, 'Useful when headaches are driven by missed meals, heat, or dehydration.', 'Many students develop headaches after long study blocks, caffeine overuse, or poor fluid intake. Rehydration can reverse mild dehydration-related headache symptoms within an hour.', 'Drink 16 to 24 ounces of water over 30 minutes. Add a salty snack or electrolyte drink if you have been sweating heavily.', 'Do not force excessive fluids quickly if you feel nauseated or lightheaded.', '30-60 minutes', 'Easy', '$', false),

  ('rem_c01', 'Zinc Lozenges', 'Natural', 4.7, 521, 'May shorten the duration of a cold if started early.', 'Zinc acetate or gluconate lozenges appear to reduce cold duration in some studies when started within the first 24 hours of symptom onset.', 'Use one lozenge every 2 to 3 hours while awake according to package directions for a short course.', 'Can cause a metallic taste or nausea. Do not exceed labeled dosing.', '1-2 days', 'Easy', '$$', true),
  ('rem_c02', 'Saline Nasal Irrigation', 'Lifestyle', 4.6, 367, 'Helps clear nasal mucus and reduce congestion without medication.', 'Isotonic saline rinses can thin mucus, improve nasal airflow, and reduce the feeling of pressure during upper respiratory infections.', 'Use sterile, distilled, or previously boiled water. Irrigate each nostril once or twice daily using a squeeze bottle or neti pot.', 'Never use untreated tap water. Clean the device after each use.', 'Immediate to 1 day', 'Moderate', '$', false),
  ('rem_c03', 'Gua Sha for Neck Tension', 'TCM', 4.1, 112, 'A scraping technique sometimes used to reduce muscular tension during early illness.', 'Gua sha is used in traditional East Asian practice to promote circulation and reduce neck and upper-back tightness that can accompany early cold symptoms.', 'Apply oil to the upper back or neck and use a smooth-edged tool with light to moderate pressure for several strokes.', 'Expect temporary redness or bruising. Avoid broken skin, clotting disorders, or severe illness.', 'Immediate', 'Moderate', '$', false),
  ('rem_c04', 'Pseudoephedrine', 'Conventional', 4.5, 688, 'An oral decongestant that can improve sinus pressure and stuffiness.', 'Pseudoephedrine constricts nasal blood vessels and is effective for short-term congestion relief when sinus pressure is the main complaint.', 'Follow package directions and avoid taking it too close to bedtime.', 'May raise heart rate or blood pressure and can worsen anxiety or insomnia.', '30-60 minutes', 'Easy', '$', true),
  ('rem_c05', 'Honey Lemon Warm Tea', 'Lifestyle', 4.4, 275, 'A soothing option for mild cough, throat irritation, and hydration.', 'Warm fluids can reduce throat discomfort and support hydration. Honey may reduce cough frequency in uncomplicated viral upper respiratory infections.', 'Stir one to two teaspoons of honey into warm water or tea with lemon. Sip slowly.', 'Do not give honey to infants under one year old. Use caution if you have diabetes.', '15-30 minutes', 'Easy', '$', false),

  ('rem_a01', 'L-Theanine', 'Natural', 4.7, 410, 'A green-tea amino acid used for calm focus without heavy sedation.', 'L-theanine may promote relaxation and reduce the physical edge of stress by influencing alpha brain wave activity and neurotransmitter signaling.', 'Take 100 to 200 mg before a stressful event or during an anxious study period.', 'May lower blood pressure in some people. Use caution with sedatives.', '30-45 minutes', 'Easy', '$$', true),
  ('rem_a02', 'Ashwagandha Root Extract', 'Natural', 4.4, 298, 'An adaptogenic herb studied for stress and anxiety symptoms.', 'Standardized ashwagandha extracts have shown modest reductions in stress scores in some adults when used consistently over several weeks.', 'Take a standardized daily dose according to the label, preferably with food.', 'Can interact with thyroid medication, sedatives, and some autoimmune conditions.', '2-6 weeks', 'Easy', '$$', false),
  ('rem_a03', 'Yintang Acupressure', 'TCM', 4.2, 154, 'Gentle pressure between the eyebrows used for short-term calming.', 'Yintang is commonly used in traditional Chinese medicine to support relaxation, especially when anxiety presents with racing thoughts or facial tension.', 'Sit quietly and apply light circular pressure between the eyebrows for 1 to 2 minutes while breathing slowly.', 'Stop if it worsens dizziness or headache.', '5-10 minutes', 'Easy', '$', false),
  ('rem_a04', 'Propranolol for Performance Anxiety', 'Conventional', 4.6, 336, 'A clinician-prescribed beta blocker that reduces physical anxiety symptoms.', 'Propranolol can blunt tremor, palpitations, and sweating during public speaking, interviews, or oral exams without treating the root psychological cause.', 'Use only as prescribed before known performance triggers.', 'Not appropriate for asthma, some heart conditions, or low blood pressure.', '30-60 minutes', 'Requires prescription', '$$', false),
  ('rem_a05', 'Guided Box Breathing', 'Lifestyle', 4.8, 812, 'A rapid breathing pattern that helps slow a rising stress response.', 'Box breathing combines paced inhalation, holding, exhalation, and pause to bring down autonomic arousal during panic-prone moments.', 'Inhale for four counts, hold for four, exhale for four, hold for four. Repeat for three to five minutes.', 'If you feel faint, pause and return to normal breathing.', '2-5 minutes', 'Easy', '$', true),

  ('rem_i01', 'Melatonin 1-3 mg', 'Natural', 4.5, 562, 'Helpful for delayed sleep schedules and circadian disruption.', 'Low-dose melatonin is most useful when the sleep issue is timing related, such as late-night studying, travel, or inconsistent wake times.', 'Take 1 to 3 mg about one to two hours before your target bedtime.', 'Can cause vivid dreams or morning grogginess if taken too late or at high doses.', '1-7 days', 'Easy', '$', true),
  ('rem_i02', 'Tart Cherry Juice', 'Natural', 4.1, 177, 'Provides natural melatonin and may modestly improve sleep continuity.', 'Tart cherry products contain melatonin and polyphenols that may support sleep onset and sleep efficiency in some adults.', 'Drink a small glass in the evening or use a low-sugar concentrate.', 'Watch sugar intake if you have diabetes or reflux.', '1-2 weeks', 'Easy', '$$', false),
  ('rem_i03', 'Shenmen Ear Acupressure', 'TCM', 4.0, 98, 'A low-risk ear pressure technique used for bedtime relaxation.', 'Shenmen is an auricular point often used in traditional practice to support calmness, especially when insomnia is tied to tension or overstimulation.', 'Use clean fingers or acupressure seeds to apply gentle pressure for one minute on each ear before bed.', 'Do not use on irritated or infected skin.', '10-20 minutes', 'Easy', '$', false),
  ('rem_i04', 'Doxylamine', 'Conventional', 4.3, 264, 'An over-the-counter antihistamine that can help with short-term sleepless nights.', 'Sedating antihistamines can be useful for occasional insomnia, especially when a temporary reset is needed, though they are not ideal as a long-term strategy.', 'Take according to label directions on nights when you can allow for a full sleep window.', 'Can cause next-day grogginess, dry mouth, and impaired concentration. Avoid mixing with alcohol.', '30-60 minutes', 'Easy', '$', false),
  ('rem_i05', 'Stimulus Control Routine', 'Lifestyle', 4.9, 640, 'A CBT-I technique that retrains the bed to be associated with sleep.', 'Stimulus control is one of the strongest evidence-based behavioral tools for insomnia. It reduces the habit of lying awake in bed while studying, scrolling, or worrying.', 'Go to bed only when sleepy. If awake for about 20 minutes, get up and do a quiet activity until drowsy. Wake at the same time daily.', 'This can feel harder before it feels easier during the first week.', '1-3 weeks', 'Moderate', '$', true),

  ('rem_n01', 'Ginger Capsules', 'Natural', 4.7, 433, 'A well-studied option for mild nausea from motion, stress, or viral illness.', 'Ginger can support gastric motility and reduce nausea signals, making it a common first-line option for mild to moderate nausea.', 'Take 250 to 500 mg as needed with water or food.', 'Can worsen heartburn in some people and may interact with blood thinners.', '20-40 minutes', 'Easy', '$', true),
  ('rem_n02', 'Peppermint Tea', 'Natural', 4.3, 201, 'Warm peppermint can help settle the stomach for some people.', 'Peppermint may reduce bloating and gastrointestinal spasm, which can make mild nausea feel more manageable during exams or viral illness.', 'Steep a tea bag or fresh leaves in hot water for five minutes and sip slowly.', 'May worsen reflux in people prone to heartburn.', '15-30 minutes', 'Easy', '$', false),
  ('rem_n03', 'P6 Wrist Acupressure', 'TCM', 4.5, 244, 'A pressure-point technique commonly used for nausea relief.', 'The P6 or Neiguan point on the inner wrist is one of the best studied acupressure points for nausea, including motion sickness and postoperative nausea.', 'Apply firm pressure three finger-widths below the wrist crease between the tendons for one to two minutes on each side.', 'Remove pressure if it causes pain or numbness.', '5-15 minutes', 'Easy', '$', false),
  ('rem_n04', 'Ondansetron', 'Conventional', 4.8, 519, 'A prescription anti-nausea medication used when oral intake is difficult.', 'Ondansetron blocks serotonin receptors involved in nausea and vomiting and is commonly used after procedures, with gastroenteritis, or during severe nausea episodes.', 'Use only as prescribed by a clinician or according to discharge instructions.', 'Can cause constipation and, rarely, heart-rhythm issues in people with risk factors.', '20-30 minutes', 'Requires prescription', '$$$', true),
  ('rem_n05', 'Oral Rehydration Sips', 'Lifestyle', 4.6, 287, 'Small, steady fluid replacement can calm nausea linked to dehydration.', 'When nausea follows heat, vomiting, or not eating for long periods, tiny sips of electrolyte fluid can be better tolerated than large glasses of water.', 'Take one to two sips every one to two minutes of an oral rehydration drink, chilled water, or ice chips.', 'Seek urgent care for persistent vomiting, blood, or signs of severe dehydration.', '15-60 minutes', 'Easy', '$', false),

  ('rem_s01', 'Rhodiola Rosea', 'Natural', 4.2, 173, 'An adaptogenic herb sometimes used for mental fatigue and stress.', 'Rhodiola has been studied for stress-related fatigue and may modestly improve resilience during high-load academic periods.', 'Take a standardized morning dose according to the label to avoid bedtime stimulation.', 'Can feel activating in some people and may not suit panic-prone users.', '1-2 weeks', 'Easy', '$$', false),
  ('rem_s02', 'Lemon Balm Tea', 'Natural', 4.1, 129, 'A calming herbal tea option for evenings or study breaks.', 'Lemon balm has mild anxiolytic and sedative properties in some small studies and can serve as a low-intensity tool for stress decompression.', 'Steep for five to ten minutes and drink warm in the late afternoon or evening.', 'May cause drowsiness in some people.', '20-40 minutes', 'Easy', '$', false),
  ('rem_s03', 'Tai Chi Flow Session', 'TCM', 4.5, 208, 'Slow movement practice that combines breathing, balance, and attention.', 'Tai chi can lower perceived stress while improving body awareness and breathing regularity, which makes it practical for students who dislike seated meditation.', 'Follow a guided beginner routine for 10 to 20 minutes in a quiet room or outdoor space.', 'Move within your comfort range if you have pain or dizziness.', '10-20 minutes', 'Moderate', '$', false),
  ('rem_s04', 'Hydroxyzine', 'Conventional', 4.3, 191, 'A prescription antihistamine sometimes used for short-term anxiety or stress-related insomnia.', 'Hydroxyzine can reduce acute somatic stress symptoms and is sometimes used when a non-habit-forming prescription option is preferred.', 'Use only as prescribed, usually in the evening or when sedation is acceptable.', 'Can impair alertness and should not be combined with alcohol or other sedatives.', '30-60 minutes', 'Requires prescription', '$$', false),
  ('rem_s05', 'Ten-Minute Outdoor Walk', 'Lifestyle', 4.8, 734, 'Brief movement and daylight exposure can interrupt stress spirals fast.', 'A short walk outside combines light exercise, visual distance, and sunlight exposure, which can reset attention and reduce the sense of mental overload.', 'Leave your study area, walk at an easy pace for ten minutes, and avoid checking messages while you do it.', 'Choose a safe route and avoid intense exercise if you are ill or overheated.', '10-15 minutes', 'Easy', '$', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  how_to_use = EXCLUDED.how_to_use,
  warnings = EXCLUDED.warnings,
  time_to_effect = EXCLUDED.time_to_effect,
  difficulty = EXCLUDED.difficulty,
  cost = EXCLUDED.cost,
  is_featured = EXCLUDED.is_featured;

DELETE FROM public.research_papers WHERE remedy_id IN (
  'rem_h01','rem_h02','rem_h03','rem_h04','rem_h05',
  'rem_c01','rem_c02','rem_c03','rem_c04','rem_c05',
  'rem_a01','rem_a02','rem_a03','rem_a04','rem_a05',
  'rem_i01','rem_i02','rem_i03','rem_i04','rem_i05',
  'rem_n01','rem_n02','rem_n03','rem_n04','rem_n05',
  'rem_s01','rem_s02','rem_s03','rem_s04','rem_s05'
);

DELETE FROM public.remedy_symptoms WHERE remedy_id IN (
  'rem_h01','rem_h02','rem_h03','rem_h04','rem_h05',
  'rem_c01','rem_c02','rem_c03','rem_c04','rem_c05',
  'rem_a01','rem_a02','rem_a03','rem_a04','rem_a05',
  'rem_i01','rem_i02','rem_i03','rem_i04','rem_i05',
  'rem_n01','rem_n02','rem_n03','rem_n04','rem_n05',
  'rem_s01','rem_s02','rem_s03','rem_s04','rem_s05'
);

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES
  ('rem_h01', 'headache'), ('rem_h01', 'stress'),
  ('rem_h02', 'headache'), ('rem_h02', 'insomnia'),
  ('rem_h03', 'headache'), ('rem_h03', 'stress'),
  ('rem_h04', 'headache'), ('rem_h04', 'cold'),
  ('rem_h05', 'headache'), ('rem_h05', 'nausea'),
  ('rem_c01', 'cold'),
  ('rem_c02', 'cold'),
  ('rem_c03', 'cold'), ('rem_c03', 'stress'),
  ('rem_c04', 'cold'),
  ('rem_c05', 'cold'), ('rem_c05', 'nausea'),
  ('rem_a01', 'anxiety'), ('rem_a01', 'stress'),
  ('rem_a02', 'anxiety'), ('rem_a02', 'stress'),
  ('rem_a03', 'anxiety'),
  ('rem_a04', 'anxiety'),
  ('rem_a05', 'anxiety'), ('rem_a05', 'stress'),
  ('rem_i01', 'insomnia'),
  ('rem_i02', 'insomnia'),
  ('rem_i03', 'insomnia'), ('rem_i03', 'anxiety'),
  ('rem_i04', 'insomnia'),
  ('rem_i05', 'insomnia'), ('rem_i05', 'stress'),
  ('rem_n01', 'nausea'),
  ('rem_n02', 'nausea'), ('rem_n02', 'headache'),
  ('rem_n03', 'nausea'),
  ('rem_n04', 'nausea'),
  ('rem_n05', 'nausea'),
  ('rem_s01', 'stress'), ('rem_s01', 'anxiety'),
  ('rem_s02', 'stress'), ('rem_s02', 'insomnia'),
  ('rem_s03', 'stress'), ('rem_s03', 'anxiety'),
  ('rem_s04', 'stress'), ('rem_s04', 'insomnia'),
  ('rem_s05', 'stress'), ('rem_s05', 'headache');

INSERT INTO public.research_papers (remedy_id, title, journal, url, key_findings) VALUES
  ('rem_h01', 'Topical peppermint oil for tension-type headache', 'Cephalalgia', 'https://pubmed.ncbi.nlm.nih.gov/?term=peppermint+oil+tension+headache', 'Topical peppermint preparations reduced headache intensity faster than placebo in small tension-headache trials.'),
  ('rem_h01', 'Menthol application and headache symptom relief', 'Journal of Headache and Pain', 'https://pubmed.ncbi.nlm.nih.gov/?term=menthol+headache+trial', 'Menthol-based topical treatment improved perceived cooling and short-term symptom relief.'),
  ('rem_h02', 'Magnesium in migraine prevention', 'Headache', 'https://pubmed.ncbi.nlm.nih.gov/?term=magnesium+migraine+prevention', 'Oral magnesium reduced migraine frequency in adults with recurrent attacks in several controlled studies.'),
  ('rem_h02', 'Nutritional magnesium and headache burden', 'Nutrients', 'https://pubmed.ncbi.nlm.nih.gov/?term=magnesium+headache+review', 'Magnesium supplementation is most helpful when intake is low or migraine features are present.'),
  ('rem_h03', 'Acupressure for headache symptom management', 'Pain Management Nursing', 'https://pubmed.ncbi.nlm.nih.gov/?term=acupressure+headache', 'Hand acupressure techniques showed modest short-term pain reduction compared with rest alone.'),
  ('rem_h03', 'Complementary pressure-point therapy for tension headache', 'Complementary Therapies in Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=LI4+headache', 'Pressure applied to LI4 was associated with lower tension-headache scores in small outpatient samples.'),
  ('rem_h04', 'Ibuprofen in episodic tension headache', 'Cochrane Database of Systematic Reviews', 'https://pubmed.ncbi.nlm.nih.gov/?term=ibuprofen+tension+headache', 'Ibuprofen improves headache relief versus placebo for many adults with episodic tension headaches.'),
  ('rem_h04', 'NSAIDs for acute migraine and headache care', 'BMJ Clinical Evidence', 'https://pubmed.ncbi.nlm.nih.gov/?term=NSAID+acute+headache', 'NSAIDs remain a standard evidence-based option when taken early and used appropriately.'),
  ('rem_h05', 'Dehydration-related headache mechanisms', 'Current Pain and Headache Reports', 'https://pubmed.ncbi.nlm.nih.gov/?term=dehydration+headache', 'Fluid depletion can trigger headache through pain-sensitive meningeal and vascular changes.'),
  ('rem_h05', 'Water intake intervention and headache improvement', 'European Journal of Neurology', 'https://pubmed.ncbi.nlm.nih.gov/?term=water+intake+headache+trial', 'Increasing daily water intake improved headache complaints in adults with low baseline hydration.'),

  ('rem_c01', 'Zinc acetate lozenges and common cold duration', 'Open Forum Infectious Diseases', 'https://pubmed.ncbi.nlm.nih.gov/?term=zinc+lozenges+common+cold', 'When started early, zinc lozenges shortened symptom duration in several meta-analyses.'),
  ('rem_c01', 'Oral zinc for rhinovirus infections', 'JRSM Open', 'https://pubmed.ncbi.nlm.nih.gov/?term=oral+zinc+rhinovirus', 'Higher-dose zinc formulations had the strongest signal for shortening cold duration.'),
  ('rem_c02', 'Saline irrigation for acute upper respiratory symptoms', 'American Family Physician', 'https://pubmed.ncbi.nlm.nih.gov/?term=saline+nasal+irrigation+cold', 'Nasal saline improved congestion and patient comfort with low risk when prepared correctly.'),
  ('rem_c02', 'Sinonasal irrigation evidence review', 'International Forum of Allergy & Rhinology', 'https://pubmed.ncbi.nlm.nih.gov/?term=sinonasal+irrigation+review', 'Saline rinses remain a reasonable supportive therapy for viral congestion and mucus clearance.'),
  ('rem_c03', 'Microcirculatory effects of Gua Sha', 'Explore', 'https://pubmed.ncbi.nlm.nih.gov/?term=gua+sha+microcirculation', 'Gua sha increased local microcirculation, which may partly explain perceived muscular relief.'),
  ('rem_c03', 'Traditional scraping therapy for neck pain and tension', 'Journal of Traditional and Complementary Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=gua+sha+neck+pain', 'Evidence is limited but suggests short-term symptom relief for myofascial tightness.'),
  ('rem_c04', 'Oral decongestants for common cold symptoms', 'Cochrane Database of Systematic Reviews', 'https://pubmed.ncbi.nlm.nih.gov/?term=pseudoephedrine+common+cold', 'Pseudoephedrine improved subjective nasal congestion more than placebo in adults.'),
  ('rem_c04', 'Safety and efficacy of pseudoephedrine', 'Annals of Pharmacotherapy', 'https://pubmed.ncbi.nlm.nih.gov/?term=pseudoephedrine+efficacy+safety', 'Short courses are effective for congestion but can worsen sleep and cardiovascular symptoms.'),
  ('rem_c05', 'Honey for acute cough in upper respiratory infection', 'Pediatrics', 'https://pubmed.ncbi.nlm.nih.gov/?term=honey+cough+upper+respiratory+infection', 'Honey reduced nighttime cough severity compared with no treatment in uncomplicated infections.'),
  ('rem_c05', 'Warm fluids and symptom relief in common cold', 'Rhinology', 'https://pubmed.ncbi.nlm.nih.gov/?term=warm+fluids+common+cold', 'Warm drinks improved the subjective experience of sore throat and chilliness.'),

  ('rem_a01', 'L-Theanine and stress response', 'Biological Psychology', 'https://pubmed.ncbi.nlm.nih.gov/?term=l-theanine+stress', 'L-theanine reduced physiological markers of stress during experimentally induced stress tasks.'),
  ('rem_a01', 'L-Theanine for anxiety and sleep quality', 'Nutrients', 'https://pubmed.ncbi.nlm.nih.gov/?term=l-theanine+anxiety+review', 'Review data suggest modest benefits for stress reduction and calm attention.'),
  ('rem_a02', 'Ashwagandha in stress and anxiety', 'Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=ashwagandha+stress+anxiety', 'Standardized extracts lowered stress scores and serum cortisol in some randomized trials.'),
  ('rem_a02', 'Adaptogens and mental stress outcomes', 'Journal of Clinical Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=ashwagandha+clinical+stress', 'Ashwagandha showed a consistent but moderate effect on self-reported stress in adults.'),
  ('rem_a03', 'Acupressure for anxiety symptoms', 'Journal of Alternative and Complementary Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=acupressure+anxiety', 'Brief acupressure interventions lowered subjective anxiety scores in outpatient settings.'),
  ('rem_a03', 'Nonpharmacologic calming techniques in anxious adults', 'Complementary Therapies in Clinical Practice', 'https://pubmed.ncbi.nlm.nih.gov/?term=pressure+point+anxiety', 'Simple touch-based practices may improve short-term calm when paired with paced breathing.'),
  ('rem_a04', 'Beta blockers for performance anxiety', 'American Journal of Psychiatry', 'https://pubmed.ncbi.nlm.nih.gov/?term=propranolol+performance+anxiety', 'Propranolol reduced tremor and autonomic symptoms during public-performance tasks.'),
  ('rem_a04', 'Stage fright and oral propranolol', 'Journal of Clinical Psychopharmacology', 'https://pubmed.ncbi.nlm.nih.gov/?term=oral+propranolol+stage+fright', 'Physical symptoms improved without major cognitive impairment when used selectively.'),
  ('rem_a05', 'Paced breathing and autonomic regulation', 'Frontiers in Psychology', 'https://pubmed.ncbi.nlm.nih.gov/?term=paced+breathing+stress', 'Slow, structured breathing lowered perceived stress and improved parasympathetic balance.'),
  ('rem_a05', 'Breathing exercises for anxiety management', 'BMC Complementary Medicine and Therapies', 'https://pubmed.ncbi.nlm.nih.gov/?term=box+breathing+anxiety', 'Breathing practice reduced acute anxiety intensity and improved sense of control.'),

  ('rem_i01', 'Melatonin for delayed sleep-wake phase', 'Sleep Medicine Reviews', 'https://pubmed.ncbi.nlm.nih.gov/?term=melatonin+delayed+sleep+phase', 'Melatonin is most effective when insomnia is linked to circadian timing rather than general hyperarousal.'),
  ('rem_i01', 'Low-dose melatonin and sleep onset latency', 'PLOS One', 'https://pubmed.ncbi.nlm.nih.gov/?term=low-dose+melatonin+sleep+latency', 'Low-dose regimens improved sleep onset with fewer residual effects than high doses.'),
  ('rem_i02', 'Tart cherry juice and sleep outcomes', 'European Journal of Nutrition', 'https://pubmed.ncbi.nlm.nih.gov/?term=tart+cherry+sleep', 'Tart cherry intake modestly improved sleep duration and efficiency in small trials.'),
  ('rem_i02', 'Dietary melatonin sources and insomnia symptoms', 'Nutrients', 'https://pubmed.ncbi.nlm.nih.gov/?term=tart+cherry+insomnia', 'Natural melatonin-containing foods may support sleep as adjunctive therapy.'),
  ('rem_i03', 'Auricular acupressure and sleep quality', 'Evidence-Based Complementary and Alternative Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=auricular+acupressure+sleep', 'Ear acupressure improved self-reported sleep quality in several small insomnia studies.'),
  ('rem_i03', 'Traditional ear point therapy in insomnia', 'Sleep and Biological Rhythms', 'https://pubmed.ncbi.nlm.nih.gov/?term=shenmen+sleep', 'Auricular points such as Shenmen may reduce bedtime arousal and sleep latency.'),
  ('rem_i04', 'Sedating antihistamines for short-term insomnia', 'Drugs & Aging', 'https://pubmed.ncbi.nlm.nih.gov/?term=doxylamine+insomnia', 'Sedating antihistamines may help occasional insomnia but have clear next-day side effects.'),
  ('rem_i04', 'Over-the-counter sleep aids review', 'American Journal of Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=antihistamine+sleep+aid+review', 'Evidence supports only short-term, selective use because of anticholinergic burden and grogginess.'),
  ('rem_i05', 'Stimulus control for chronic insomnia', 'Sleep', 'https://pubmed.ncbi.nlm.nih.gov/?term=stimulus+control+insomnia', 'Stimulus control is a core CBT-I component with durable benefits for sleep onset and maintenance.'),
  ('rem_i05', 'Behavioral treatment of insomnia in young adults', 'JAMA Internal Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=CBT-I+young+adults', 'CBT-I strategies outperformed basic sleep-hygiene advice for persistent insomnia symptoms.'),

  ('rem_n01', 'Ginger for nausea and vomiting', 'Nutrition Journal', 'https://pubmed.ncbi.nlm.nih.gov/?term=ginger+nausea+review', 'Ginger consistently reduced nausea severity across several causes in pooled analyses.'),
  ('rem_n01', 'Oral ginger in motion-related nausea', 'Journal of the American Board of Family Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=ginger+motion+sickness', 'Ginger provided benefit comparable to some standard options for mild nausea triggers.'),
  ('rem_n02', 'Peppermint and gastrointestinal discomfort', 'Digestive Diseases and Sciences', 'https://pubmed.ncbi.nlm.nih.gov/?term=peppermint+gastrointestinal+spasm', 'Peppermint reduced spasm-related discomfort in the upper GI tract for some participants.'),
  ('rem_n02', 'Herbal teas and functional nausea symptoms', 'Phytotherapy Research', 'https://pubmed.ncbi.nlm.nih.gov/?term=peppermint+tea+nausea', 'Peppermint-based preparations may improve mild nausea, especially when bloating coexists.'),
  ('rem_n03', 'P6 acupressure for nausea control', 'Anesthesia & Analgesia', 'https://pubmed.ncbi.nlm.nih.gov/?term=P6+acupressure+nausea', 'The P6 point remains one of the best supported acupressure targets for nausea reduction.'),
  ('rem_n03', 'Acupressure wrist interventions in nausea', 'Cochrane Database of Systematic Reviews', 'https://pubmed.ncbi.nlm.nih.gov/?term=acupressure+wrist+nausea', 'Trials show modest benefit with minimal risk for self-administered P6 pressure.'),
  ('rem_n04', 'Ondansetron for acute nausea and vomiting', 'New England Journal of Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=ondansetron+nausea+trial', 'Ondansetron reliably improves nausea and vomiting control across multiple acute-care settings.'),
  ('rem_n04', 'Serotonin antagonists in symptomatic nausea relief', 'Annals of Emergency Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=ondansetron+emergency+nausea', 'Oral ondansetron improves tolerance of oral fluids and reduces vomiting recurrence.'),
  ('rem_n05', 'Oral rehydration therapy principles', 'World Health Organization Bulletin', 'https://pubmed.ncbi.nlm.nih.gov/?term=oral+rehydration+therapy', 'Small frequent fluid replacement is effective and better tolerated during dehydration-related nausea.'),
  ('rem_n05', 'Fluid strategy for gastroenteritis-related symptoms', 'American Family Physician', 'https://pubmed.ncbi.nlm.nih.gov/?term=small+sips+rehydration+nausea', 'Sipped oral fluids improve hydration while minimizing nausea provoked by rapid intake.'),

  ('rem_s01', 'Rhodiola and stress-related fatigue', 'Phytomedicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=rhodiola+stress+fatigue', 'Rhodiola improved stress-related fatigue and attention in several short-duration studies.'),
  ('rem_s01', 'Adaptogenic herbs and resilience outcomes', 'Molecules', 'https://pubmed.ncbi.nlm.nih.gov/?term=rhodiola+stress+review', 'Evidence suggests modest benefit for mental performance under stress, though studies are heterogeneous.'),
  ('rem_s02', 'Lemon balm effects on mood and calmness', 'Mediterranean Journal of Nutrition and Metabolism', 'https://pubmed.ncbi.nlm.nih.gov/?term=lemon+balm+stress', 'Lemon balm improved calmness and reduced restlessness in some healthy adult studies.'),
  ('rem_s02', 'Melissa officinalis for mild anxiety and stress', 'Phytomedicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=melissa+officinalis+anxiety', 'Small trials found reduced stress and improved sleep quality with lemon balm preparations.'),
  ('rem_s03', 'Tai chi and psychological stress', 'BMC Complementary Medicine and Therapies', 'https://pubmed.ncbi.nlm.nih.gov/?term=tai+chi+stress', 'Tai chi improved perceived stress and mood while providing light physical activity.'),
  ('rem_s03', 'Mind-body exercise and anxiety reduction', 'Journal of Psychiatric Research', 'https://pubmed.ncbi.nlm.nih.gov/?term=tai+chi+anxiety+review', 'Tai chi was associated with lower anxiety and stress across student and adult populations.'),
  ('rem_s04', 'Hydroxyzine in generalized anxiety symptoms', 'Journal of Clinical Psychiatry', 'https://pubmed.ncbi.nlm.nih.gov/?term=hydroxyzine+anxiety', 'Hydroxyzine reduced anxiety symptoms faster than placebo in short-term outpatient trials.'),
  ('rem_s04', 'Antihistamine anxiolytics in acute stress care', 'CNS Drugs', 'https://pubmed.ncbi.nlm.nih.gov/?term=hydroxyzine+stress+sedation', 'Hydroxyzine offers short-term symptomatic relief but sedation limits daytime use.'),
  ('rem_s05', 'Brief walking breaks and stress recovery', 'British Journal of Sports Medicine', 'https://pubmed.ncbi.nlm.nih.gov/?term=walking+stress+recovery', 'Short walks lowered perceived stress and improved affect during cognitively demanding days.'),
  ('rem_s05', 'Outdoor activity and attentional reset', 'International Journal of Environmental Research and Public Health', 'https://pubmed.ncbi.nlm.nih.gov/?term=outdoor+walk+stress+students', 'Exposure to natural light and brief movement improved mood and reduced mental fatigue in students.');

COMMIT;
