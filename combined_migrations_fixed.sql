-- ==============================================================
-- Combined: 012 + 013 + 014 — Symptoms, Remedies, Mappings
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING/UPDATE)
-- Cost values use dollar-sign notation for Supabase CHECK constraint
-- ==============================================================
BEGIN;

-- Widen category CHECK constraint to include Ayurveda & TCM
ALTER TABLE public.remedies DROP CONSTRAINT IF EXISTS remedies_category_check;
ALTER TABLE public.remedies ADD CONSTRAINT remedies_category_check
  CHECK (category IN ('Lifestyle', 'Natural', 'Ayurveda', 'TCM'));

INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
  ('leg_pain', 'Leg Pain', '??', 'forest'),
  ('knee_pain', 'Knee Pain', '??', 'sage'),
  ('neck_pain', 'Neck Pain', '??', 'amber'),
  ('shoulder_pain', 'Shoulder Pain', '??', 'forest'),
  ('cough', 'Cough', '??', 'sage'),
  ('congestion', 'Congestion', '??', 'sage'),
  ('sinus_pressure', 'Sinus Pressure', '??', 'amber'),
  ('indigestion', 'Indigestion', '???', 'amber'),
  ('heartburn', 'Heartburn', '??', 'amber'),
  ('constipation', 'Constipation', '??', 'sage'),
  ('diarrhea', 'Diarrhea', '??', 'sage'),
  ('brain_fog', 'Brain Fog', '???', 'amber'),
  ('burnout', 'Burnout', '?????', 'amber'),
  ('joint_pain', 'Joint Pain', '??', 'forest'),
  ('muscle_pain', 'Muscle Pain', '??', 'forest'),
  ('dry_skin', 'Dry Skin', '??', 'sage'),
  ('acne', 'Acne', '??', 'sage'),
  ('pms', 'PMS', '??', 'forest'),
  ('menopause', 'Menopause', '??', 'amber'),
  ('dehydration', 'Dehydration', '??', 'amber'),
  ('low_energy', 'Low Energy', '??', 'forest'),
  ('stomach_ache', 'Stomach Ache', '??', 'sage'),
  ('gas', 'Gas', '??', 'sage')
ON CONFLICT (id) DO NOTHING;

-- HEADACHE expansion: Natural x1, Lifestyle x1, Ayurveda x3
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_h06', 'Caffeine + L-Theanine Pair', 'Natural', 4.4, 312, 'Natural combo that tightens blood vessels and calms neural activity to ease tension headaches.', 'Caffeine constricts dilated cranial blood vessels while L-theanine increases GABA and alpha brain waves. Together they provide fast relief without the rebound risk of standalone caffeine.', 'Take 50-100mg caffeine (one cup of coffee or green tea) with 100-200mg L-theanine at the first sign of headache. Do not exceed once daily.', 'Limit caffeine after 2 PM to avoid sleep disruption. Not suitable for those with anxiety disorders or high blood pressure.', ARRAY['caffeine'], ARRAY['anxiety_disorder', 'hypertension'], '20-30 minutes', 'Easy', '$', false),
('rem_h07', 'Temple Massage & Acupressure', 'Lifestyle', 4.6, 428, 'Fingertip pressure on temples and occipital ridge to release tension without anything.', 'Applying sustained pressure to temporalis, occipital, and trapezius trigger points reduces muscle tension and improves local circulation, breaking the tension-pain cycle.', 'Sit comfortably. Press thumbs into temples with firm circular motion for 30s. Then press into the hollow at the base of the skull for 60s. Repeat every 2 hours.', 'Avoid if you have a recent head or neck injury. Discontinue if pain worsens.', ARRAY[]::text[], ARRAY[]::text[], '5-10 minutes', 'Easy', '$', false),
('rem_h08', 'Brahmi Capsule', 'Ayurveda', 4.2, 178, 'Bacopa monnieri, an Ayurvedic herb that calms Vata and soothes tension-type headache.', 'Brahmi (Bacopa monnieri) is a Medhya Rasayana (brain tonic) in Ayurveda. It balances Vata dosha, improves cerebral circulation, and reduces stress-related headache frequency.', 'Take 300-500mg Brahmi extract with warm water after breakfast. Use consistently for at least 4 weeks for preventive benefit.', 'May cause mild digestive upset. Avoid during pregnancy. Not recommended with thyroid medications.', ARRAY['herbal'], ARRAY['pregnancy', 'thyroid_disorder'], '2-4 weeks (preventive)', 'Moderate', '$', false),
('rem_h09', 'Anu Tailam Nasal Oil', 'Ayurveda', 4.0, 95, 'Herbalized sesame oil for nasal instillation that clears head congestion and Vata-related headache.', 'Anu Tailam is a classical Ayurvedic nasya oil containing herbs like bilva, agnimantha, and shyonaka. Instilled nasally, it lubricates nasal passages, clears sinus channels, and pacifies Vata in the head region.', 'Warm 2-3 drops of oil. Lie back with head tilted, instill drops in each nostril, then gently sniff. Best done in the morning. Follow with a warm water nasal rinse after 5 minutes.', 'Not for acute sinus infection. Avoid if you have nasal injuries. Use room-temperature oil, never hot.', ARRAY['sesame', 'herbal'], ARRAY['acute_sinusitis', 'nasal_injury'], '15-30 minutes', 'Moderate', '$', false),
('rem_h10', 'Shirodhara Therapy', 'Ayurveda', 4.7, 64, 'Warm herbal oil streamed across the forehead for deep nervous system reset in headache.', 'Shirodhara involves pouring a thin, continuous stream of warm medicated oil (typically ksheerabala or brahmi oil) across the forehead for 30-45 minutes. It synchronizes brain waves and reduces sympathetic overactivity.', 'This is a clinic-based therapy. Visit an Ayurvedic practitioner for a session. A typical course is 7-14 sessions.', 'Not recommended during acute migraine attack. Avoid on days with active cold or fever. May cause drowsiness.', ARRAY['sesame', 'herbal'], ARRAY['head_injury', 'acute_fever'], '45-60 minutes', 'Requires clinic visit', '$$$', false)
ON CONFLICT (id) DO NOTHING;

