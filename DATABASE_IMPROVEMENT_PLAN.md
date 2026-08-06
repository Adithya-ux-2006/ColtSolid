# Database Improvement Plan — curA/ClotSolid

## Executive Summary

This plan addresses critical issues in the Supabase PostgreSQL database, including schema inconsistencies, missing constraints, security gaps, and lack of automation. The goal is to create a production-ready, maintainable database with proper tooling.

---

## Phase 1: Critical Fixes (Immediate)

### 1.1 Consolidate Duplicate Columns on `users`
**Issue**: `university`/`university_name` and `year`/`current_year` are redundant.

**Action**:
- Create migration `025_consolidate_user_columns.sql`
- Migrate data: copy `university` → `university_name` where `university_name` is NULL
- Migrate data: copy `year` → `current_year` where `current_year` is NULL
- Drop columns `university` and `year`
- Update `handle_new_user()` trigger to only use canonical columns
- Update frontend `authStore.js` to remove fallback logic

**Risk**: Medium — requires data migration and frontend updates

### 1.2 Add Missing Foreign Keys
**Issue**: `remedy_schedules.remedy_id` and `remedy_interactions` lack FK constraints.

**Action**:
- Create migration `026_add_missing_foreign_keys.sql`
- Add FK: `remedy_schedules.remedy_id` → `remedies(id)` ON DELETE SET NULL
- Add FK: `remedy_interactions.remedy_id` → `remedies(id)` ON DELETE CASCADE
- Add FK: `remedy_interactions.symptom_id` → `symptoms(id)` ON DELETE CASCADE

**Risk**: Low — additive change

### 1.3 Regenerate `schema.sql`
**Issue**: Canonical schema is stale, missing columns from migrations 019-024.

**Action**:
- Create script `scripts/generate-schema.js` that queries `information_schema` and outputs current schema
- Run against development database to produce updated `supabase/schema.sql`
- Include all tables, columns, constraints, indexes, RLS policies, functions, triggers

**Risk**: Low — documentation only

---

## Phase 2: Security Hardening

### 2.1 Rate Limit Analytics Inserts
**Issue**: Analytics tables allow unlimited anonymous inserts (spam/bot risk).

**Action**:
- Create migration `027_analytics_rate_limiting.sql`
- Add `session_id` column to track anonymous users
- Implement rate limiting via Supabase Edge Function middleware or database function
- Option A: Use `pg_catalog` to limit inserts per session_id per minute
- Option B: Move analytics inserts to Edge Functions with rate limiting

**Recommendation**: Option B (Edge Functions) — more flexible, easier to adjust

### 2.2 Remove Duplicate RLS Policies
**Issue**: `schema.sql` defines analytics policies twice (lines 229-257 and 274-304).

**Action**:
- Create migration `028_cleanup_rls_policies.sql`
- DROP all duplicate policies
- Recreate with unique, descriptive names
- Verify no policy gaps after cleanup

**Risk**: Low — cleanup only

### 2.3 Add Audit Logging
**Issue**: No audit trail for sensitive operations.

**Action**:
- Create migration `029_audit_logging.sql`
- Create `audit_log` table: `id`, `user_id`, `table_name`, `record_id`, `action`, `old_data`, `new_data`, `created_at`
- Create trigger function `audit_changes()` that logs INSERT/UPDATE/DELETE on sensitive tables
- Apply to: `users`, `favorites`, `remedy_schedules`, `remedy_feedback`
- RLS: only admins can read audit_log

**Risk**: Low — additive

---

## Phase 3: Schema Cleanup

### 3.1 Merge Duplicate Junction Tables
**Issue**: `remedy_symptoms` and `symptom_remedies` serve overlapping purposes.

**Current State**:
- `remedy_symptoms`: remedy→symptom with `match_strength` (primary/secondary)
- `symptom_remedies`: symptom→remedy with `evidence_score` and `priority_rank`

**Action**:
- Create migration `030_merge_junction_tables.sql`
- Add `evidence_score` and `priority_rank` columns to `remedy_symptoms`
- Migrate data from `symptom_remedies` → `remedy_symptoms`
- Drop table `symptom_remedies`
- Update all frontend stores to use `remedy_symptoms` only
- Create view `symptom_remedies_view` for backward compatibility

**Risk**: High — requires careful data migration and frontend updates

### 3.2 Standardize Timestamp Columns
**Issue**: Inconsistent timestamp column naming (`created_at` vs `timestamp` vs none).

**Action**:
- Create migration `031_standardize_timestamps.sql`
- Ensure all tables have `created_at TIMESTAMPTZ DEFAULT now()`
- Add `updated_at TIMESTAMPTZ` to tables that need it (users, favorites, appointments)
- Create trigger function `update_updated_at()` for auto-update

**Risk**: Low — additive

### 3.3 Add Missing Indexes
**Issue**: Some queries may be slow without proper indexes.

