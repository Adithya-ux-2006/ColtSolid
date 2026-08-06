-- 028: Add short display taglines to remedies
--
-- Adds a compact tagline field used by list rows (e.g. "Other Remedies") so
-- the UI can show full remedy names plus a short 4-5 word tagline instead of
-- truncating the full description.
--
ALTER TABLE public.remedies
ADD COLUMN IF NOT EXISTS tagline TEXT;

UPDATE public.remedies
SET tagline = 'Improves sleep to restore libido'
WHERE id = 'rem_101';
UPDATE public.remedies
SET tagline = 'Supports energy and natural libido'
WHERE id = 'rem_102';
UPDATE public.remedies
SET tagline = 'Eases anxiety-driven pelvic tension'
WHERE id = 'rem_103';
UPDATE public.remedies
SET tagline = 'Instant relief for dryness discomfort'
WHERE id = 'rem_104';
UPDATE public.remedies
SET tagline = 'Long-lasting moisture for vaginal dryness'
WHERE id = 'rem_105';
UPDATE public.remedies
SET tagline = 'Calm focus without heavy sedation'
WHERE id = 'rem_a01';
UPDATE public.remedies
SET tagline = 'Reduces stress and anxiety naturally'
WHERE id = 'rem_a02';
UPDATE public.remedies
SET tagline = 'Pressure point for quick calming'
WHERE id = 'rem_a03';
UPDATE public.remedies
SET tagline = 'Prescription for physical anxiety symptoms'
WHERE id = 'rem_a04';
UPDATE public.remedies
SET tagline = 'Slows your stress response fast'
WHERE id = 'rem_a05';
UPDATE public.remedies
SET tagline = 'Calms racing anxious thoughts'
WHERE id = 'rem_a06';
UPDATE public.remedies
SET tagline = 'Deep Himalayan herb for calming'
WHERE id = 'rem_a07';
UPDATE public.remedies
SET tagline = 'Instant calm from lavender scent'
WHERE id = 'rem_a08';
UPDATE public.remedies
SET tagline = 'Deeply relaxes body and mind'
WHERE id = 'rem_a09';
UPDATE public.remedies
SET tagline = 'Reduces anxiety through expressive writing'
WHERE id = 'rem_a10';
UPDATE public.remedies
SET tagline = 'Relieves bloating, gas, and tightness'
WHERE id = 'rem_bg01';
UPDATE public.remedies
SET tagline = 'Moves trapped gas and bloating'
WHERE id = 'rem_bg02';
UPDATE public.remedies
SET tagline = 'Stimulates digestion, prevents gas'
WHERE id = 'rem_bg03';
UPDATE public.remedies
SET tagline = 'Fast anti-bloating gas relief'
WHERE id = 'rem_bg04';
UPDATE public.remedies
SET tagline = 'Massage supports healthy gut movement'
WHERE id = 'rem_bg05';
UPDATE public.remedies
SET tagline = 'Identifies fermentable bloating triggers'
WHERE id = 'rem_bg06';
UPDATE public.remedies
SET tagline = 'Warmth for tight back muscles'
WHERE id = 'rem_bp01';
UPDATE public.remedies
SET tagline = 'Loosens spine and relieves stiffness'
WHERE id = 'rem_bp02';
UPDATE public.remedies
SET tagline = 'Cuts inflammation and muscle soreness'
WHERE id = 'rem_bp03';
UPDATE public.remedies
SET tagline = 'Deep-acting back pain relief massage'
WHERE id = 'rem_bp04';
UPDATE public.remedies
SET tagline = 'Suction therapy releases deep tension'
WHERE id = 'rem_bp05';
UPDATE public.remedies
SET tagline = 'Core strength prevents back pain'
WHERE id = 'rem_bp06';
UPDATE public.remedies
SET tagline = 'Held oil warmth for lower back'
WHERE id = 'rem_bp07';
UPDATE public.remedies
SET tagline = 'Helps shorten cold duration early'
WHERE id = 'rem_c01';
UPDATE public.remedies
SET tagline = 'Clears congestion without medication'
WHERE id = 'rem_c02';
UPDATE public.remedies
SET tagline = 'Scraping eases early-illness tension'
WHERE id = 'rem_c03';
UPDATE public.remedies
SET tagline = 'Decongestant for sinus pressure'
WHERE id = 'rem_c04';
UPDATE public.remedies
SET tagline = 'Soothes sore throat fast'
WHERE id = 'rem_c05';
UPDATE public.remedies
SET tagline = 'Boosts immunity and eases colds'
WHERE id = 'rem_c06';
UPDATE public.remedies
SET tagline = 'Kickstarts digestion and clears mucus'
WHERE id = 'rem_c07';
UPDATE public.remedies
SET tagline = 'Builds immunity and soothes airways'
WHERE id = 'rem_c08';
UPDATE public.remedies
SET tagline = 'Loosens congestion and soothes airways'
WHERE id = 'rem_c09';
UPDATE public.remedies
SET tagline = 'Flushes congestion and nasal irritants'
WHERE id = 'rem_c10';
UPDATE public.remedies
SET tagline = 'Warmth for earache pressure relief'
WHERE id = 'rem_ep01';
UPDATE public.remedies
SET tagline = 'Relieves earache from jaw tension'
WHERE id = 'rem_ep02';
UPDATE public.remedies
SET tagline = 'Warm oil for earache relief'
WHERE id = 'rem_ep03';
UPDATE public.remedies
SET tagline = 'Tulsi drops fight ear infection'
WHERE id = 'rem_ep04';
UPDATE public.remedies
SET tagline = 'Meridian massage eases ear pressure'
WHERE id = 'rem_ep05';
UPDATE public.remedies
SET tagline = 'Stretches relieve ear-related tension'
WHERE id = 'rem_ep06';
UPDATE public.remedies
SET tagline = 'Relieves screen eye strain fast'
WHERE id = 'rem_es01';
UPDATE public.remedies
SET tagline = 'Warmth for tired, strained eyes'
WHERE id = 'rem_es02';
UPDATE public.remedies
SET tagline = 'Soothes tired, strained eyes'
WHERE id = 'rem_es03';
UPDATE public.remedies
SET tagline = 'Warm palms relax tired eyes'
WHERE id = 'rem_es04';
UPDATE public.remedies
SET tagline = 'Prevents digital eye strain breaks'
WHERE id = 'rem_es05';
UPDATE public.remedies
SET tagline = 'Pressure points revive tired eyes'
WHERE id = 'rem_es06';
UPDATE public.remedies
SET tagline = 'Cool wash for strained, tired eyes'
WHERE id = 'rem_ey01';
UPDATE public.remedies
SET tagline = 'Chamomile warmth soothes tired eyes'
WHERE id = 'rem_ey02';
UPDATE public.remedies
SET tagline = 'Pressure points relieve eye pain'
WHERE id = 'rem_ey03';
UPDATE public.remedies
SET tagline = 'Chilled spoons ease eye puffiness'
WHERE id = 'rem_ey04';
UPDATE public.remedies
SET tagline = 'Cooling drops refresh tired eyes'
WHERE id = 'rem_ey05';
UPDATE public.remedies
SET tagline = 'Rehydrates and relaxes tired eyes'
WHERE id = 'rem_ey06';
UPDATE public.remedies
SET tagline = 'Morning light fights daytime fatigue'
WHERE id = 'rem_ft01';
UPDATE public.remedies
SET tagline = 'Quick protein for low energy'
WHERE id = 'rem_ft02';
UPDATE public.remedies
SET tagline = 'Ayurvedic jam for sustained energy'
WHERE id = 'rem_ft03';
UPDATE public.remedies
SET tagline = 'Boosts cellular energy, fights fatigue'
WHERE id = 'rem_ft04';
UPDATE public.remedies
SET tagline = 'Movement meditation builds energy'
WHERE id = 'rem_ft05';
UPDATE public.remedies
SET tagline = 'Recharges energy without night disruption'
WHERE id = 'rem_ft06';
UPDATE public.remedies
SET tagline = 'Rest and fluids for fevers'
WHERE id = 'rem_fv01';
UPDATE public.remedies
SET tagline = 'Gently cools fever discomfort'
WHERE id = 'rem_fv02';
UPDATE public.remedies
SET tagline = 'Ayurvedic immunity for fevers'
WHERE id = 'rem_fv03';
UPDATE public.remedies
SET tagline = 'Induces sweating to break fevers'
WHERE id = 'rem_fv04';
UPDATE public.remedies
SET tagline = 'Safe cooling for feverish skin'
WHERE id = 'rem_fv05';
UPDATE public.remedies
SET tagline = 'Base-of-skull massage for fevers'
WHERE id = 'rem_fv06';
UPDATE public.remedies
SET tagline = 'Cools and eases tension headaches'
WHERE id = 'rem_h01';
UPDATE public.remedies
SET tagline = 'May help prevent migraines naturally'
WHERE id = 'rem_h02';
UPDATE public.remedies
SET tagline = 'Hand pressure point for headaches'
WHERE id = 'rem_h03';
UPDATE public.remedies
SET tagline = 'Reduces pain and inflammation'
WHERE id = 'rem_h04';
UPDATE public.remedies
SET tagline = 'Eases headaches caused by dehydration'
WHERE id = 'rem_h05';
UPDATE public.remedies
SET tagline = 'Eases tension headaches with caffeine'
WHERE id = 'rem_h06';
UPDATE public.remedies
SET tagline = 'Fingertip pressure releases head tension'
WHERE id = 'rem_h07';
UPDATE public.remedies
SET tagline = 'Calms Vata to soothe headaches'
WHERE id = 'rem_h08';
UPDATE public.remedies
SET tagline = 'Clears congestion and head pressure'
WHERE id = 'rem_h09';
UPDATE public.remedies
SET tagline = 'Deep rest for stress headaches'
WHERE id = 'rem_h10';
UPDATE public.remedies
SET tagline = 'Rehydrates to ease hangover symptoms'
WHERE id = 'rem_ho01';
UPDATE public.remedies
SET tagline = 'Settles hangover nausea quickly'
WHERE id = 'rem_ho02';
UPDATE public.remedies
SET tagline = 'Vitamin-C rehydration after alcohol'
WHERE id = 'rem_ho03';
UPDATE public.remedies
SET tagline = 'Nourishing tea for alcohol recovery'
WHERE id = 'rem_ho04';
UPDATE public.remedies
SET tagline = 'Movement clears hangover faster'
WHERE id = 'rem_ho05';
UPDATE public.remedies
SET tagline = 'Rest completes alcohol recovery'
WHERE id = 'rem_ho06';
UPDATE public.remedies
SET tagline = 'Adjusts sleep cycles for insomnia'
WHERE id = 'rem_i01';
UPDATE public.remedies
SET tagline = 'Natural melatonin for better sleep'
WHERE id = 'rem_i02';
UPDATE public.remedies
SET tagline = 'Ear pressure for bedtime relaxation'
WHERE id = 'rem_i03';
UPDATE public.remedies
SET tagline = 'OTC antihistamine for sleepless nights'
WHERE id = 'rem_i04';
UPDATE public.remedies
SET tagline = 'Retrains bed for sleep only'
WHERE id = 'rem_i05';
UPDATE public.remedies
SET tagline = 'Calms Vata for restful sleep'
WHERE id = 'rem_i06';
UPDATE public.remedies
SET tagline = 'Gentle sedative without morning hangover'
WHERE id = 'rem_i07';
UPDATE public.remedies
SET tagline = 'Deep pressure for deeper sleep'
WHERE id = 'rem_i08';
UPDATE public.remedies
SET tagline = 'Optimizes your sleep environment habits'
WHERE id = 'rem_i09';
UPDATE public.remedies
SET tagline = 'Guided relaxation for falling asleep'
WHERE id = 'rem_i10';
UPDATE public.remedies
SET tagline = 'Rest and ice sore knees'
WHERE id = 'rem_kp01';
UPDATE public.remedies
SET tagline = 'Strengthens quads without joint stress'
WHERE id = 'rem_kp02';
UPDATE public.remedies
SET tagline = 'Strengthens quads to protect knees'
WHERE id = 'rem_kp03';
UPDATE public.remedies
SET tagline = 'Warm poultice for knee inflammation'
WHERE id = 'rem_kp04';
UPDATE public.remedies
SET tagline = 'Acupuncture reduces knee pain'
WHERE id = 'rem_kp05';
UPDATE public.remedies
SET tagline = 'Warm magnesium soak for knees'
WHERE id = 'rem_kp06';
UPDATE public.remedies
SET tagline = 'Eases stiff, aching knees'
WHERE id = 'rem_kp07';
UPDATE public.remedies
SET tagline = 'First aid for leg strains'
WHERE id = 'rem_lp01';
UPDATE public.remedies
SET tagline = 'Stretches tight posterior leg muscles'
WHERE id = 'rem_lp02';
UPDATE public.remedies
SET tagline = 'Magnesium soak relaxes sore legs'
WHERE id = 'rem_lp03';
UPDATE public.remedies
SET tagline = 'Soothes Vata-type leg pain'
WHERE id = 'rem_lp04';
UPDATE public.remedies
SET tagline = 'Suction eases leg muscle tension'
WHERE id = 'rem_lp05';
UPDATE public.remedies
SET tagline = 'Elevation improves leg circulation'
WHERE id = 'rem_lp06';
UPDATE public.remedies
SET tagline = 'Eases localized leg inflammation'
WHERE id = 'rem_lp07';
UPDATE public.remedies
SET tagline = 'Low-intensity walking aids recovery'
WHERE id = 'rem_lp08';
UPDATE public.remedies
SET tagline = 'Eases motion and morning nausea'
WHERE id = 'rem_n01';
UPDATE public.remedies
SET tagline = 'Settles an upset stomach gently'
WHERE id = 'rem_n02';
UPDATE public.remedies
SET tagline = 'Wrist pressure relieves nausea'
WHERE id = 'rem_n03';
UPDATE public.remedies
SET tagline = 'Prescription relief for severe nausea'
WHERE id = 'rem_n04';
UPDATE public.remedies
SET tagline = 'Fluids to calm dehydration nausea'
WHERE id = 'rem_n05';
UPDATE public.remedies
SET tagline = 'Fennel settles digestion and nausea'
WHERE id = 'rem_n06';
UPDATE public.remedies
SET tagline = 'Balances digestion to ease nausea'
WHERE id = 'rem_n07';
UPDATE public.remedies
SET tagline = 'Wristbands apply pressure for nausea'
WHERE id = 'rem_n08';
UPDATE public.remedies
SET tagline = 'Steady meals to prevent nausea'
WHERE id = 'rem_n09';
UPDATE public.remedies
SET tagline = 'Timeless anti-nausea natural tonic'
WHERE id = 'rem_n10';
UPDATE public.remedies
SET tagline = 'Stretches away neck tension and stiffness'
WHERE id = 'rem_np01';
UPDATE public.remedies
SET tagline = 'Supports healthy neck curvature'
WHERE id = 'rem_np02';
UPDATE public.remedies
SET tagline = 'Releases cervical neck tension'
WHERE id = 'rem_np03';
UPDATE public.remedies
SET tagline = 'Warm oil for neck stiffness'
WHERE id = 'rem_np04';
UPDATE public.remedies
SET tagline = 'Scraping releases deep neck tension'
WHERE id = 'rem_np05';
UPDATE public.remedies
SET tagline = 'Warm compress for neck tension'
WHERE id = 'rem_np06';
UPDATE public.remedies
SET tagline = 'Fixes forward-head posture pain'
WHERE id = 'rem_np07';
UPDATE public.remedies
SET tagline = 'Self-massage for daily neck care'
WHERE id = 'rem_np08';
UPDATE public.remedies
SET tagline = 'Warmth for menstrual cramp relief'
WHERE id = 'rem_pc01';
UPDATE public.remedies
SET tagline = 'Eases period cramps and nausea'
WHERE id = 'rem_pc02';
UPDATE public.remedies
SET tagline = 'Traditional formula for menstrual health'
WHERE id = 'rem_pc03';
UPDATE public.remedies
SET tagline = 'Ayurvedic tonic for menstrual health'
WHERE id = 'rem_pc04';
UPDATE public.remedies
SET tagline = 'Yoga relaxes pelvic floor cramps'
WHERE id = 'rem_pc05';
UPDATE public.remedies
SET tagline = 'Mugwort heat warms the uterus'
WHERE id = 'rem_pc06';
UPDATE public.remedies
SET tagline = 'Fights fatigue and stress naturally'
WHERE id = 'rem_s01';
UPDATE public.remedies
SET tagline = 'Calms nerves for evening wind-down'
WHERE id = 'rem_s02';
UPDATE public.remedies
SET tagline = 'Slow movement for calm and balance'
WHERE id = 'rem_s03';
UPDATE public.remedies
SET tagline = 'Prescription for anxiety-related insomnia'
WHERE id = 'rem_s04';
UPDATE public.remedies
SET tagline = 'Breaks stress spirals with movement'
WHERE id = 'rem_s05';
UPDATE public.remedies
SET tagline = 'Deep relaxation for chronic stress'
WHERE id = 'rem_s06';
UPDATE public.remedies
SET tagline = 'Reduces stress without sedating'
WHERE id = 'rem_s07';
UPDATE public.remedies
SET tagline = 'Lowers cortisol through deep relaxation'
WHERE id = 'rem_s08';
UPDATE public.remedies
SET tagline = 'Processes stress through writing'
WHERE id = 'rem_s09';
UPDATE public.remedies
SET tagline = 'Nature lowers stress within minutes'
WHERE id = 'rem_s10';
UPDATE public.remedies
SET tagline = 'Ice and gentle shoulder movement'
WHERE id = 'rem_sp01';
UPDATE public.remedies
SET tagline = 'Gentle pendulum maintains shoulder mobility'
WHERE id = 'rem_sp02';
UPDATE public.remedies
SET tagline = 'Opens chest, eases shoulder pain'
WHERE id = 'rem_sp03';
UPDATE public.remedies
SET tagline = 'Self-massage for shoulder Vata relief'
WHERE id = 'rem_sp04';
UPDATE public.remedies
SET tagline = 'Suction releases frozen shoulder tension'
WHERE id = 'rem_sp05';
UPDATE public.remedies
SET tagline = 'Warm compress for shoulder tendonitis'
WHERE id = 'rem_sp06';
UPDATE public.remedies
SET tagline = 'Gentle movement for shoulder mobility'
WHERE id = 'rem_sp07';
UPDATE public.remedies
SET tagline = 'Deep oil therapy for stiff shoulders'
WHERE id = 'rem_sp08';
UPDATE public.remedies
SET tagline = 'Calms itchy rashes naturally'
WHERE id = 'rem_sr01';
UPDATE public.remedies
SET tagline = 'Cools itching and skin irritation'
WHERE id = 'rem_sr02';
UPDATE public.remedies
SET tagline = 'Antimicrobial paste for skin eruptions'
WHERE id = 'rem_sr03';
UPDATE public.remedies
SET tagline = 'Cooling gel soothes inflamed skin'
WHERE id = 'rem_sr04';
UPDATE public.remedies
SET tagline = 'Gentle moisture for skin barrier'
WHERE id = 'rem_sr05';
UPDATE public.remedies
SET tagline = 'Cools heat-type skin rashes'
WHERE id = 'rem_sr06';
UPDATE public.remedies
SET tagline = 'Relieves throat irritation quickly'
WHERE id = 'rem_st01';
UPDATE public.remedies
SET tagline = 'Soothes sore throats and coughs'
WHERE id = 'rem_st02';
UPDATE public.remedies
SET tagline = 'Coats and calms throat irritation'
WHERE id = 'rem_st03';
UPDATE public.remedies
SET tagline = 'Ayurvedic paste soothes throat pain'
WHERE id = 'rem_st04';
UPDATE public.remedies
SET tagline = 'Protects irritated throat tissues'
WHERE id = 'rem_st05';
UPDATE public.remedies
SET tagline = 'Eucalyptus steam for throat relief'
WHERE id = 'rem_st06';
UPDATE public.remedies
SET tagline = 'Nourishing soup soothes dry throat'
WHERE id = 'rem_st07';
