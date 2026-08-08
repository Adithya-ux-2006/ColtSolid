-- Migration 040: Add missing is_child_safe column to users table
-- The migration 020 added age_range but forgot is_child_safe column
-- This causes profile updates to fail with PGRST204 error

BEGIN;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_child_safe BOOLEAN DEFAULT false;

COMMIT;