**Action**:
- Create migration `032_add_performance_indexes.sql`
- Index: `favorites.user_id` (already indexed via UNIQUE constraint)
- Index: `appointments.user_id` + `apt_date` (for user calendar queries)
- Index: `remedy_events.user_id` + `created_at` (for user activity history)
- Index: `search_events.symptom_ids` using GIN (for array search)

**Risk**: Low — additive

---

## Phase 4: Automation Pipeline

### 4.1 Database Migration Runner
**Action**:
- Create `scripts/db-migrate.js` — Node.js script that:
  - Reads migration files from `supabase/migrations/`
  - Tracks applied migrations in `schema_migrations` table
  - Applies pending migrations in order
  - Supports dry-run mode
  - Validates migration syntax before applying

### 4.2 Schema Validation Script
**Action**:
- Create `scripts/db-validate.js` — validates:
  - No orphaned foreign keys
  - All tables have RLS enabled
  - No duplicate policies
  - All columns have appropriate constraints
  - Indexes exist for common query patterns

### 4.3 Schema Diff Tool
**Action**:
- Create `scripts/db-diff.js` — compares:
  - Current database schema vs `schema.sql`
  - Identifies drift between environments
  - Generates migration to sync

### 4.4 NPM Scripts
**Action**:
- Add to `package.json`:
  ```json
  "db:migrate": "node scripts/db-migrate.js",
  "db:validate": "node scripts/db-validate.js",
  "db:diff": "node scripts/db-diff.js",
  "db:generate-schema": "node scripts/generate-schema.js"
  ```

---

## Phase 5: Data Access Layer (Future)

### 5.1 Repository Pattern
**Action**:
- Create `src/repositories/` directory
- Implement repository for each table:
  - `symptoms.js` — read-only
  - `remedies.js` — read-only
  - `users.js` — CRUD with validation
  - `favorites.js` — CRUD
  - `appointments.js` — CRUD
  - `analytics.js` — insert-only
- Each repository encapsulates Supabase queries
- Centralizes error handling and validation

### 5.2 Migration to Repositories
**Action**:
- Update Zustand stores to use repositories instead of direct Supabase calls
- Update Edge Functions to use repositories
- Remove scattered Supabase queries

---

## Implementation Order

1. **Week 1**: Phase 1 (Critical Fixes)
   - 1.1 Consolidate user columns
   - 1.2 Add missing FKs
   - 1.3 Regenerate schema.sql

2. **Week 2**: Phase 2 (Security)
   - 2.1 Rate limiting
   - 2.2 RLS cleanup
   - 2.3 Audit logging

3. **Week 3**: Phase 3 (Schema Cleanup)
   - 3.1 Merge junction tables
   - 3.2 Standardize timestamps
   - 3.3 Add indexes

4. **Week 4**: Phase 4 (Automation)
   - 4.1 Migration runner
   - 4.2 Validation script
   - 4.3 Schema diff
   - 4.4 NPM scripts

5. **Future**: Phase 5 (Data Access Layer)

---

## Success Criteria

- [ ] All duplicate columns removed
- [ ] All foreign keys in place
- [ ] `schema.sql` matches actual database state
- [ ] No duplicate RLS policies
- [ ] Analytics rate limiting implemented
- [ ] Audit log for sensitive tables
- [ ] Automated migration runner working
- [ ] Schema validation passes
- [ ] All tests pass after changes

---

## Risk Mitigation

1. **Backup before any migration** — `pg_dump` before destructive changes
2. **Test on development first** — never apply migrations directly to production
3. **Use transactions** — wrap migrations in BEGIN/COMMIT
4. **Rollback plan** — each migration should have a reverse migration script
5. **Staged rollout** — apply to staging environment first, monitor for 24h

---

## Files to Create/Modify

### New Files
- `supabase/migrations/025_consolidate_user_columns.sql`
- `supabase/migrations/026_add_missing_foreign_keys.sql`
- `supabase/migrations/027_analytics_rate_limiting.sql`
- `supabase/migrations/028_cleanup_rls_policies.sql`
- `supabase/migrations/029_audit_logging.sql`
- `supabase/migrations/030_merge_junction_tables.sql`
- `supabase/migrations/031_standardize_timestamps.sql`
- `supabase/migrations/032_add_performance_indexes.sql`
- `scripts/db-migrate.js`
- `scripts/db-validate.js`
- `scripts/db-diff.js`
- `scripts/generate-schema.js`

### Modified Files
- `supabase/schema.sql` (regenerated)
- `src/store/authStore.js` (remove fallback logic)
- `src/store/catalogStore.js` (use single junction table)
- `src/store/favoritesStore.js` (use repository pattern)
- `src/store/remedyScheduleStore.js` (add FK constraint awareness)
- `package.json` (add db scripts)

---

*Plan created: 2026-08-06*
*Last updated: 2026-08-06*