-- COLD expansion: Ayurveda x3, Lifestyle x2
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_c06', 'Tulsi Holy Basil Tea', 'Ayurveda', 4.5, 312, 'Adaptogenic Ayurvedic tea that supports immunity and relieves cold symptoms.', 'Tulsi (Ocimum sanctum) is revered in Ayurveda as an immunomodulator and adaptogen. It has antimicrobial, anti-inflammatory, and expectorant properties that help clear congestion.', 'Steep 5-6 fresh Tulsi leaves (or 1 tsp dried) in boiling water for 10 minutes. Add honey and lemon. Drink 2-3 cups daily during a cold.', 'May lower blood sugar slightly. Use caution if on diabetes medication. Avoid high doses during pregnancy.', ARRAY['herbal', 'pollen'], ARRAY['diabetes_medication'], 'Immediate (symptom relief)', 'Easy', '$', false),
('rem_c07', 'Trikatu Formula', 'Ayurveda', 4.1, 134, 'Classic Ayurvedic blend of ginger, black pepper, and long pepper to kickstart digestion and clear mucus.', 'Trikatu � a blend of sunthi (ginger), maricha (black pepper), and pippali (long pepper) � is Ayurveda''s primary bioenhancer and digestive stimulant. It increases bioavailability and loosens kapha (mucus).', 'Take 1/4 tsp of Trikatu powder mixed with honey, twice daily before meals. Or take 1 tablet (500mg) after meals. Continue for 5-7 days during a cold.', 'Avoid in hyperacidity, gastritis, or peptic ulcer. Not for children under 5.', ARRAY['herbal', 'ginger'], ARRAY['hyperacidity', 'peptic_ulcer', 'gastritis'], '30-60 minutes', 'Easy', '$', false),
('rem_c08', 'Chyawanprash', 'Ayurveda', 4.4, 412, 'Traditional Ayurvedic nutraceutical jam that builds immunity and soothes respiratory passages.', 'Chyawanprash is a fermented herbal jam containing amla (Indian gooseberry) as its base, along with 40+ herbs. It is a powerful immunomodulator (Rasayana) supporting respiratory health.', 'Take 1 tsp (approx 10g) on an empty stomach each morning during cold season. Can be increased to 2 tsp daily during active cold.', 'Contains sugar � may not suit diabetics (use sugar-free version). Avoid during high fever or acute infection with pus.', ARRAY['herbal', 'pollen', 'fruit'], ARRAY['diabetes', 'acute_infection'], '2-3 days (tonic effect)', 'Easy', '$', false),
('rem_c09', 'Steam Inhalation', 'Lifestyle', 4.3, 534, 'Simple steam breathing that loosens nasal congestion and soothes irritated airways.', 'Warm steam moistens nasal and bronchial mucosa, thins mucus secretions, and improves ciliary function. Adding eucalyptus oil enhances the decongestant effect.', 'Boil water, pour into a bowl. Lean over with a towel, keeping face 30cm away. Breathe deeply for 5-10 minutes. Add 2-3 drops of eucalyptus oil if available. Repeat 2-3 times daily.', 'Keep face at safe distance to avoid burns. Do not use boiling water directly. Supervise children closely.', ARRAY['eucalyptus_oil'], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_c10', 'Neti Pot Nasal Rinse', 'Lifestyle', 4.1, 298, 'Saline nasal irrigation using a traditional neti pot to flush congestion and irritants.', 'Saline nasal irrigation clears nasal passages of excess mucus, allergens, and pathogens. It improves mucociliary clearance during acute cold.', 'Fill neti pot with 250ml lukewarm distilled water mixed with 1/4 tsp non-iodized salt. Tilt head sideways, pour into upper nostril. Repeat on other side. Use daily during cold.', 'Always use distilled or boiled-and-cooled water � never tap water. Clean the pot thoroughly after each use. Stop if you feel sharp ear pain.', ARRAY[]::text[], ARRAY['chronic_ear_infection'], 'Immediate', 'Moderate', '$', false)
ON CONFLICT (id) DO NOTHING;

-- ANXIETY expansion: Ayurveda x2, Natural x1, Lifestyle x2
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_a06', 'Shankhpushpi Syrup', 'Ayurveda', 4.3, 203, 'Ayurvedic nervine tonic that calms racing thoughts and supports sound sleep.', 'Shankhpushpi (Convolvulus pluricaulis) is a Medhya Rasayana that enhances cognition while reducing anxiety. It works by modulating GABAergic activity and reducing cortisol levels.', 'Take 1-2 tsp of Shankhpushpi syrup with warm milk or water, twice daily. Best taken in morning and at bedtime. Continue for 8-12 weeks.', 'May cause mild drowsiness � avoid driving initially. Not recommended during pregnancy. May interact with sedatives.', ARRAY['herbal'], ARRAY['pregnancy', 'sedative_medication', 'thyroid_disorder'], '1-2 weeks', 'Easy', '$', false),
('rem_a07', 'Jatamansi Root Powder', 'Ayurveda', 4.1, 118, 'Nardostachys jatamansi, a Himalayan herb known for deep calming and nervine support.', 'Jatamansi is a classical Ayurvedic herb for Vata and Pitta imbalance. It contains jatamansone, a sesquiterpene with demonstrated anxiolytic and neuroprotective effects.', 'Take 1g (approx 1/4 tsp) of powder with honey, twice daily after meals. Or take 250-500mg standardized extract. Best combined with warm milk at bedtime.', 'May lower heart rate slightly. Avoid with bradycardia or heart conditions. Not recommended during pregnancy.', ARRAY['herbal'], ARRAY['pregnancy', 'bradycardia'], '1-2 weeks', 'Easy', '$', false),
('rem_a08', 'Lavender Aromatherapy', 'Natural', 4.6, 546, 'Inhalation of lavender essential oil for immediate calming and reduced anxiety symptoms.', 'Lavender (Lavandula angustifolia) oil inhalation triggers olfactory-limbic pathways, reducing amygdala activity and promoting parasympathetic tone.', 'Add 3-5 drops of pure lavender essential oil to a diffuser or inhale directly from the bottle. Use as needed during anxious moments.', 'Do not ingest essential oils. Keep away from pets (toxic to cats). Test skin patch before topical use.', ARRAY['lavender', 'essential_oil'], ARRAY['asthma_sensitive'], '5-10 minutes', 'Easy', '$', false),
('rem_a09', 'Yoga Nidra Practice', 'Lifestyle', 4.7, 312, 'Guided yogic sleep meditation that systematically relaxes the body and quietens the mind.', 'Yoga Nidra (yogic sleep) is a structured meditation that takes the practitioner through 61 points of body awareness, breath awareness, and visualization.', 'Lie in savasana with a blanket. Follow a guided Yoga Nidra recording (20-30 minutes). Practice daily, ideally before sleep.', 'May trigger emotional release � allow tears if they come. Avoid driving immediately after.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate (per session)', 'Easy', '$', false),
('rem_a10', 'Daily Journaling Practice', 'Lifestyle', 4.5, 412, 'Structured expressive writing that reduces anxiety by externalizing worries.', 'Expressive writing reduces amygdala reactivity and helps the prefrontal cortex process anxious thoughts. Studies show 15 minutes 3x/week reduces anxiety scores by 30-40%.', 'Set a timer for 10-15 minutes daily. Write continuously without stopping. Topics: today''s worries, gratitude, or reframing anxious thoughts.', 'If writing triggers distress, take a break. Not a substitute for professional mental health care.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate (per session)', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;
-- INSOMNIA expansion: Ayurveda x2, Lifestyle x2, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_i06', 'Ashwagandha Warm Milk', 'Ayurveda', 4.4, 289, 'Traditional Ayurvedic nightcap that promotes restful sleep by calming Vata.', 'Ashwagandha (Withania somnifera) in warm milk reduces cortisol, while tryptophan in milk supports serotonin and melatonin production.', 'Mix 1/2 tsp ashwagandha powder into 200ml warm milk. Add a pinch of cardamom or nutmeg. Drink 30-45 minutes before bedtime.', 'May cause morning drowsiness in some. Avoid with hyperthyroidism medications.', ARRAY['herbal', 'dairy'], ARRAY['hyperthyroidism', 'acute_fever'], '30-60 minutes', 'Easy', '$', false),
('rem_i07', 'Tagara Root Extract', 'Ayurveda', 4.0, 87, 'Valeriana wallichii, an Ayurvedic sedative herb that gently induces sleep without hangover.', 'Tagara (Indian valerian) has demonstrated GABAergic activity. Unlike conventional sedatives, it promotes physiological sleep architecture without next-day grogginess.', 'Take 250-500mg Tagara extract 30-60 minutes before bedtime. Start with the lower dose. Use for up to 4 weeks, then take a 1-week break.', 'May cause vivid dreams. Avoid with other sedatives or alcohol. Avoid during pregnancy.', ARRAY['herbal'], ARRAY['pregnancy', 'sedative_medication'], '30-60 minutes', 'Easy', '$', false),
('rem_i08', 'Weighted Blanket', 'Lifestyle', 4.6, 512, 'Deep pressure stimulation blanket that increases serotonin and melatonin for better sleep.', 'Weighted blankets provide Deep Pressure Stimulation (DPS), activating the parasympathetic nervous system and increasing serotonin and melatonin while reducing cortisol.', 'Choose a blanket that is 7-12% of your body weight. Use across the body nightly.', 'Not suitable for infants or individuals with respiratory conditions. Avoid if you have claustrophobia.', ARRAY[]::text[], ARRAY['sleep_apnea', 'respiratory_condition', 'claustrophobia'], 'Immediate', 'Easy', '$$', false),
('rem_i09', 'Sleep Hygiene Protocol', 'Lifestyle', 4.5, 412, 'Evidence-based sleep environment and routine optimization package.', 'Sleep hygiene is the foundation of insomnia treatment: consistent wake time, 1-hour blue-light cutoff, cool room (65-68F), and a 20-minute wind-down routine.', 'Set a fixed wake time 7 days/week. Stop screen use 1 hour before bed. Keep bedroom cool and dark. No caffeine after 2 PM.', 'May take 1-3 weeks to see results. If sleep does not improve after 4 weeks, consult a sleep specialist.', ARRAY[]::text[], ARRAY[]::text[], '1-3 weeks', 'Moderate', '$', false),
('rem_i10', 'Yoga Nidra for Sleep', 'Lifestyle', 4.7, 234, 'Guided relaxation protocol specifically designed for sleep onset insomnia.', 'Yoga Nidra for sleep is a shorter (15-20 min) version designed to be done in bed. It systematically relaxes all 61 body points and guides the practitioner into sleep.', 'Get into bed in a comfortable position. Play a Yoga Nidra for sleep recording. Follow the instructions. If you fall asleep � perfect.', 'Safe for everyone. May need headphones if practicing with a partner.', ARRAY[]::text[], ARRAY[]::text[], '10-20 minutes', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- NAUSEA expansion: Ayurveda x2, Lifestyle x2, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_n06', 'Fennel Seed Chew', 'Ayurveda', 4.3, 312, 'Simple Ayurvedic practice of chewing fennel seeds to settle digestive fire and stop nausea.', 'Fennel contains anethole, fenchone, and estragole � compounds that relax GI smooth muscle and reduce the nausea reflex.', 'Chew 1/2 tsp of fennel seeds slowly after meals or at first sign of nausea. Use as needed up to 3-4 times daily.', 'Generally safe. Excessive intake may cause mild heartburn. Avoid with estrogen-sensitive conditions.', ARRAY['herbal', 'fennel'], ARRAY['estrogen_sensitive_condition'], '5-15 minutes', 'Easy', '$', false),
('rem_n07', 'Cumin & Cardamom Tea', 'Ayurveda', 4.0, 176, 'Digestive Ayurvedic tea that reduces nausea and bloating by balancing Agni.', 'Cumin and cardamom are digestive carminatives that stimulate healthy Agni while calming the upward-moving Vata that causes nausea.', 'Crush 1/2 tsp cumin seeds and 2 green cardamom pods. Simmer in 2 cups water for 10 minutes. Strain and sip slowly.', 'Avoid exceeding 3 cups daily. Cardamom may interact with blood-thinning medications.', ARRAY['herbal', 'cardamom'], ARRAY['blood_thinner_medication'], '10-20 minutes', 'Easy', '$', false),
('rem_n08', 'Acupressure Sea Bands', 'Lifestyle', 4.2, 198, 'Wristbands that apply continuous pressure to P6 (Neiguan) point to suppress nausea.', 'P6 acupressure is one of the most well-studied non-pharmacological antiemetics. Cochrane review evidence supports efficacy.', 'Wear bands on both wrists with the plastic button positioned at the P6 point (3 finger-widths below the wrist crease). Adjust snugness.', 'Avoid wearing too tight. Not recommended on broken or irritated skin.', ARRAY[]::text[], ARRAY[]::text[], '5-15 minutes', 'Easy', '$', false),
('rem_n09', 'Small Frequent Meals Protocol', 'Lifestyle', 4.4, 267, 'Dietary strategy that stabilizes blood sugar and prevents nausea triggers.', 'Small, frequent meals (6-8 per day) prevent stomach distension and blood sugar swings � both common nausea triggers.', 'Eat every 2-3 hours, keeping portions to palm-sized. Focus on bland, dry foods. Avoid fatty, spicy, or strongly fragrant foods.', 'May be challenging with a busy schedule. If nausea persists, consult a gastroenterologist.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Moderate', '$', false),
('rem_n10', 'Lemon Ginger Honey Tonic', 'Natural', 4.6, 412, 'Timeless natural anti-nausea tonic combining three evidence-backed ingredients.', 'Lemon normalizes stomach pH, ginger blocks the nausea reflex at the gut and central level, and honey soothes esophageal irritation.', 'Grate 1-inch fresh ginger, juice 1/2 lemon. Add to 200ml warm water with 1 tsp honey. Sip slowly. Use up to 3-4 times daily.', 'Ginger may thin blood � avoid in large amounts if on warfarin. Honey not recommended for infants under 1 year.', ARRAY['ginger', 'honey', 'lemon'], ARRAY['blood_thinner_medication'], '10-20 minutes', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- STRESS expansion: Ayurveda x2, Lifestyle x2, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_s06', 'Shirodhara for Stress', 'Ayurveda', 4.8, 78, 'Warm oil stream therapy that induces deep parasympathetic activation and mental stillness.', 'Shirodhara synchronizes EEG alpha and theta waves, reduces serum cortisol, and increases dopamine and serotonin receptor sensitivity.', 'Visit an Ayurvedic clinic for 30-45 minute sessions. Typical course: 7-14 sessions. Plan to rest for 30 minutes after.', 'Not recommended during acute illness, fever, or active migraine. Avoid on days with eye infections.', ARRAY['sesame', 'herbal'], ARRAY['acute_fever', 'eye_infection'], '45-60 minutes', 'Requires clinic visit', '$$$', false),
('rem_s07', 'Shankhpushpi for Stress', 'Ayurveda', 4.2, 156, 'Ayurvedic cognitive calmative that reduces stress without sedating the mind.', 'Shankhpushpi works as a Medhya Rasayana � nourishing the nervous system and improving cognitive resilience to stress.', 'Take 1 tsp Shankhpushpi syrup with warm water or milk twice daily. Continue for at least 8 weeks.', 'May interact with sedatives and anxiolytics. Avoid during pregnancy.', ARRAY['herbal'], ARRAY['pregnancy', 'sedative_medication'], '2-4 weeks', 'Easy', '$', false),
('rem_s08', 'Yoga Nidra for Stress', 'Lifestyle', 4.8, 456, 'Systematic relaxation protocol proven to reduce cortisol and restore nervous system balance.', 'A 20-minute Yoga Nidra session reduces cortisol by 30-40% and increases HRV, indicating better stress resilience.', 'Lie down in a comfortable position. Use a guided Yoga Nidra recording. Practice once daily, ideally mid-afternoon.', 'Emotional release is common. Choose a trauma-informed instructor if needed.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate (per session)', 'Easy', '$', false),
('rem_s09', 'Structured Journaling', 'Lifestyle', 4.5, 321, 'Evidence-based expressive writing to process stress and build psychological resilience.', 'Gratitude journaling and cognitive reframing reduce perceived stress, improve mood, and boost immune function.', 'Write for 10 minutes daily using prompts like "Three things I''m grateful for today." Use pen and paper. Do not re-read or edit.', 'If journaling triggers intense negative emotion, consider working with a therapist.', ARRAY[]::text[], ARRAY[]::text[], '1-2 weeks', 'Easy', '$', false),
('rem_s10', 'Forest Bathing Walk', 'Lifestyle', 4.7, 234, 'Mindful nature immersion that lowers cortisol and boosts mood within 20 minutes.', 'Shinrin-yoku (forest bathing): a 20-minute walk in nature reduces cortisol by 12-16% and increases NK cell activity for up to 7 days.', 'Find a park or wooded area. Leave your phone behind. Walk slowly, engaging all senses. Aim for 2-3 sessions per week.', 'Avoid in high pollen seasons if you have severe allergies. Stay on marked trails.', ARRAY['pollen'], ARRAY['severe_pollen_allergy'], '20 minutes', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;
-- BACK PAIN expansion: Ayurveda x2, TCM x1, Lifestyle x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_bp04', 'Mahanarayan Oil Massage', 'Ayurveda', 4.5, 198, 'Classical Ayurvedic medicated oil for deep tissue Vata-pacifying back pain relief.', 'Mahanarayan oil contains 40+ herbs in a sesame oil base, specifically indicated for Vata disorders of the musculoskeletal system.', 'Warm oil to body temperature. Apply generously to the lower back and massage in upward strokes for 10-15 minutes. Leave on for at least 30 minutes.', 'Do not apply to open wounds or acute injuries. May stain clothing.', ARRAY['sesame', 'herbal'], ARRAY['open_wound', 'acute_spinal_injury'], '30-60 minutes', 'Moderate', '$', false),
('rem_bp05', 'Cupping Therapy', 'TCM', 4.3, 145, 'Traditional Chinese suction cup therapy that releases myofascial tension and improves blood flow.', 'Cupping uses vacuum suction to lift superficial tissues, increasing blood flow and releasing myofascial trigger points.', 'Visit a licensed TCM practitioner. Cups placed on the back for 5-15 minutes. Typical course: 1-2 sessions per week for 4-6 weeks.', 'Will leave circular bruises. Not for bleeding disorders or anticoagulant use.', ARRAY[]::text[], ARRAY['bleeding_disorder', 'anticoagulant_use', 'acute_infection'], '1-3 days cumulative', 'Requires practitioner', '$$', false),
('rem_bp06', 'Core Strengthening Routine', 'Lifestyle', 4.5, 412, 'Targeted core exercises that stabilize the spine and prevent back pain recurrence.', 'Core strengthening is the gold standard non-pharmacological intervention for chronic low back pain.', 'Perform daily: dead bug (3x10), bird dog (3x10), pelvic tilts (3x15), cat-cow (3x10). Progress to plank after 2 weeks.', 'Start slow. If any exercise causes sharp or radiating pain, stop and consult a physiotherapist.', ARRAY[]::text[], ARRAY['acute_herniated_disc', 'spinal_fracture'], '2-4 weeks cumulative', 'Moderate', '$', false),
('rem_bp07', 'Kati Basti Therapy', 'Ayurveda', 4.4, 45, 'Ayurvedic procedure where warm medicated oil is retained on the lower back in a dough dam.', 'Kati Basti involves a dough ring over the lower back filled with warm medicated oil retained for 15-30 minutes, allowing deep penetration into spinal tissues.', 'Requires an Ayurvedic practitioner. A course of 7-14 sessions is typical.', 'Not for acute injury or inflammation. Avoid if you have a skin condition in the area.', ARRAY['sesame', 'herbal'], ARRAY['acute_injury', 'skin_condition'], '45-60 minutes per session', 'Requires practitioner', '$$', false)
ON CONFLICT (id) DO NOTHING;

-- SORE THROAT: Ayurveda x2, Natural x1, Lifestyle x1, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_st03', 'Licorice Root Tea', 'Ayurveda', 4.3, 198, 'Sweet Ayurvedic demulcent that coats the throat and reduces inflammation.', 'Licorice (Yashtimadhu) is a potent anti-inflammatory and demulcent. Its glycyrrhizin and flavonoids soothe irritated mucous membranes.', 'Steep 1 tsp dried licorice root in 200ml hot water for 10 minutes. Strain and sip slowly. Use 2-3 times daily. Do not exceed 3 cups per day.', 'Avoid in hypertension, kidney disease, or pregnancy. Do not use for more than 4 weeks.', ARRAY['herbal', 'licorice'], ARRAY['hypertension', 'kidney_disease', 'pregnancy'], '15-30 minutes', 'Easy', '$', false),
('rem_st04', 'Turmeric Honey Ghee Lick', 'Ayurveda', 4.1, 134, 'Ayurvedic throat-soothing paste combining turmeric, honey, and ghee.', 'Turmeric (curcumin), honey (antimicrobial), and ghee (lipid carrier) form a synergistic preparation that coats the throat and reduces inflammation.', 'Mix 1/4 tsp turmeric, 1 tsp honey, and 1/2 tsp warm ghee. Let dissolve slowly in the mouth. Repeat 3-4 times daily.', 'Turmeric stains. Ghee is dairy � not for lactose intolerance.', ARRAY['turmeric', 'honey', 'dairy'], ARRAY['lactose_intolerance', 'gallstones'], '15-30 minutes', 'Easy', '$', false),
('rem_st05', 'Marshmallow Root Tea', 'Natural', 4.2, 167, 'Herbal demulcent that forms a protective film over irritated throat tissues.', 'Marshmallow root contains mucilage that forms a protective film over mucous membranes, reducing irritation from coughing and swallowing.', 'Steep 2 tsp dried marshmallow root in cold water for 6-8 hours (cold infusion extracts more mucilage). Alternatively steep in hot water for 15 minutes.', 'May slow absorption of other medications � take at least 2 hours apart.', ARRAY['herbal'], ARRAY[]::text[], '15-30 minutes', 'Easy', '$', false),
('rem_st06', 'Eucalyptus Steam Inhalation', 'Lifestyle', 4.3, 234, 'Therapeutic steam with eucalyptus to soothe throat inflammation and clear airways.', 'Eucalyptus oil contains 1,8-cineole with mucolytic, anti-inflammatory, and mild antimicrobial properties.', 'Add 2-3 drops eucalyptus oil to hot water. Lean over with towel tent. Breathe through mouth for 5-7 minutes. Repeat 2-3 times daily.', 'Do not ingest eucalyptus oil. Avoid if asthma triggered by strong odors.', ARRAY['eucalyptus_oil'], ARRAY['asthma_sensitive'], 'Immediate', 'Easy', '$', false),
('rem_st07', 'Chinese Pear & Goji Soup', 'TCM', 4.0, 87, 'Classic TCM nourishing soup that moistens the Lung meridian and soothes dry throat.', 'In TCM, pear moistens Lung dryness and generates fluids. Goji berries nourish Yin and support immune function.', 'Peel and core 1-2 Asian pears. Simmer with 1 tbsp goji berries, 1 tbsp rock sugar, and 500ml water for 30 minutes. Drink warm once daily.', 'Not recommended for diarrhea. Goji may interact with warfarin.', ARRAY['fruit', 'goji_berry'], ARRAY['diarrhea', 'warfarin'], '30-60 minutes', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- EYE STRAIN: Ayurveda x1, Lifestyle x2, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_es03', 'Triphala Eye Wash', 'Ayurveda', 4.1, 145, 'Ayurvedic herbal eyewash that soothes tired eyes and reduces strain-related discomfort.', 'Triphala has cooling, antioxidant, and anti-inflammatory properties. As a dilute eyewash, it reduces oxidative stress on the cornea and conjunctiva.', 'Steep 1 tsp Triphala in 200ml hot water for 10 min. Strain thoroughly. Cool. Use eyecup to wash each eye. Use once daily.', 'Must be strained thoroughly � particles can scratch cornea. Discard after 24 hours.', ARRAY['herbal'], ARRAY['corneal_abrasion', 'eye_infection'], 'Immediate', 'Moderate', '$', false),
('rem_es04', 'Palming Technique', 'Lifestyle', 4.4, 312, 'Gentle eye relaxation using warmth from palms to reset vision.', 'Palming covers closed eyes with warm palms, blocking light and allowing retinal photoreceptors and ciliary muscles to fully relax.', 'Rub palms together until warm. Cup over closed eyes without pressing. Ensure complete darkness. Breathe slowly for 2-5 minutes. Repeat every 2 hours during screen work.', 'Do not press on the eyes.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_es05', '20-20-20-20 Rule', 'Lifestyle', 4.6, 534, 'Structured visual break protocol that prevents and relieves digital eye strain.', 'Every 20 minutes: look 20 feet away for 20 seconds, blink 20 times. Resets ciliary muscle and rehydrates corneal surface.', 'Set a 20-minute timer. When it rings: look at an object 20+ feet away. Blink slowly 20 times. Hold gaze for 20 seconds.', 'May disrupt deep work � use a gentle timer, not jarring alarm.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_es06', 'Acupressure for Tired Eyes', 'TCM', 4.2, 167, 'TCM pressure points around the eyes that restore Qi flow and relieve strain.', 'Acupressure on Zanzhu (BL-2), Taiyang (EX-HN5), and Sibai (ST-2) moves Liver Qi stagnation associated with eye strain.', 'Press Zanzhu (inner eyebrow) for 30s. Press Taiyang (temple) for 30s. Press Sibai (below pupil) for 30s. Repeat 3 times. Do 2-3 times daily.', 'Remove contact lenses. Wash hands thoroughly.', ARRAY[]::text[], ARRAY[]::text[], '5-10 minutes', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- PERIOD CRAMPS: Ayurveda x2, Lifestyle x1, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_pc03', 'Dashmool Decoction', 'Ayurveda', 4.3, 145, 'Traditional ten-root Ayurvedic formula for Vata disorders of the female reproductive system.', 'Dashmool (ten roots) is a classical formulation indicated for dysmenorrhea with anti-inflammatory, antispasmodic, and uterine-toning properties.', 'Boil 1 tbsp Dashmool powder in 400ml water until reduced to 100ml. Strain and drink warm twice daily during menstruation.', 'May cause mild digestive upset. Not recommended during pregnancy.', ARRAY['herbal', 'root'], ARRAY['pregnancy', 'acute_fever'], '30-60 minutes', 'Moderate', '$', false),
('rem_pc04', 'Ashoka Bark Tea', 'Ayurveda', 4.2, 123, 'Saraca indica bark tea, the classical Ayurvedic uterine tonic for menstrual health.', 'Ashoka bark tones the uterine muscle, reduces endometrial inflammation, and regulates menstrual flow.', 'Steep 1 tsp Ashoka bark in 200ml hot water for 15 min. Drink twice daily starting 3 days before expected period.', 'May cause mild uterine contractions � avoid if pregnant. Not recommended with hormonal birth control without consulting a doctor.', ARRAY['herbal', 'bark'], ARRAY['pregnancy'], '30-60 minutes', 'Easy', '$', false),
('rem_pc05', 'Gentle Yoga for Cramps', 'Lifestyle', 4.5, 267, 'Targeted yoga sequence that relaxes the pelvic floor and reduces cramp severity.', 'Child''s pose, supine twist, and cat-cow stretch pelvic and abdominal muscles, improving blood flow and reducing prostaglandin-mediated cramping.', 'Hold each pose for 5-8 breaths: child''s pose (60s), cat-cow (10 rounds), supine twist (30s each side), legs-up-the-wall (5 min).', 'Avoid vigorous flow sequences. Skip inversions during heavy flow.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_pc06', 'Moxibustion for Cramps', 'TCM', 4.1, 98, 'TCM heat therapy using mugwort near acupuncture points to warm the uterus.', 'Moxibustion involves burning dried mugwort near CV-6 and SP-6 points. Heat penetrates deep, warming the uterus and moving stagnant Blood and Qi.', 'Visit a licensed TCM practitioner. Moxa stick held 2-3cm above skin at CV-6 and SP-6 for 10-15 minutes each.', 'Burn risk. Strong smoke � ensure ventilation. Not recommended during pregnancy.', ARRAY['mugwort'], ARRAY['pregnancy', 'heavy_bleeding'], '1-3 hours', 'Requires practitioner', '$$', false)
ON CONFLICT (id) DO NOTHING;

-- FEVER: Ayurveda x2, Lifestyle x1, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_fv03', 'Giloy Juice', 'Ayurveda', 4.3, 189, 'Tinospora cordifolia, the Ayurvedic queen of immunity for fever management.', 'Giloy (Guduchi) is a potent immunomodulator and antipyretic. It stimulates macrophage activity and reduces pro-inflammatory cytokines.', 'Extract fresh Giloy stems, crush and soak in water for 30 min, strain and drink. Or take 1 tsp powder with warm water twice daily during fever.', 'May lower blood sugar. Avoid in autoimmune diseases and pregnancy.', ARRAY['herbal'], ARRAY['diabetes', 'autoimmune_disease', 'pregnancy'], '2-4 hours', 'Easy', '$', false),
('rem_fv04', 'Tulsi & Black Pepper Tea', 'Ayurveda', 4.1, 156, 'Ayurvedic diaphoretic tea that induces healthy sweating to break a fever.', 'Tulsi and black pepper create a potent diaphoretic combination promoting healthy sweating (swedana) to help regulate temperature.', 'Steep 5 Tulsi leaves and 1 crushed black peppercorn in 200ml boiling water for 10 min. Add honey. Drink 2-3 cups daily during fever.', 'Do not induce excessive sweating if severely dehydrated. Seek medical care if fever exceeds 103F.', ARRAY['herbal', 'pollen', 'pepper'], ARRAY['hyperacidity', 'dehydration'], '30-60 minutes', 'Easy', '$', false),
('rem_fv05', 'Tepid Sponging Protocol', 'Lifestyle', 4.2, 312, 'Evidence-based cooling using water at body temperature, not cold.', 'Tepid sponging (85-90F) brings down fever through evaporation without causing shivering (which generates heat).', 'Use lukewarm water with a soft cloth. Sponge forehead, armpits, groin, back of neck. Let evaporate. Repeat every 2-3 hours.', 'Never use cold water, ice, or rubbing alcohol. Stop if shivering begins.', ARRAY[]::text[], ARRAY[]::text[], '15-30 minutes', 'Easy', '$', false),
('rem_fv06', 'Feng Chi (GB-20) Massage', 'TCM', 4.0, 98, 'TCM massage at base of skull to release exterior Wind-Heat and support fever recovery.', 'Feng Chi (Wind Pool, GB-20) points help release Wind-Heat, reduce fever-related headache, and support the body''s defense.', 'Find hollows at base of skull. Press firmly with both thumbs. Make circular motions for 60 seconds. Repeat 3-4 times daily.', 'Do not press on the spine. Stop if massage triggers dizziness.', ARRAY[]::text[], ARRAY['cervical_injury'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;
-- SKIN RASH: Ayurveda x2, Natural x1, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_sr03', 'Neem & Turmeric Paste', 'Ayurveda', 4.4, 198, 'Powerful Ayurvedic antimicrobial and anti-inflammatory paste for skin eruptions.', 'Neem is a potent antimicrobial while turmeric is a deep anti-inflammatory. Together they address both infection and inflammation components of rashes.', 'Mix 1 tsp neem powder and 1/2 tsp turmeric with water or aloe gel. Apply 15-20 min. Rinse with cool water. Use once daily.', 'Turmeric stains. Neem has strong smell. Avoid open wounds. Discontinue if rash worsens.', ARRAY['herbal', 'neem', 'turmeric'], ARRAY['open_wounds'], '15-20 minutes', 'Easy', '$', false),
('rem_sr04', 'Aloe Vera & Sandalwood Gel', 'Ayurveda', 4.5, 267, 'Cooling Ayurvedic gel that soothes inflamed skin and speeds healing.', 'Aloe vera is cooling (sheeta) and sandalwood (Chandana) is a Pitta-shamana with antiseptic properties.', 'Mix 2 tbsp fresh aloe gel with 1/2 tsp sandalwood powder. Apply 20-30 min. Rinse with cool water. Use 2-3 times daily.', 'Sandalwood may cause contact dermatitis � always patch test.', ARRAY['herbal', 'sandalwood'], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_sr05', 'Coconut Oil Moisturizer', 'Natural', 4.3, 378, 'Virgin coconut oil for gentle moisturization and antimicrobial skin barrier support.', 'Coconut oil contains lauric acid with antimicrobial properties. It improves skin barrier function by reducing transepidermal water loss.', 'Apply thin layer to affected areas 2-3 times daily, especially after bathing. Use organic unrefined virgin coconut oil.', 'May be comedogenic for some � avoid on acne-prone facial areas.', ARRAY['coconut_oil'], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_sr06', 'Cooling Herbal Wash (TCM)', 'TCM', 4.0, 87, 'Traditional Chinese herbal decoction for external washing of heat-type skin rashes.', 'A wash from Ku Shen, Di Fu Zi, and Bai Xian Pi cools the blood, clears damp-heat, and stops itching in TCM.', 'Boil 30g combined herbs in 1L water for 20 min. Cool. Apply to affected areas or add to bath. Use once daily.', 'For external use only. Patch test first. Discontinue if irritation increases.', ARRAY['herbal'], ARRAY[]::text[], '15-30 minutes', 'Moderate', '$', false)
ON CONFLICT (id) DO NOTHING;

-- EAR PAIN: Ayurveda x2, TCM x1, Lifestyle x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_ep03', 'Garlic & Sesame Oil Drops', 'Ayurveda', 4.2, 134, 'Warm infused oil drops for ear pain relief with antimicrobial garlic.', 'Garlic contains allicin, a potent antimicrobial. Infused in warm sesame oil, it soothes while fighting potential infection.', 'Warm 2 tbsp sesame oil. Add 1 crushed garlic clove, infuse 5 min, strain. Instill 2-3 drops. Lie for 5 min. Repeat 2-3 times daily for up to 3 days.', 'Do not use if eardrum may be perforated. See doctor if pain worsens or persists >48 hours.', ARRAY['garlic', 'sesame'], ARRAY['perforated_eardrum', 'ear_infection'], '15-30 minutes', 'Moderate', '$', false),
('rem_ep04', 'Basil Leaf Juice Drops', 'Ayurveda', 4.0, 67, 'Tulsi leaf juice ear drops for antimicrobial and anti-inflammatory ear pain relief.', 'Tulsi has broad-spectrum antimicrobial, anti-inflammatory, and analgesic properties for ear pain (Karna Shoola).', 'Crush 5-6 fresh Tulsi leaves, extract juice, strain. Warm to body temperature. Instill 2-3 drops. Lie 5 min. Use 2-3 times daily.', 'Do not use if perforated eardrum suspected. Make fresh daily.', ARRAY['herbal', 'tulsi'], ARRAY['perforated_eardrum'], '15-30 minutes', 'Moderate', '$', false),
('rem_ep05', 'Triple Warmer Meridian Massage', 'TCM', 4.0, 76, 'TCM meridian massage that opens the ear channel and relieves congestion-related ear pain.', 'Massaging San Jiao and Gall Bladder meridian points SJ-21 and GB-2 moves Qi and relieves ear pain from stagnation.', 'Press SJ-21 (in front of ear) for 30s. Press GB-2 (below ear) for 30s. Massage tragus in circles. Repeat 3 times.', 'Avoid with TMJ disorder. Gentle pressure only.', ARRAY[]::text[], ARRAY['tmj_disorder', 'acute_otitis'], '5-10 minutes', 'Easy', '$', false),
('rem_ep06', 'Neck & Jaw Release Stretches', 'Lifestyle', 4.3, 189, 'Stretches for neck and jaw that relieve referred ear pain from muscle tension.', 'Ear pain is often referred from tight SCM, masseter, and temporalis muscles. Stretching alleviates tension radiating to the ear.', 'Neck side bend (30s each side). Jaw release: knuckles on masseter, open/close mouth 10 times. Neck rotation (30s each side). Repeat 3x daily.', 'Move slowly. Not for acute ear infection with fever or discharge.', ARRAY[]::text[], ARRAY['acute_otitis', 'tmj_disorder'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- BLOATING: Ayurveda x2, TCM x1, Lifestyle x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_bg03', 'Fennel & Cumin Digestive Water', 'Ayurveda', 4.4, 234, 'Ayurvedic infused water that stimulates Agni and prevents gas formation.', 'Fennel and cumin are the two most important Ayurvedic digestive carminatives, enhancing Agni and reducing Vata in the colon.', 'Roast 1 tsp each fennel and cumin. Add to 500ml water, boil 5 min. Strain and sip throughout the day. Best 15 min before meals.', 'Generally safe. May cause mild heartburn in some.', ARRAY['herbal', 'fennel', 'cumin'], ARRAY['pregnancy_excess'], '15-30 minutes', 'Easy', '$', false),
('rem_bg04', 'Hing (Asafoetida) Preparation', 'Ayurveda', 4.1, 145, 'Powerful Ayurvedic anti-flatulent that instantly relieves bloating and gas pain.', 'Hing inhibits intestinal gas production and relaxes GI smooth muscle. Specifically indicated for Vata disorders of the colon.', 'Dissolve a pinch of hing in 1 tsp warm water. Drink immediately. Use as needed up to 3 times daily after meals.', 'Strong sulfurous smell is normal. Avoid with peptic ulcer or gastritis.', ARRAY['hing_asafoetida'], ARRAY['peptic_ulcer', 'gastritis', 'pregnancy'], '5-15 minutes', 'Easy', '$', false),
('rem_bg05', 'Abdominal Self-Massage (TCM)', 'TCM', 4.2, 176, 'TCM abdominal massage that moves Spleen and Stomach Qi to relieve bloating.', 'Clockwise abdominal massage stimulates peristalsis, moves Qi, and reduces gas accumulation.', 'Lie on back. Make gentle clockwise circles around navel, starting small and expanding outward. 5-10 minutes. Best morning and before bed.', 'Do not massage immediately after large meals. Avoid with abdominal surgery scars or hernias.', ARRAY[]::text[], ARRAY['pregnancy', 'abdominal_surgery', 'hernia'], 'Immediate', 'Easy', '$', false),
('rem_bg06', 'Low FODMAP Awareness Guide', 'Lifestyle', 4.3, 198, 'Dietary framework that identifies and eliminates fermentable triggers of bloating.', 'FODMAPs are poorly absorbed carbohydrates fermented by gut bacteria. The Low FODMAP diet is the gold standard for IBS-related bloating.', 'Phase 1 (2-6 wks): eliminate high-FODMAP foods. Phase 2: reintroduce groups. Phase 3: create personalized diet.', 'Do not start without dietitian guidance � can lead to nutritional deficiencies.', ARRAY[]::text[], ARRAY['eating_disorder', 'malnutrition'], '1-2 weeks (elimination)', 'Moderate-Hard', '$', false)
ON CONFLICT (id) DO NOTHING;

-- HANGOVER: Ayurveda x1, TCM x1, Lifestyle x2
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_ho03', 'Amla & Honey Morning Drink', 'Ayurveda', 4.2, 134, 'Vitamin-C rich Ayurvedic drink that detoxifies the liver and rehydrates after alcohol.', 'Amla is the richest natural source of vitamin C and a potent liver detoxifier. Combined with honey and warm water, it helps process alcohol metabolites.', 'Mix 1 tsp amla powder with 1 tsp honey in 200ml warm water. Drink first thing in the morning on empty stomach.', 'Amla is very sour � may aggravate hyperacidity. Rinse mouth after.', ARRAY['amla', 'honey', 'fruit'], ARRAY['hyperacidity'], '30-60 minutes', 'Easy', '$', false),
('rem_ho04', 'Goji & Chinese Date Recovery Tea', 'TCM', 4.0, 67, 'TCM tea that nourishes Liver and Kidney Yin depleted by alcohol consumption.', 'Goji berries and Chinese dates nourish the Liver and Kidney, generate fluids, and support detoxification after alcohol.', 'Add 1 tbsp goji berries and 3-4 red dates (pitted) to 500ml water. Simmer 20 min. Drink warm.', 'Goji may interact with warfarin. Dates are high in sugar.', ARRAY['goji_berry', 'fruit'], ARRAY['warfarin', 'diabetes'], '30-60 minutes', 'Easy', '$', false),
('rem_ho05', 'Light Walking & Fresh Air', 'Lifestyle', 4.4, 298, 'Gentle movement that accelerates alcohol metabolite clearance and improves hangover symptoms.', 'Light exercise increases metabolic rate to clear acetaldehyde faster. Gentle walking avoids strain on the cardiovascular system.', 'Go for a 15-20 min slow walk in fresh air. Stay in shade. Drink water before and after. Only walk if you feel safe and stable.', 'Do not exercise after heavy drinking if alcohol is still in your system.', ARRAY[]::text[], ARRAY[]::text[], '20-30 minutes', 'Easy', '$', false),
('rem_ho06', 'Sleep Recovery Protocol', 'Lifestyle', 4.6, 412, 'Prioritizing restorative sleep to allow the body to complete alcohol detoxification.', 'Alcohol disrupts REM sleep and increases night awakenings. Recovery sleep is essential for liver metabolism and neurotransmitter restoration.', 'Plan to sleep 8-9 hours. Keep room dark and cool. Practice deep breathing if you wake up early. Take a 20-min afternoon nap if needed.', 'Do not combine with alcohol. If you cannot stay awake, do not drive.', ARRAY[]::text[], ARRAY[]::text[], '8-9 hours', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- FATIGUE: Ayurveda x2, TCM x1, Lifestyle x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_ft03', 'Chyawanprash for Energy', 'Ayurveda', 4.5, 312, 'Traditional Ayurvedic Rasayana jam that builds Ojas and sustains energy levels.', 'Chyawanprash contains amla and 40+ herbs. Clinically shown to improve physical stamina, reduce fatigue, and enhance mitochondrial function.', 'Take 1 tsp (10g) on empty stomach each morning with warm milk or water. Continue for at least 3 months.', 'Contains sugar � diabetics use sugar-free version. Avoid during acute infection.', ARRAY['herbal', 'pollen', 'fruit', 'amla'], ARRAY['diabetes', 'acute_infection'], '2-4 weeks cumulative', 'Easy', '$', false),
('rem_ft04', 'Shilajit Resin', 'Ayurveda', 4.3, 198, 'Mineral-rich Himalayan pitch that boosts mitochondrial ATP production and reduces fatigue.', 'Shilajit is rich in fulvic acid and 84+ trace minerals. It enhances mitochondrial ATP production and electron transport chain efficiency.', 'Take pea-sized amount (300-500mg) dissolved in warm milk or water, once daily on empty stomach. Use 8-12 weeks, then 2-week break.', 'Do not use unpurified Shilajit. Avoid with iron overload conditions.', ARRAY['shilajit', 'fulvic_acid'], ARRAY['hemochromatosis', 'sickle_cell', 'pregnancy'], '1-2 weeks cumulative', 'Easy', '$$', false),
('rem_ft05', 'Qi Gong Energy Practice', 'TCM', 4.4, 145, 'TCM movement meditation that cultivates and circulates Qi for sustained vitality.', 'Qi Gong combines gentle movement, breath regulation, and intention to balance Qi. Increases mitochondrial density and oxygen utilization.', 'Practice 15-20 minutes daily. Key exercises: Eight Brocades. Many free guided videos. Best done in the morning.', 'Move slowly and gently. If dizzy, pause and breathe.', ARRAY[]::text[], ARRAY[]::text[], '1-2 weeks cumulative', 'Easy', '$', false),
('rem_ft06', 'Strategic Power Nap Protocol', 'Lifestyle', 4.5, 378, 'Evidence-based napping protocol that restores energy without affecting nighttime sleep.', 'A 10-20 minute power nap improves alertness and cognitive performance without sleep inertia or nighttime sleep disruption.', 'Set alarm for 20 min. Lie down in dark, quiet room. Close your eyes. Nap at least 8 hours before bedtime. Limit to one nap daily.', 'Longer naps (>30 min) cause sleep inertia. Napping after 4 PM may disrupt nighttime sleep.', ARRAY[]::text[], ARRAY['insomnia', 'sleep_apnea'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;
-- LEG PAIN: Ayurveda x1, Lifestyle x3, TCM x1, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_lp03', 'Epsom Salt Soak', 'Lifestyle', 4.4, 312, 'Warm soak with magnesium sulfate to relax leg muscles and reduce soreness.', 'Epsom salt (magnesium sulfate) is absorbed transdermally. Magnesium reduces muscle excitability and inflammation.', 'Add 2 cups Epsom salt to warm bath. Soak legs 15-20 min. Pat dry. Use 2-3 times per week.', 'Avoid with open wounds or severe varicose veins.', ARRAY[]::text[], ARRAY['open_wound', 'severe_varicose_veins'], 'Immediate', 'Easy', '$', false),
('rem_lp04', 'Mahanarayan Oil Massage (Legs)', 'Ayurveda', 4.3, 145, 'Ayurvedic herbal oil massage specifically for Vata-type leg pain and heaviness.', 'Mahanarayan oil penetrates deep into leg muscle and joint tissues, pacifying Vata and reducing stiffness and cramping.', 'Warm oil. Massage into legs using upward strokes for 10-15 min. Leave on 30 min or overnight. Use daily for 2 weeks.', 'Avoid applying to open wounds or rashes. May stain sheets.', ARRAY['sesame', 'herbal'], ARRAY['open_wound', 'acute_injury'], '30-60 minutes', 'Moderate', '$', false),
('rem_lp05', 'Cupping for Legs', 'TCM', 4.1, 98, 'TCM suction therapy that releases deep muscle tension and improves leg circulation.', 'Cupping on Bladder and Gallbladder meridians moves stagnant Qi and Blood in leg muscles.', 'Visit licensed TCM practitioner. Cups on back of thighs and calves 5-10 min. 4-6 session course.', 'Not for varicose veins. Avoid with bleeding disorders.', ARRAY[]::text[], ARRAY['bleeding_disorder', 'anticoagulant_use', 'severe_varicose_veins'], '1-3 days cumulative', 'Requires practitioner', '$$', false),
('rem_lp06', 'Leg Elevation & Rest', 'Lifestyle', 4.5, 298, 'Simple elevation protocol that improves venous return and reduces leg discomfort.', 'Elevating legs above heart uses gravity to assist venous return, reducing edema and heavy/aching legs sensation.', 'Lie with legs elevated on 2-3 pillows above heart level for 15-20 min. Repeat 2-3 times daily.', 'Avoid with congestive heart failure. Do not use if suspected DVT.', ARRAY[]::text[], ARRAY['congestive_heart_failure', 'suspected_dvt'], 'Immediate', 'Easy', '$', false),
('rem_lp07', 'Turmeric Anti-Inflammatory Compress', 'Natural', 4.1, 134, 'Warm turmeric paste compress for localized leg pain and muscle inflammation.', 'Turmeric reduces inflammation via NF-kB inhibition. Warmth increases blood flow while curcumin penetrates skin.', 'Mix 1 tbsp turmeric with warm water to paste. Spread on cloth, apply 20-30 min. Use once daily.', 'Turmeric stains. Discontinue if skin irritation.', ARRAY['turmeric', 'herbal'], ARRAY['open_wound'], '20-30 minutes', 'Easy', '$', false),
('rem_lp08', 'Gentle Walking Recovery', 'Lifestyle', 4.6, 456, 'Low-intensity walking protocol that promotes circulation without stressing sore legs.', 'Gentle walking increases blood flow without additional microtrauma. Active recovery reduces DOMS more than complete rest.', 'Walk at conversational pace 10-20 min. Stop if pain increases. Repeat daily. Progress duration as comfort improves.', 'If walking worsens pain, rest and evaluate. Not for acute injuries.', ARRAY[]::text[], ARRAY['acute_injury', 'fracture'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- KNEE PAIN: Lifestyle x2, Ayurveda x2, TCM x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_kp03', 'Quadriceps Strengthening Routine', 'Lifestyle', 4.5, 312, 'Strengthening the quads to stabilize the patella and reduce knee joint stress.', 'Strong quads stabilize the patella and absorb shock. The foundational non-surgical intervention for most knee pain.', 'Daily: straight leg raises (3x10), terminal knee extensions (3x10), wall sits (3x20s), step-ups (3x10). Go slowly.', 'Do not exercise through sharp or grinding pain.', ARRAY[]::text[], ARRAY['acute_knee_injury', 'meniscal_tear'], '2-4 weeks cumulative', 'Moderate', '$', false),
('rem_kp04', 'Turmeric & Ginger Compress', 'Ayurveda', 4.2, 167, 'Ayurvedic warm poultice for deep anti-inflammatory action on knee joints.', 'Turmeric and ginger, two potent anti-inflammatories, applied as warm poultice reduce synovial inflammation. Ayurveda recommends for Sandhigata Vata.', 'Mix 1 tbsp turmeric, 1 tbsp grated ginger, warm water to paste. Wrap knee with cloth. Leave 30-45 min. Use once daily for 2 weeks.', 'Turmeric stains. Ginger may cause tingling � normal.', ARRAY['turmeric', 'ginger', 'herbal'], ARRAY['open_wound', 'skin_ulceration'], '30-45 minutes', 'Moderate', '$', false),
('rem_kp05', 'Acupuncture for Knee Pain', 'TCM', 4.3, 156, 'TCM acupuncture targeting knee joint points to reduce pain and improve function.', 'Key points ST-35, SP-9, GB-34. Meta-analyses show significant pain reduction for knee osteoarthritis.', 'Visit licensed acupuncturist. 5-8 needles around knee. 20-30 min sessions. Standard: 8-12 sessions, 1-2x weekly.', 'Minor bruising common. Not with anticoagulant therapy.', ARRAY[]::text[], ARRAY['bleeding_disorder', 'anticoagulant_use'], '1-3 sessions cumulative', 'Requires practitioner', '$$', false),
('rem_kp06', 'Epsom Salt Knee Soak', 'Lifestyle', 4.3, 234, 'Warm magnesium soak specifically targeted to knee joint and surrounding muscles.', 'Concentrated Epsom salt soak brings magnesium to the knee. Reduces inflammation and relaxes quadriceps and hamstrings.', 'Fill basin with warm water covering knee. Add 1 cup Epsom salt. Soak 15-20 min. Move knee gently during soak. Use 2-3x weekly.', 'Do not soak with open wounds or recent surgical incisions.', ARRAY[]::text[], ARRAY['open_wound', 'recent_surgery'], '15-20 minutes', 'Easy', '$', false),
('rem_kp07', 'Mahanarayan Oil (Knee)', 'Ayurveda', 4.2, 98, 'Ayurvedic medicated oil therapy specifically for knee joint stiffness and Vata pain.', 'Mahanarayan oil penetrates the knee joint capsule, reducing stiffness and lubricating the joint for Sandhigata Vata.', 'Warm oil. Apply around knee (not kneecap). Massage 10 min. Wrap with warm towel 20 min. Use daily 2-4 weeks.', 'Avoid massaging directly on kneecap. Not if hot or swollen.', ARRAY['sesame', 'herbal'], ARRAY['hot_swollen_joint', 'knee_infection'], '30-60 minutes', 'Moderate', '$', false)
ON CONFLICT (id) DO NOTHING;

-- NECK PAIN: Lifestyle x2, Ayurveda x2, TCM x1, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_np03', 'Neck Rolls & Stretches', 'Lifestyle', 4.5, 412, 'Simple range-of-motion exercises that release cervical tension and prevent stiffness.', 'Gentle neck mobility improves blood flow, reduces guarding, and maintains healthy cervical range of motion.', 'Slow half-circle rolls (ear to chest to other ear). Chin tucks (10x). Neck side bend (20s each). Repeat 3x daily.', 'Never roll head fully backward. Stop if sharp or radiating arm pain.', ARRAY[]::text[], ARRAY['cervical_instability', 'acute_whiplash'], 'Immediate', 'Easy', '$', false),
('rem_np04', 'Mahanarayan Oil (Neck)', 'Ayurveda', 4.3, 134, 'Warm Ayurvedic oil massage for cervical Vata disorders and neck stiffness.', 'Mahanarayan oil penetrates cervical facet joints, relaxing trapezius and levator scapulae while reducing inflammation.', 'Warm oil. Apply to neck and upper shoulders. Massage gently 10 min. Wrap warm towel 20 min. Use daily 2 weeks.', 'Avoid front of neck. Not with cervical injury or acute nerve symptoms.', ARRAY['sesame', 'herbal'], ARRAY['cervical_injury', 'acute_nerve_symptoms'], '30-60 minutes', 'Moderate', '$', false),
('rem_np05', 'Gua Sha for Neck Tension', 'TCM', 4.2, 178, 'TCM instrument-assisted scraping that releases deep neck fascia and muscle tension.', 'Gua Sha breaks up trigger points, improves microcirculation, and reduces pain in trapezius and levator scapulae.', 'Apply oil. Scrape downward strokes along neck with Gua Sha tool. 20 strokes per area. Mild bruising expected. Use 2-3x weekly.', 'Leaves temporary bruising. Not on moles, varicose veins, or swollen lymph nodes.', ARRAY[]::text[], ARRAY['bleeding_disorder', 'anticoagulant_use'], '1-2 days cumulative', 'Moderate', '$', false),
('rem_np06', 'Turmeric Compress (Neck)', 'Natural', 4.1, 98, 'Warm anti-inflammatory compress specifically for chronic neck muscle tension.', 'Warm turmeric compress combines curcumin anti-inflammatory power with heat muscle-relaxing effect for tech neck.', 'Mix 1 tbsp turmeric with warm water to paste. Apply to back of neck with warm towel 20-30 min. Use 2-3x weekly.', 'Turmeric stains. Not for acute spinal injury.', ARRAY['turmeric', 'herbal'], ARRAY['acute_cervical_injury'], '20-30 minutes', 'Easy', '$', false),
('rem_np07', 'Posture Check Routine', 'Lifestyle', 4.6, 345, 'Ergonomic awareness habit that prevents and alleviates forward-head posture neck pain.', 'Forward-head posture increases head weight on cervical spine from 10 to 60 lbs. Posture correction addresses the root cause.', 'Set hourly posture reminders. Ears over shoulders, shoulders back, chin tucked. Use standing desk 50% of day. Screen at eye level.', 'Posture change takes 4-8 weeks. If correction causes new pain, see a PT.', ARRAY[]::text[], ARRAY[]::text[], '2-4 weeks cumulative', 'Moderate', '$', false),
('rem_np08', 'Abhyanga Neck Massage', 'Ayurveda', 4.4, 123, 'Self-oil massage following Ayurvedic Abhyanga principles for daily neck care.', 'Abhyanga (self-oil massage) with warm sesame oil pacifies Vata, improves circulation, and prevents cervical stiffness.', 'Warm 2 tbsp sesame oil. Long strokes from neck base to jaw. Circular motions on shoulders. Massage 5-10 min. Leave 15 min before shower.', 'Avoid front of neck (over thyroid). Use gentle pressure.', ARRAY['sesame', 'coconut_oil'], ARRAY['thyroid_condition', 'acute_cervical_injury'], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;

-- SHOULDER PAIN: Lifestyle x2, Ayurveda x2, TCM x1, Natural x1
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_sp03', 'Doorway Chest Stretch', 'Lifestyle', 4.5, 345, 'Simple doorframe stretch that opens the chest and relieves forward-shoulder pain.', 'Tight pectorals pull shoulders forward. Doorway stretch reverses this and relieves posterior shoulder strain.', 'Place forearms on doorframe at shoulder height. Lean forward until chest stretch. Hold 30-45s at 3 angles. Do 2-3 rounds daily.', 'Do not overstretch. Stop if shoulder instability.', ARRAY[]::text[], ARRAY['shoulder_dislocation_history', 'acute_rotator_cuff_injury'], 'Immediate', 'Easy', '$', false),
('rem_sp04', 'Abhyanga Shoulder Massage', 'Ayurveda', 4.3, 167, 'Ayurvedic self-massage of the shoulders and upper back for Vata relief.', 'Warm sesame oil with circular motions over deltoid and long strokes from neck to shoulder pacify Vata and release fascial tension.', 'Warm sesame oil. Circular motions over deltoid (20 each direction). Sweeping strokes from neck to shoulder (15 each). Massage 10 min daily.', 'Avoid acutely injured or inflamed shoulder.', ARRAY['sesame'], ARRAY['acute_rotator_cuff_tear', 'shoulder_dislocation'], '10-15 minutes', 'Easy', '$', false),
('rem_sp05', 'Cupping for Shoulders', 'TCM', 4.2, 123, 'TCM cupping therapy that releases frozen shoulder tension and improves mobility.', 'Cupping on Gallbladder and Small Intestine meridians breaks up adhesions in rotator cuff and deltoid.', 'Visit licensed TCM practitioner. Cups on upper back and shoulder for 5-10 min. 6-10 session course for chronic conditions.', 'Circular marks normal. Not with bleeding disorders or shoulder infection.', ARRAY[]::text[], ARRAY['bleeding_disorder', 'anticoagulant_use', 'shoulder_fracture'], '1-3 days cumulative', 'Requires practitioner', '$$', false),
('rem_sp06', 'Turmeric Compress (Shoulder)', 'Natural', 4.1, 87, 'Warm anti-inflammatory compress for shoulder bursitis and tendonitis.', 'Turmeric compress targets inflammation in subacromial bursa and rotator cuff tendons combined with heat for blood flow.', 'Mix 1 tbsp turmeric with warm water. Spread on cloth over painful shoulder. Warm towel over. Leave 25-30 min. Use once daily 2 weeks.', 'Not for acute shoulder injury with severe swelling � use ice first 48h.', ARRAY['turmeric', 'herbal'], ARRAY['acute_injury_first_48h'], '25-30 minutes', 'Easy', '$', false),
('rem_sp07', 'Shoulder Rolls & Pendulums', 'Lifestyle', 4.4, 267, 'Gentle Codman pendulum exercises and shoulder rolls for mobility and pain relief.', 'Pendulum exercises and rolls improve synovial fluid circulation and maintain pain-free ROM.', 'Lean forward, let arm hang. Swing small circles (10 each direction). Shoulder rolls: shrug up-back-down-forward (10). Repeat 3x daily.', 'Move only within pain-free range. Not for acute rotator cuff tear.', ARRAY[]::text[], ARRAY['acute_rotator_cuff_tear', 'shoulder_fracture'], 'Immediate', 'Easy', '$', false),
('rem_sp08', 'Mahanarayan Oil (Shoulder)', 'Ayurveda', 4.2, 89, 'Deep-acting Ayurvedic oil therapy for shoulder joint stiffness and Vata pain.', 'Mahanarayan oil addresses capsular stiffness, rotator cuff tendinopathy, and Vata-aggravated shoulder pain.', 'Warm oil. Apply to entire shoulder girdle. Massage 10 min focusing on deltoid and rotator cuff. Warm towel 20 min. Use daily at bedtime.', 'Not if shoulder is hot, red, or swollen. Avoid vigorous massage with calcific tendonitis.', ARRAY['sesame', 'herbal'], ARRAY['acute_inflammation', 'calcific_tendonitis'], '30-60 minutes', 'Moderate', '$', false)
ON CONFLICT (id) DO NOTHING;

-- EYE PAIN: Ayurveda x2, Natural x1, TCM x1, Lifestyle x2
INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, allergen_tags, contraindications, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_ey01', 'Triphala Eye Wash (Eye Pain)', 'Ayurveda', 4.2, 134, 'Ayurvedic cool eyewash that reduces eye pain from strain, dryness, or allergy.', 'Triphala antioxidant and anti-inflammatory properties soothe acute eye pain from screen overuse or environmental irritation.', 'Same preparation as eye strain wash. Use cool for pain. Rinse each eye with clean eyecup. Use once daily.', 'Must be meticulously strained to avoid corneal abrasion. If severe pain or vision changes, see ophthalmologist.', ARRAY['herbal'], ARRAY['corneal_abrasion', 'eye_infection'], 'Immediate', 'Moderate', '$', false),
('rem_ey02', 'Warm Chamomile Compress', 'Natural', 4.3, 212, 'Soothing warm compress with chamomile for tired, painful eyes.', 'Chamomile has anti-inflammatory and mild analgesic properties. Warm compress dilates vessels and soothes orbicularis oculi.', 'Steep 2 chamomile tea bags in hot water 5 min. Squeeze excess. Place over closed eyes 10-15 min. Use once daily.', 'Test temperature � warm not hot. Discontinue if irritation increases.', ARRAY['chamomile', 'herbal', 'pollen'], ARRAY['ragweed_allergy'], '10-15 minutes', 'Easy', '$', false),
('rem_ey03', 'Acupressure for Eye Pain', 'TCM', 4.1, 145, 'TCM pressure points around the eye that relieve pain by moving Liver Qi stagnation.', 'TCM associates eye pain with Liver Fire or Stagnation. Points Zanzhu (BL-2) and Taiyang (EX-HN5) provide rapid relief.', 'Press Zanzhu (inner brow) upward 30s. Press Taiyang (temple) 30s. Press Jingming (inner eye corner) gently 15s. Repeat 3-4 times.', 'Wash hands. Remove contacts. Gentle pressure only.', ARRAY[]::text[], ARRAY['glaucoma', 'retinal_detachment', 'eye_infection'], '5-10 minutes', 'Easy', '$', false),
('rem_ey04', 'Cold Spoon Compress', 'Lifestyle', 4.4, 267, 'Quick cold compress technique using chilled metal spoons for eye pain and puffiness.', 'Cold numbs pain receptors and reduces inflammation. Metal spoons retain cold and conform to orbital ridge.', 'Refrigerate 4 metal spoons 10-15 min. Lie down. Place curved side over closed eyes. Switch when warm. Repeat 5-10 min total.', 'Refrigerator temp only (not freezer). Never press on eyeball.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Easy', '$', false),
('rem_ey05', 'Rose Water Eye Drops', 'Ayurveda', 4.3, 189, 'Ayurvedic cooling rose water drops that refresh tired, painful eyes.', 'Pure rose water has cooling (sheeta) and tridoshic properties. Soothes inflamed eyes, reduces redness, and provides gentle lubrication.', 'Instill 1-2 drops pure preservative-free rose water in each eye. Blink gently. Use as needed up to 4-5 times daily.', 'Use only pure rose water without alcohol or preservatives. Discontinue if stinging.', ARRAY['rose', 'herbal'], ARRAY['eye_infection', 'corneal_abrasion'], 'Immediate', 'Easy', '$', false),
('rem_ey06', 'Blinking & Focus Exercise', 'Lifestyle', 4.2, 198, 'Conscious blinking and focus-shifting exercise that rehydrates and relaxes eyes.', 'Screen use reduces blink rate to 3-5/min. Conscious blinking restores tear film. Focus-shifting relaxes ciliary muscle.', 'Every 30 min: blink completely 10 times slowly. Then shift focus from thumb (6 inches) to object 20 feet away. Repeat 5 times.', 'If you cannot focus near or far, see an optometrist.', ARRAY[]::text[], ARRAY[]::text[], 'Immediate', 'Easy', '$', false)
ON CONFLICT (id) DO NOTHING;
-- =============================================================================
-- PART 6: REMEDY ? SYMPTOM MAPPINGS (remedy_symptoms)
-- =============================================================================

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES
  ('rem_h06', 'headache'), ('rem_h07', 'headache'), ('rem_h08', 'headache'),
  ('rem_h09', 'headache'), ('rem_h10', 'headache'),
  ('rem_c06', 'cold'), ('rem_c07', 'cold'), ('rem_c08', 'cold'),
  ('rem_c09', 'cold'), ('rem_c10', 'cold'),
  ('rem_a06', 'anxiety'), ('rem_a07', 'anxiety'), ('rem_a08', 'anxiety'),
  ('rem_a09', 'anxiety'), ('rem_a10', 'anxiety'),
  ('rem_i06', 'insomnia'), ('rem_i07', 'insomnia'), ('rem_i08', 'insomnia'),
  ('rem_i09', 'insomnia'), ('rem_i10', 'insomnia'),
  ('rem_n06', 'nausea'), ('rem_n07', 'nausea'), ('rem_n08', 'nausea'),
  ('rem_n09', 'nausea'), ('rem_n10', 'nausea'),
  ('rem_s06', 'stress'), ('rem_s07', 'stress'), ('rem_s08', 'stress'),
  ('rem_s09', 'stress'), ('rem_s10', 'stress'),
  ('rem_bp04', 'back_pain'), ('rem_bp05', 'back_pain'),
  ('rem_bp06', 'back_pain'), ('rem_bp07', 'back_pain'),
  ('rem_st03', 'sore_throat'), ('rem_st04', 'sore_throat'),
  ('rem_st05', 'sore_throat'), ('rem_st06', 'sore_throat'), ('rem_st07', 'sore_throat'),
  ('rem_es03', 'eye_strain'), ('rem_es04', 'eye_strain'),
  ('rem_es05', 'eye_strain'), ('rem_es06', 'eye_strain'),
  ('rem_pc03', 'period_cramps'), ('rem_pc04', 'period_cramps'),
  ('rem_pc05', 'period_cramps'), ('rem_pc06', 'period_cramps'),
  ('rem_fv03', 'fever'), ('rem_fv04', 'fever'), ('rem_fv05', 'fever'), ('rem_fv06', 'fever'),
  ('rem_sr03', 'skin_rash'), ('rem_sr04', 'skin_rash'), ('rem_sr05', 'skin_rash'), ('rem_sr06', 'skin_rash'),
  ('rem_ep03', 'ear_pain'), ('rem_ep04', 'ear_pain'), ('rem_ep05', 'ear_pain'), ('rem_ep06', 'ear_pain'),
  ('rem_bg03', 'bloating'), ('rem_bg04', 'bloating'), ('rem_bg05', 'bloating'), ('rem_bg06', 'bloating'),
  ('rem_ho03', 'hangover'), ('rem_ho04', 'hangover'), ('rem_ho05', 'hangover'), ('rem_ho06', 'hangover'),
  ('rem_ft03', 'fatigue'), ('rem_ft04', 'fatigue'), ('rem_ft05', 'fatigue'), ('rem_ft06', 'fatigue'),
  ('rem_lp03', 'leg_pain'), ('rem_lp04', 'leg_pain'), ('rem_lp05', 'leg_pain'),
  ('rem_lp06', 'leg_pain'), ('rem_lp07', 'leg_pain'), ('rem_lp08', 'leg_pain'),
  ('rem_kp03', 'knee_pain'), ('rem_kp04', 'knee_pain'), ('rem_kp05', 'knee_pain'),
  ('rem_kp06', 'knee_pain'), ('rem_kp07', 'knee_pain'),
  ('rem_np03', 'neck_pain'), ('rem_np04', 'neck_pain'), ('rem_np05', 'neck_pain'),
  ('rem_np06', 'neck_pain'), ('rem_np07', 'neck_pain'), ('rem_np08', 'neck_pain'),
  ('rem_sp03', 'shoulder_pain'), ('rem_sp04', 'shoulder_pain'), ('rem_sp05', 'shoulder_pain'),
  ('rem_sp06', 'shoulder_pain'), ('rem_sp07', 'shoulder_pain'), ('rem_sp08', 'shoulder_pain'),
  ('rem_ey01', 'eye_pain'), ('rem_ey02', 'eye_pain'), ('rem_ey03', 'eye_pain'),
  ('rem_ey04', 'eye_pain'), ('rem_ey05', 'eye_pain'), ('rem_ey06', 'eye_pain')
ON CONFLICT (remedy_id, symptom_id) DO NOTHING;

-- Secondary mappings (shared benefits) — skip missing remedies
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id)
SELECT v.* FROM (VALUES
  ('rem_c06', 'cough'), ('rem_c09', 'cough'), ('rem_c06', 'congestion'),
  ('rem_c09', 'congestion'), ('rem_c10', 'congestion'), ('rem_s10', 'anxiety'),
  ('rem_a09', 'stress'), ('rem_a10', 'stress'), ('rem_bp06', 'stress'),
  ('rem_ft05', 'stress'), ('rem_s03', 'fatigue'), ('rem_ho05', 'fatigue'),
  ('rem_ft06', 'stress'), ('rem_n06', 'bloating'), ('rem_bg03', 'nausea'),
  ('rem_np07', 'headache'), ('rem_sp03', 'headache'), ('rem_ey04', 'headache'),
  ('rem_ey06', 'eye_strain'), ('rem_ft06', 'fatigue'), ('rem_lp08', 'fatigue')
) v(remedy_id, symptom_id)
WHERE EXISTS (SELECT 1 FROM public.remedies WHERE id = v.remedy_id)
ON CONFLICT (remedy_id, symptom_id) DO NOTHING;

-- =============================================================================
-- PART 7: SYMPTOM ? REMEDY SCORED MAPPINGS (symptom_remedies)
-- =============================================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
SELECT rs.symptom_id, rs.remedy_id,
  5 AS evidence_score,
  CASE
    WHEN rs.symptom_id = 'headache' AND rs.remedy_id IN ('rem_h06','rem_h07') THEN 8
    WHEN rs.symptom_id = 'headache' AND rs.remedy_id IN ('rem_h08','rem_h10') THEN 7
    WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h09' THEN 6
    WHEN rs.symptom_id = 'cold' AND rs.remedy_id IN ('rem_c06','rem_c08','rem_c10') THEN 8
    WHEN rs.symptom_id = 'cold' AND rs.remedy_id IN ('rem_c07') THEN 7
    WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c09' THEN 9
    WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a06' THEN 8
    WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a07' THEN 7
    WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a08' THEN 9
    WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id IN ('rem_a09','rem_a10') THEN 10
    WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id IN ('rem_i06','rem_i08') THEN 8
    WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i07' THEN 7
    WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i09' THEN 10
    WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i10' THEN 9
    WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n06' THEN 8
    WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n07' THEN 7
    WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n08' THEN 8
    WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n09' THEN 9
    WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n10' THEN 10
    WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s06' THEN 8
    WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s07' THEN 7
    WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s08' THEN 10
    WHEN rs.symptom_id = 'stress' AND rs.remedy_id IN ('rem_s09','rem_s10') THEN 9
    WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id IN ('rem_bp04','rem_bp07') THEN 8
    WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp05' THEN 7
    WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp06' THEN 10
    WHEN rs.symptom_id = 'sore_throat' AND rs.remedy_id IN ('rem_st03','rem_st05','rem_st06') THEN 8
    WHEN rs.symptom_id = 'sore_throat' AND rs.remedy_id IN ('rem_st04') THEN 7
    WHEN rs.symptom_id = 'sore_throat' AND rs.remedy_id = 'rem_st07' THEN 6
    WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es03' THEN 7
    WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es04' THEN 9
    WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es05' THEN 10
    WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es06' THEN 8
    WHEN rs.symptom_id = 'period_cramps' AND rs.remedy_id IN ('rem_pc03','rem_pc04') THEN 8
    WHEN rs.symptom_id = 'period_cramps' AND rs.remedy_id = 'rem_pc05' THEN 9
    WHEN rs.symptom_id = 'period_cramps' AND rs.remedy_id = 'rem_pc06' THEN 7
    WHEN rs.symptom_id = 'fever' AND rs.remedy_id IN ('rem_fv03','rem_fv05') THEN 9
    WHEN rs.symptom_id = 'fever' AND rs.remedy_id = 'rem_fv06' THEN 6
    WHEN rs.symptom_id = 'fever' AND rs.remedy_id = 'rem_fv04' THEN 7
    WHEN rs.symptom_id = 'skin_rash' AND rs.remedy_id IN ('rem_sr03','rem_sr04') THEN 8
    WHEN rs.symptom_id = 'skin_rash' AND rs.remedy_id = 'rem_sr05' THEN 7
    WHEN rs.symptom_id = 'skin_rash' AND rs.remedy_id = 'rem_sr06' THEN 6
    WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep03' THEN 7
    WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep04' THEN 6
    WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep05' THEN 7
    WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep06' THEN 8
    WHEN rs.symptom_id = 'bloating' AND rs.remedy_id IN ('rem_bg03','rem_bg06') THEN 9
    WHEN rs.symptom_id = 'bloating' AND rs.remedy_id IN ('rem_bg04') THEN 8
    WHEN rs.symptom_id = 'bloating' AND rs.remedy_id = 'rem_bg05' THEN 7
    WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho03' THEN 7
    WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho04' THEN 6
    WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho05' THEN 8
    WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho06' THEN 9
    WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft03' THEN 8
    WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft04' THEN 7
    WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft05' THEN 8
    WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft06' THEN 9
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp03' THEN 7
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp04' THEN 7
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp05' THEN 6
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp06' THEN 8
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp07' THEN 6
    WHEN rs.symptom_id = 'leg_pain' AND rs.remedy_id = 'rem_lp08' THEN 9
    WHEN rs.symptom_id = 'knee_pain' AND rs.remedy_id = 'rem_kp03' THEN 9
    WHEN rs.symptom_id = 'knee_pain' AND rs.remedy_id = 'rem_kp04' THEN 7
    WHEN rs.symptom_id = 'knee_pain' AND rs.remedy_id = 'rem_kp05' THEN 8
    WHEN rs.symptom_id = 'knee_pain' AND rs.remedy_id = 'rem_kp06' THEN 7
    WHEN rs.symptom_id = 'knee_pain' AND rs.remedy_id = 'rem_kp07' THEN 7
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np03' THEN 9
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np04' THEN 8
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np05' THEN 7
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np06' THEN 6
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np07' THEN 10
    WHEN rs.symptom_id = 'neck_pain' AND rs.remedy_id = 'rem_np08' THEN 7
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp03' THEN 9
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp04' THEN 7
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp05' THEN 7
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp06' THEN 6
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp07' THEN 8
    WHEN rs.symptom_id = 'shoulder_pain' AND rs.remedy_id = 'rem_sp08' THEN 7
    WHEN rs.symptom_id = 'eye_pain' AND rs.remedy_id IN ('rem_ey01','rem_ey05') THEN 7
    WHEN rs.symptom_id = 'eye_pain' AND rs.remedy_id IN ('rem_ey02','rem_ey04') THEN 8
    WHEN rs.symptom_id = 'eye_pain' AND rs.remedy_id = 'rem_ey03' THEN 7
    WHEN rs.symptom_id = 'eye_pain' AND rs.remedy_id = 'rem_ey06' THEN 8
    ELSE 5
  END AS priority_rank
FROM public.remedy_symptoms rs
WHERE rs.remedy_id IN (
  'rem_h06','rem_h07','rem_h08','rem_h09','rem_h10',
  'rem_c06','rem_c07','rem_c08','rem_c09','rem_c10',
  'rem_a06','rem_a07','rem_a08','rem_a09','rem_a10',
  'rem_i06','rem_i07','rem_i08','rem_i09','rem_i10',
  'rem_n06','rem_n07','rem_n08','rem_n09','rem_n10',
  'rem_s06','rem_s07','rem_s08','rem_s09','rem_s10',
  'rem_bp04','rem_bp05','rem_bp06','rem_bp07',
  'rem_st03','rem_st04','rem_st05','rem_st06','rem_st07',
  'rem_es03','rem_es04','rem_es05','rem_es06',
  'rem_pc03','rem_pc04','rem_pc05','rem_pc06',
  'rem_fv03','rem_fv04','rem_fv05','rem_fv06',
  'rem_sr03','rem_sr04','rem_sr05','rem_sr06',
  'rem_ep03','rem_ep04','rem_ep05','rem_ep06',
  'rem_bg03','rem_bg04','rem_bg05','rem_bg06',
  'rem_ho03','rem_ho04','rem_ho05','rem_ho06',
  'rem_ft03','rem_ft04','rem_ft05','rem_ft06',
  'rem_lp03','rem_lp04','rem_lp05','rem_lp06','rem_lp07','rem_lp08',
  'rem_kp03','rem_kp04','rem_kp05','rem_kp06','rem_kp07',
  'rem_np03','rem_np04','rem_np05','rem_np06','rem_np07','rem_np08',
  'rem_sp03','rem_sp04','rem_sp05','rem_sp06','rem_sp07','rem_sp08',
  'rem_ey01','rem_ey02','rem_ey03','rem_ey04','rem_ey05','rem_ey06'
)
AND rs.symptom_id NOT IN ('cough','congestion')
ON CONFLICT (symptom_id, remedy_id) DO NOTHING;

-- =============================================================================
-- PART 8: INGREDIENTS for new remedies
-- =============================================================================
UPDATE public.remedies SET ingredients = CASE id
  WHEN 'rem_h06' THEN ARRAY['caffeine', 'l-theanine']
  WHEN 'rem_h07' THEN ARRAY[]::text[]
  WHEN 'rem_h08' THEN ARRAY['bacopa monnieri extract', 'cellulose']
  WHEN 'rem_h09' THEN ARRAY['sesame oil', 'bilva', 'agnimantha', 'shyonaka']
  WHEN 'rem_h10' THEN ARRAY['ksheerabala oil', 'brahmi oil']
  WHEN 'rem_c06' THEN ARRAY['tulsi leaves', 'honey', 'lemon']
  WHEN 'rem_c07' THEN ARRAY['ginger powder', 'black pepper', 'long pepper']
  WHEN 'rem_c08' THEN ARRAY['amla', 'herbal blend', 'honey', 'ghee']
  WHEN 'rem_c09' THEN ARRAY['water', 'eucalyptus oil']
  WHEN 'rem_c10' THEN ARRAY['sodium chloride', 'sodium bicarbonate', 'purified water']
  WHEN 'rem_a06' THEN ARRAY['shankhpushpi extract', 'honey', 'water']
  WHEN 'rem_a07' THEN ARRAY['jatamansi root powder']
  WHEN 'rem_a08' THEN ARRAY['lavender essential oil']
  WHEN 'rem_a09' THEN ARRAY[]::text[]
  WHEN 'rem_a10' THEN ARRAY[]::text[]
  WHEN 'rem_i06' THEN ARRAY['ashwagandha powder', 'milk', 'cardamom']
  WHEN 'rem_i07' THEN ARRAY['tagara root extract']
  WHEN 'rem_i08' THEN ARRAY['polyester', 'glass beads']
  WHEN 'rem_i09' THEN ARRAY[]::text[]
  WHEN 'rem_i10' THEN ARRAY[]::text[]
  WHEN 'rem_n06' THEN ARRAY['fennel seeds']
  WHEN 'rem_n07' THEN ARRAY['cumin seeds', 'cardamom pods']
  WHEN 'rem_n08' THEN ARRAY['elastic band', 'plastic button']
  WHEN 'rem_n09' THEN ARRAY[]::text[]
  WHEN 'rem_n10' THEN ARRAY['ginger', 'lemon', 'honey']
  WHEN 'rem_s06' THEN ARRAY['ksheerabala oil']
  WHEN 'rem_s07' THEN ARRAY['shankhpushpi extract']
  WHEN 'rem_s08' THEN ARRAY[]::text[]
  WHEN 'rem_s09' THEN ARRAY[]::text[]
  WHEN 'rem_s10' THEN ARRAY[]::text[]
  WHEN 'rem_bp04' THEN ARRAY['sesame oil', 'ashwagandha', 'bala', 'shatavari']
  WHEN 'rem_bp05' THEN ARRAY[]::text[]
  WHEN 'rem_bp06' THEN ARRAY[]::text[]
  WHEN 'rem_bp07' THEN ARRAY['mahanarayan oil', 'wheat flour']
  WHEN 'rem_st03' THEN ARRAY['licorice root']
  WHEN 'rem_st04' THEN ARRAY['turmeric', 'honey', 'ghee']
  WHEN 'rem_st05' THEN ARRAY['marshmallow root']
  WHEN 'rem_st06' THEN ARRAY['water', 'eucalyptus oil']
  WHEN 'rem_st07' THEN ARRAY['asian pear', 'goji berries', 'rock sugar']
  WHEN 'rem_es03' THEN ARRAY['triphala powder', 'water']
  WHEN 'rem_es04' THEN ARRAY[]::text[]
  WHEN 'rem_es05' THEN ARRAY[]::text[]
  WHEN 'rem_es06' THEN ARRAY[]::text[]
  WHEN 'rem_pc03' THEN ARRAY['dashmool root powder']
  WHEN 'rem_pc04' THEN ARRAY['ashoka bark']
  WHEN 'rem_pc05' THEN ARRAY[]::text[]
  WHEN 'rem_pc06' THEN ARRAY['mugwort']
  WHEN 'rem_fv03' THEN ARRAY['giloy stem', 'water']
  WHEN 'rem_fv04' THEN ARRAY['tulsi leaves', 'black pepper']
  WHEN 'rem_fv05' THEN ARRAY['water']
  WHEN 'rem_fv06' THEN ARRAY[]::text[]
  WHEN 'rem_sr03' THEN ARRAY['neem powder', 'turmeric powder']
  WHEN 'rem_sr04' THEN ARRAY['aloe vera gel', 'sandalwood powder']
  WHEN 'rem_sr05' THEN ARRAY['virgin coconut oil']
  WHEN 'rem_sr06' THEN ARRAY['ku shen', 'di fu zi', 'bai xian pi']
  WHEN 'rem_ep03' THEN ARRAY['sesame oil', 'garlic']
  WHEN 'rem_ep04' THEN ARRAY['tulsi leaves']
  WHEN 'rem_ep05' THEN ARRAY[]::text[]
  WHEN 'rem_ep06' THEN ARRAY[]::text[]
  WHEN 'rem_bg03' THEN ARRAY['fennel seeds', 'cumin seeds']
  WHEN 'rem_bg04' THEN ARRAY['asafoetida resin']
  WHEN 'rem_bg05' THEN ARRAY[]::text[]
  WHEN 'rem_bg06' THEN ARRAY[]::text[]
  WHEN 'rem_ho03' THEN ARRAY['amla powder', 'honey']
  WHEN 'rem_ho04' THEN ARRAY['goji berries', 'red dates', 'rock sugar']
  WHEN 'rem_ho05' THEN ARRAY[]::text[]
  WHEN 'rem_ho06' THEN ARRAY[]::text[]
  WHEN 'rem_ft03' THEN ARRAY['amla', 'herbal blend', 'honey', 'ghee']
  WHEN 'rem_ft04' THEN ARRAY['shilajit resin', 'fulvic acid']
  WHEN 'rem_ft05' THEN ARRAY[]::text[]
  WHEN 'rem_ft06' THEN ARRAY[]::text[]
  WHEN 'rem_lp03' THEN ARRAY['magnesium sulfate', 'water']
  WHEN 'rem_lp04' THEN ARRAY['sesame oil', 'herbal blend']
  WHEN 'rem_lp05' THEN ARRAY[]::text[]
  WHEN 'rem_lp06' THEN ARRAY[]::text[]
  WHEN 'rem_lp07' THEN ARRAY['turmeric', 'water']
  WHEN 'rem_lp08' THEN ARRAY[]::text[]
  WHEN 'rem_kp03' THEN ARRAY[]::text[]
  WHEN 'rem_kp04' THEN ARRAY['turmeric', 'ginger']
  WHEN 'rem_kp05' THEN ARRAY[]::text[]
  WHEN 'rem_kp06' THEN ARRAY['magnesium sulfate', 'water']
  WHEN 'rem_kp07' THEN ARRAY['sesame oil', 'herbal blend']
  WHEN 'rem_np03' THEN ARRAY[]::text[]
  WHEN 'rem_np04' THEN ARRAY['sesame oil', 'herbal blend']
  WHEN 'rem_np05' THEN ARRAY['gua sha oil']
  WHEN 'rem_np06' THEN ARRAY['turmeric', 'water']
  WHEN 'rem_np07' THEN ARRAY[]::text[]
  WHEN 'rem_np08' THEN ARRAY['sesame oil', 'coconut oil']
  WHEN 'rem_sp03' THEN ARRAY[]::text[]
  WHEN 'rem_sp04' THEN ARRAY['sesame oil']
  WHEN 'rem_sp05' THEN ARRAY[]::text[]
  WHEN 'rem_sp06' THEN ARRAY['turmeric', 'water']
  WHEN 'rem_sp07' THEN ARRAY[]::text[]
  WHEN 'rem_sp08' THEN ARRAY['sesame oil', 'herbal blend']
  WHEN 'rem_ey01' THEN ARRAY['triphala powder', 'water']
  WHEN 'rem_ey02' THEN ARRAY['chamomile tea']
  WHEN 'rem_ey03' THEN ARRAY[]::text[]
  WHEN 'rem_ey04' THEN ARRAY[]::text[]
  WHEN 'rem_ey05' THEN ARRAY['rose water']
  WHEN 'rem_ey06' THEN ARRAY[]::text[]
END
WHERE id IN (
  'rem_h06','rem_h07','rem_h08','rem_h09','rem_h10',
  'rem_c06','rem_c07','rem_c08','rem_c09','rem_c10',
  'rem_a06','rem_a07','rem_a08','rem_a09','rem_a10',
  'rem_i06','rem_i07','rem_i08','rem_i09','rem_i10',
  'rem_n06','rem_n07','rem_n08','rem_n09','rem_n10',
  'rem_s06','rem_s07','rem_s08','rem_s09','rem_s10',
  'rem_bp04','rem_bp05','rem_bp06','rem_bp07',
  'rem_st03','rem_st04','rem_st05','rem_st06','rem_st07',
  'rem_es03','rem_es04','rem_es05','rem_es06',
  'rem_pc03','rem_pc04','rem_pc05','rem_pc06',
  'rem_fv03','rem_fv04','rem_fv05','rem_fv06',
  'rem_sr03','rem_sr04','rem_sr05','rem_sr06',
  'rem_ep03','rem_ep04','rem_ep05','rem_ep06',
  'rem_bg03','rem_bg04','rem_bg05','rem_bg06',
  'rem_ho03','rem_ho04','rem_ho05','rem_ho06',
  'rem_ft03','rem_ft04','rem_ft05','rem_ft06',
  'rem_lp03','rem_lp04','rem_lp05','rem_lp06','rem_lp07','rem_lp08',
  'rem_kp03','rem_kp04','rem_kp05','rem_kp06','rem_kp07',
  'rem_np03','rem_np04','rem_np05','rem_np06','rem_np07','rem_np08',
  'rem_sp03','rem_sp04','rem_sp05','rem_sp06','rem_sp07','rem_sp08',
  'rem_ey01','rem_ey02','rem_ey03','rem_ey04','rem_ey05','rem_ey06'
);

-- =============================================================================
-- PART 9: DEPRECATE Conventional remedies � set priority_rank to 0
-- =============================================================================
UPDATE public.symptom_remedies
SET priority_rank = 0, evidence_score = 0
WHERE remedy_id IN ('rem_h04','rem_c04','rem_a04','rem_i04','rem_n04','rem_s04');

-- =============================================================================
-- PART 10: ALLERGEN TAGS for new Ayurveda remedies
-- =============================================================================
UPDATE public.remedies SET allergen_tags = ARRAY['herbal']
WHERE id IN ('rem_h08','rem_a06','rem_a07','rem_i06','rem_i07','rem_n06',
  'rem_s07','rem_bp04','rem_bp07','rem_st03','rem_es03','rem_pc03',
  'rem_pc04','rem_fv03','rem_sr03','rem_sr04','rem_ep03','rem_bg03',
  'rem_bg04','rem_ho03','rem_ft03','rem_lp04','rem_kp04','rem_np04',
  'rem_np08','rem_sp04','rem_sp08','rem_ey01','rem_ey05');

UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'pollen']
WHERE id IN ('rem_c06','rem_c08','rem_fv04','rem_ft03','rem_s10');

UPDATE public.remedies SET allergen_tags = ARRAY['herbal', 'ginger']
WHERE id IN ('rem_c07','rem_n10','rem_kp04');

UPDATE public.remedies SET allergen_tags = ARRAY['sesame', 'herbal']
WHERE id IN ('rem_h09','rem_h10','rem_bp04','rem_bp07','rem_lp04','rem_kp07','rem_np04','rem_sp08');

-- Fixes orphan references, missing symptoms, and broken alias targets


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
('rem_lp01', 'Rest, Ice, and Elevation Protocol', 'Lifestyle', 4.3, 234, 'Elevation and ice reduce swelling and improve recovery for general leg pain.', 'Ice reduces acute inflammation while elevation uses gravity to improve venous return. Together they form the standard first-line approach for most leg pain without fracture.', 'Apply ice pack to painful area 15-20 min. Elevate leg on 2-3 pillows above heart level. Rest for 24-48 hours before gradual return to activity.', 'Do not apply ice directly to skin. Suspected DVT or fracture requires medical attention. Seek care if calf is red, warm, or swollen.', ARRAY[]::text[], ARRAY['suspected_dvt', 'fracture'], 'Immediate', 'Easy', '$', false),
('rem_lp02', 'Gentle Calf & Hamstring Stretch', 'Lifestyle', 4.2, 187, 'Static stretching of posterior leg muscles to relieve tension and improve flexibility.', 'Gentle sustained stretching reduces muscle tension, improves circulation, and can alleviate mild leg soreness from prolonged standing or sitting.', 'Hold each stretch for 30s without bouncing: calf stretch against wall, seated hamstring stretch, standing quadriceps stretch. Repeat 2-3 rounds daily.', 'Stretch only to mild tension, not pain. Not for acute injuries.', ARRAY[]::text[], ARRAY['acute_muscle_tear'], '5-10 minutes', 'Easy', '$', false),
('rem_kp01', 'Rest, Ice, and Knee Protection', 'Lifestyle', 4.3, 198, 'Standard first-line protocol for acute knee pain with protection and ice.', 'Rest, ice, compression, and elevation (RICE) reduce acute knee inflammation. Protection prevents aggravating the injury.', 'Rest from painful activity. Ice 15-20 min every 2-3 hours. Use compression wrap. Elevate knee above heart. Switch to gentle motion after 48h.', 'Do not ice directly on skin. If knee locks or gives way, see a practitioner.', ARRAY[]::text[], ARRAY['knee_locking', 'fracture'], 'Immediate', 'Easy', '$', false),
('rem_kp02', 'Knee Straight Leg Raise', 'Lifestyle', 4.4, 256, 'Foundational quadriceps exercise that stabilizes the knee without joint stress.', 'Straight leg raises strengthen the quadriceps (specifically VMO) without bending the knee, making it safe for most knee pain.', 'Lie on back. Bend one knee, keep other straight. Tighten quad of straight leg. Lift 6-12 inches, hold 5s. Lower slowly. 3x15 daily.', 'Do not through sharp pain. If pain increases, stop and consult.', ARRAY[]::text[], ARRAY['acute_knee_injury'], 'Immediate', 'Easy', '$', false),
('rem_np01', 'Neck Heat Therapy', 'Lifestyle', 4.5, 312, 'Moist heat application that relaxes cervical muscles and relieves neck stiffness.', 'Heat increases blood flow to cervical muscles, reduces muscle guarding, and helps restore pain-free range of motion.', 'Apply warm moist towel or heating pad to neck for 15-20 min. Use 2-3 times daily. Gentle neck mobility after heat.', 'Avoid heat on numb areas or acute trauma. Not for cervical fracture or instability.', ARRAY[]::text[], ARRAY['cervical_fracture', 'cervical_instability'], '15-30 minutes', 'Easy', '$', false),
('rem_np02', 'Cervical Roll Support', 'Lifestyle', 4.1, 145, 'Using a cervical roll to maintain healthy neck curvature during sleep and rest.', 'A cervical roll supports the natural lordotic curve of the neck, reducing muscle strain during sleep and rest.', 'Place roll inside pillowcase at neck curve. Sleep on back or side with neutral spine. Replace every 6 months.', 'Not for acute whiplash or cervical injury.', ARRAY[]::text[], ARRAY['acute_whiplash'], '1-7 days cumulative', 'Easy', '$', false),
('rem_sp01', 'Rest and Ice for Shoulder', 'Lifestyle', 4.3, 176, 'Immediate first aid for acute shoulder pain with ice and activity modification.', 'Ice reduces acute inflammation. Rest prevents aggravating the rotator cuff or deltoid during initial pain phase.', 'Ice shoulder 15-20 min every 2-3 hours. Avoid overhead lifting and reaching behind. Sling only if needed for comfort (max 48h).', 'Do not immobilize for more than 48h without guidance. Seek care for weakness or severe pain.', ARRAY[]::text[], ARRAY['rotator_cuff_tear', 'fracture'], 'Immediate', 'Easy', '$', false),
('rem_sp02', 'Shoulder Pendulum Exercise', 'Lifestyle', 4.4, 234, 'Codman pendulum exercise that maintains shoulder mobility during recovery.', 'Gentle circumduction reduces adhesive capsulitis risk and promotes synovial fluid circulation without stressing the rotator cuff.', 'Lean forward supporting body with one hand. Let affected arm hang. Swing small circles (10 each direction). Perform 2-3x daily within pain-free range.', 'Pendulums only. Avoid any lifting or strengthening during acute phase.', ARRAY[]::text[], ARRAY['acute_rotator_cuff_tear', 'shoulder_fracture'], 'Immediate', 'Easy', '$', false)
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

-- Fixes "blocked nose → congestion → no remedies" bug


-- ==============================================================
-- 1. Add symptom_remedies for CONGESTION (skip missing remedies)
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
SELECT v.* FROM (VALUES
  ('congestion', 'rem_c09', 7, 10),
  ('congestion', 'rem_c10', 6, 9),
  ('congestion', 'rem_c06', 6, 8),
  ('congestion', 'rem_c02', 5, 8),
  ('congestion', 'rem_c04', 5, 7),
  ('congestion', 'rem_c01', 3, 5)
) v(symptom_id, remedy_id, evidence_score, priority_rank)
WHERE EXISTS (SELECT 1 FROM public.remedies WHERE id = v.remedy_id)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- ==============================================================
-- 2. Add symptom_remedies for COUGH (skip missing remedies)
-- ==============================================================
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
SELECT v.* FROM (VALUES
  ('cough', 'rem_c09', 7, 10),
  ('cough', 'rem_c05', 7, 9),
  ('cough', 'rem_c06', 6, 8),
  ('cough', 'rem_st06', 5, 7),
  ('cough', 'rem_c01', 4, 6),
  ('cough', 'rem_c02', 3, 5)
) v(symptom_id, remedy_id, evidence_score, priority_rank)
WHERE EXISTS (SELECT 1 FROM public.remedies WHERE id = v.remedy_id)
ON CONFLICT (symptom_id, remedy_id) DO UPDATE SET
  evidence_score = EXCLUDED.evidence_score,
  priority_rank = EXCLUDED.priority_rank;

-- ==============================================================
-- 3. Add remedy_symptoms entries linking congestion/cough to remedies (skip missing)
-- ==============================================================
INSERT INTO public.remedy_symptoms (remedy_id, symptom_id, match_strength)
SELECT v.* FROM (VALUES
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
) v(remedy_id, symptom_id, match_strength)
WHERE EXISTS (SELECT 1 FROM public.remedies WHERE id = v.remedy_id)
ON CONFLICT (remedy_id, symptom_id) DO UPDATE SET
  match_strength = EXCLUDED.match_strength;


COMMIT;
