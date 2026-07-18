ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS search_count integer DEFAULT 0;
