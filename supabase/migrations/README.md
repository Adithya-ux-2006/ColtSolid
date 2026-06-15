# Supabase Migrations

Run these in order in the Supabase SQL Editor when setting up a new environment.

| File | Description |
|------|-------------|
| 001_initial_schema.sql | Core tables, RLS, triggers |
| 002_phase3a.sql | Gender, onboarding, allergens |
| 003_notify_launch.sql | Nearby launch notification flag |
| 004_product_analytics.sql | Search analytics, remedy analytics, feedback |
| 005_admin_authorization.sql | Admin access flag and analytics read protection |
| 006_profile_collection_fields.sql | Personalization profile collection fields |

New changes: always create the next numbered file and add a row to this table.
Never modify existing migration files.
