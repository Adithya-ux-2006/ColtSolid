-- Supabase Schema for ClotSolid

-- 1. Create Tables

CREATE TABLE IF NOT EXISTS public.symptoms (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    color_theme TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.remedies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    review_count INTEGER NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    how_to_use TEXT NOT NULL,
    warnings TEXT NOT NULL,
    allergen_tags TEXT[] DEFAULT '{}' NOT NULL,
    contraindications TEXT[] DEFAULT '{}' NOT NULL,
    time_to_effect TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    cost TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.remedy_symptoms (
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    symptom_id TEXT REFERENCES public.symptoms(id) ON DELETE CASCADE,
    PRIMARY KEY (remedy_id, symptom_id)
);

CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    journal TEXT NOT NULL,
    url TEXT NOT NULL,
    key_findings TEXT NOT NULL,
    published_year INTEGER
);

CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    university TEXT,
    year TEXT,
    gender TEXT,
    common_conditions TEXT[] DEFAULT '{}' NOT NULL,
    known_allergies TEXT[] DEFAULT '{}' NOT NULL,
    treatment_prefs TEXT[] DEFAULT '{}' NOT NULL,
    has_completed_onboarding BOOLEAN DEFAULT false,
    notify_nearby_launch BOOLEAN DEFAULT false,
    prefer_natural BOOLEAN DEFAULT false NOT NULL,
    avoid_medication BOOLEAN DEFAULT false NOT NULL,
    vegetarian_remedies BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    remedy_id TEXT REFERENCES public.remedies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, remedy_id)
);

CREATE TABLE IF NOT EXISTS public.appointments (
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
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public read access for core data
DROP POLICY IF EXISTS "Allow public read access to symptoms" ON public.symptoms;
DROP POLICY IF EXISTS "Allow public read access to remedies" ON public.remedies;
DROP POLICY IF EXISTS "Allow public read access to remedy_symptoms" ON public.remedy_symptoms;
DROP POLICY IF EXISTS "Allow public read access to research_papers" ON public.research_papers;
CREATE POLICY "Allow public read access to symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access to remedies" ON public.remedies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to remedy_symptoms" ON public.remedy_symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access to research_papers" ON public.research_papers FOR SELECT USING (true);

-- User profile policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, university, year, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Student'),
    NEW.raw_user_meta_data ->> 'university',
    NEW.raw_user_meta_data ->> 'year',
    COALESCE(NEW.raw_user_meta_data ->> 'gender', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    university = EXCLUDED.university,
    year = EXCLUDED.year,
    gender = EXCLUDED.gender;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Favorites policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Appointments policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- Seed catalog data separately with supabase/seed.sql.
