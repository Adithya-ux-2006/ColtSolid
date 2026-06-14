-- Supabase Schema for ClotSolid

-- 1. Create Tables

CREATE TABLE public.symptoms (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    color_theme TEXT NOT NULL
);

CREATE TABLE public.remedies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    review_count INTEGER NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    how_to_use TEXT NOT NULL,
    warnings TEXT NOT NULL,
    time_to_effect TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    cost TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false
);

CREATE TABLE public.remedy_symptoms (
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    symptom_id TEXT REFERENCES public.symptoms(id) ON DELETE CASCADE,
    PRIMARY KEY (remedy_id, symptom_id)
);

CREATE TABLE public.research_papers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    journal TEXT NOT NULL,
    url TEXT NOT NULL,
    key_finding TEXT NOT NULL
);

-- Users profile table linking to auth.users
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    university TEXT,
    year TEXT,
    avatar TEXT
);

CREATE TABLE public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, remedy_id)
);

CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    doctor TEXT NOT NULL,
    location TEXT NOT NULL,
    apt_date DATE NOT NULL,
    apt_time TIME NOT NULL,
    notes TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) Policies

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public read access for core data
CREATE POLICY "Allow public read access to symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access to remedies" ON public.remedies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to remedy_symptoms" ON public.remedy_symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access to research_papers" ON public.research_papers FOR SELECT USING (true);

-- User Profile policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- 3. Seed Data

INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES
('headache', 'Headache', '🤕', 'forest'),
('cold', 'Cold', '🤧', 'sage'),
('anxiety', 'Anxiety', '😰', 'amber'),
('insomnia', 'Insomnia', '😴', 'forest'),
('nausea', 'Nausea', '🤢', 'sage'),
('stress', 'Stress', '😤', 'amber');

INSERT INTO public.remedies (id, name, category, rating, review_count, short_description, long_description, how_to_use, warnings, time_to_effect, difficulty, cost, is_featured) VALUES
('rem_001', 'Peppermint Oil Roll-On', 'Natural', 4.6, 312, 'Provides an immediate cooling sensation that helps relax tense muscles.', 'Peppermint oil contains menthol, which can help relax muscles and ease pain.', '1. Roll onto temples. 2. Massage gently.', 'Avoid contact with eyes.', '10–15 minutes', 'Easy', '$', true),
('rem_002', 'L-Theanine Supplement', 'Natural', 4.7, 410, 'An amino acid found in green tea that promotes relaxation.', 'Increases GABA and alpha brain waves for a state of wakeful relaxation.', 'Take 100-200mg as needed.', 'May interact with blood pressure medications.', '30–45 minutes', 'Easy', '$$', true),
('rem_003', 'Acupuncture', 'TCM', 4.3, 220, 'Insertion of thin needles to regulate the nervous system.', 'Balances heart and kidney meridians.', 'Must be performed by a professional.', 'Ensure sterile needles.', '1–2 hours', 'Requires prescription', '$$$', false),
('rem_004', 'Ibuprofen', 'Conventional', 4.8, 1045, 'A widely used NSAID for tension headaches and migraines.', 'Blocks production of inflammation-causing substances.', 'Take 200mg-400mg with water.', 'May cause stomach upset.', '20–30 minutes', 'Easy', '$$', false),
('rem_005', 'Box Breathing', 'Lifestyle', 4.9, 890, 'Simple rapid breathing technique used to down-regulate the nervous system.', 'Stimulates vagus nerve.', 'Inhale 4s, hold 4s, exhale 4s, hold 4s.', 'If dizzy, return to normal breathing.', '2–5 minutes', 'Easy', '$', true);

INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES
('rem_001', 'headache'), ('rem_001', 'nausea'),
('rem_002', 'anxiety'), ('rem_002', 'stress'),
('rem_003', 'anxiety'), ('rem_003', 'insomnia'),
('rem_004', 'headache'), ('rem_004', 'cold'),
('rem_005', 'anxiety'), ('rem_005', 'stress');

INSERT INTO public.research_papers (remedy_id, title, journal, url, key_finding) VALUES
('rem_001', 'Efficacy of peppermint oil in tension-type headache', 'Neurology Journal', 'https://pubmed.ncbi.nlm.nih.gov/', 'Significantly reduces clinical headache intensity within 15 minutes.'),
('rem_002', 'L-Theanine reduces psychological and physiological stress responses', 'Biol Psychol', 'https://pubmed.ncbi.nlm.nih.gov/', 'Reduces heart rate and salivary immunoglobulin A responses during acute stress.'),
('rem_005', 'Diaphragmatic breathing reduces physiological and psychological stress', 'Frontiers in Psychology', 'https://pubmed.ncbi.nlm.nih.gov/', 'Significantly decreases cortisol levels and increases sustained attention.');
