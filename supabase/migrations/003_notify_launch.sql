ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS 
  notify_nearby_launch boolean DEFAULT false;
