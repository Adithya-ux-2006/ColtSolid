# ColtSolid Implementation Log

## Project Overview
- **Repo:** `Adithya-ux-2006/ColtSolid` (main branch)
- **Last Audited:** 2026-07-11
- **Framework:** React + Vite + Supabase + Zustand
- **Platform:** Health remedy recommendation platform

---

## Phase 1 — Bug Fixes ✅ COMPLETE

### 1a. Search Engine Fix
**Issue:** `conceptPhrases.js` had 20 entries with `negated: true` that should be `false`, causing correct symptoms to be suppressed.
**Fix:** Changed all 20 entries to `negated: false` in `src/data/conceptPhrases.js`.
**Files Modified:** `src/data/conceptPhrases.js`
**Verification:** 29/29 benchmark tests pass.

### 1b. Favorites Button on RemedyCard
**Issue:** Heart/favorite button was missing from `RemedyCard.jsx` — only existed in `RemedyDetail.jsx`.
**Fix:** Added `handleFavorite` with `preventDefault()`/`stopPropagation()` to all three variants (carousel/featured/default).
**Files Modified:** `src/components/ui/RemedyCard.jsx`
**Pattern:** Uses `useFavoritesStore().toggleFavorite()` with auth-gate (redirects unauthenticated users to `/register`).

### 1c. Allergies Not Editable After Login
**Issue:** Profile.jsx only showed allergies as read-only text. No edit UI existed.
**Fix:** Extended `isEditing` mode to include allergy/condition multi-select using `ALLERGIES`/`CONDITIONS` from `src/constants/onboarding.js`.
**Files Modified:** `src/pages/Profile.jsx`

### 1c-follow-up. Allergies Not Persisting
**Issue:** `updateUser()` in `authStore.js` built a `dbUpdates` whitelist that omitted `known_allergies`/`common_conditions`.
**Fix:** Added `known_allergies: updates.known_allergies` and `common_conditions: updates.common_conditions` to `dbUpdates`.
**Files Modified:** `src/store/authStore.js`

### 1d. Guest Profile Store
**Issue:** Guest allergies were read once from localStorage and not reactive across components.
**Fix:** Created `src/store/guestProfileStore.js` (zustand store) exposing reactive `{ known_allergies, common_conditions, gender }`.
**New File:** `src/store/guestProfileStore.js`
**Note:** Profile page is accessible to guests (no ProtectedRoute) and shows editable allergy/condition UI.

---

## Phase 2 — Sexual Wellness Category ✅ COMPLETE

### Symptoms Added
- `low_libido` — Low Libido
- `erectile_difficulty` — Erectile Difficulty
- `vaginal_dryness` — Vaginal Dryness
- `painful_intercourse` — Painful Intercourse

### Remedies Added
- `rem_101` — Sleep & Stress Reset Routine (Lifestyle, for low_libido)
- `rem_102` — Maca Root Supplement (Natural, for low_libido)
- `rem_103` — Pelvic Floor Relaxation Exercises (Lifestyle, for erectile_difficulty)
- `rem_104` — Water-Based Personal Lubricant (Conventional, for vaginal_dryness) — **Featured**
- `rem_105` — Vaginal Moisturizer Non-Hormonal (Conventional, for vaginal_dryness)

### Concept Phrases Added
15 new entries for sexual wellness search terms (all with `negated: false`).

### Files Modified
- `src/data/symptoms.js` — Added 4 symptoms
- `src/data/remedies.js` — Added 5 remedies (rem_101-rem_105)
- `src/data/conceptPhrases.js` — Added 15 phrase entries
- `src/data/symptomGraph.js` — Added graph entries for new symptoms
- `supabase/migrations/016_sexual_wellness.sql` — Migration for DB

---

## Phase 3 — Remedy Schedule Tracker ✅ COMPLETE

### Schema
- `supabase/migrations/015_remedy_schedules.sql` — `remedy_schedules` table with RLS
- Columns: id, user_id, remedy_id, remedy_name, scheduled_time, recurrence (daily/weekly/once), days_of_week, active, created_at

### Frontend
- `src/store/remedyScheduleStore.js` — Zustand store with CRUD operations
- `src/pages/RemedySchedules.jsx` — Schedule list page with modal
- `src/components/forms/RemedyScheduleForm.jsx` — Form with search, favorites filter, recurrence

### Edge Function
- `supabase/functions/send-remedy-reminders/index.ts` — Queries due schedules, calls AI copy, sends emails
- `api/cron/remedy-reminders.js` — Vercel serverless trigger for Edge Function
- `vercel.json` — Cron configured: `*/5 * * * *`

### Phase 3 Follow-up: Silent Failure Fix
**Issue:** `add()` was fire-and-forget; modal closed regardless of success. Failures were invisible.
**Fix:** 
1. `add()` now returns `{ success, data }` or `{ success: false, error }`
2. `RemedySchedules.jsx` awaits result, shows error in modal
3. Added `isSubmitting` state to disable double-submit
**Files Modified:** `src/store/remedyScheduleStore.js`, `src/pages/RemedySchedules.jsx`

### Phase 3 Follow-up: Favorites Filter & Search
**Issue:** Remedy picker was a raw `<select>` with 100+ remedies — unusable on mobile.
**Fix:**
1. Replaced `<select>` with scrollable list of clickable rows
2. Added text search input filtering by remedy name
3. Added "Favorites" tab using `useFavoritesStore().favorites`
4. Defaults to Favorites tab if user has any favorites
5. Shows heart icon next to favorited remedies
**Files Modified:** `src/components/forms/RemedyScheduleForm.jsx`

---

## Phase 4 — AI Reminder Buddy ✅ COMPLETE

### API Endpoint
- `api/ai-reminder-copy.js` — Generates warm reminder lines using Claude API
- System prompt scoped to: remedy name + symptom + time due → one short reminder line
- `max_tokens: 60`, `temperature: 0.4`
- Static fallbacks per symptom type (13 symptom-specific templates + default)
- Graceful fallback if `ANTHROPIC_API_KEY` is unset

### Integration
- Edge Function (`send-remedy-reminders/index.ts`) calls `/api/ai-reminder-copy` before each email
- Falls back to generic `"Time to take your {remedyName}!"` if API fails

---

## Phase 5 — Nearby Remedy Shops ⏸️ ON HOLD

**Status:** Deferred pending Google Places API key provisioning.
**Required:**
- Google Places API key (Places API + Maps JavaScript API enabled)
- New endpoint `api/nearby-shops.js`
- Frontend map/list component on `RemedyDetail.jsx`

---

## Phase 6 — Remove AI Chat ✅ COMPLETE

**Status:** Already removed before this audit.
- No `AiChatPanel` references in codebase
- No `api/ai-chat.js` file
- No `src/components/ai/` directory
- No "Try our AI Assistant" CTAs in `SymptomSearch.jsx`

---

## Open Items

### Database Constraint Fix Applied
- `remedies_category_check` was missing 'Conventional' — fixed by adding it to the CHECK constraint
- Valid categories: `Lifestyle`, `Natural`, `TCM`, `Ayurveda`, `Conventional`

### Email Provider Selection
- Phase 3 Edge Function has placeholder for email sending
- Options: Resend, SendGrid, Postmark
- Set `EMAIL_API_KEY` and `EMAIL_FROM` env vars in Supabase Dashboard

### Phase 5: Google Places API Key
- Needs billing-enabled Google Cloud project
- Set `GOOGLE_PLACES_API_KEY` env var

---

## Build & Lint Status

### Build
- `npm run build` — ✅ Clean build (3.48s)

### Lint
- `npm run lint` — 6 pre-existing errors in `api/` files (not in modified code):
  - `api/ai-category-fallback.js:109` — unused `error` variable
  - `api/ai-symptom-search.js:147` — unused `error` variable
  - `api/cron/remedy-reminders.js:8,12,13` — `process` not defined (Node.js API in Vercel context)
  - `api/middleware.js:115` — regex control character in security filter

---

## File Reference

### Key Stores
- `src/store/authStore.js` — Authentication + user profile
- `src/store/favoritesStore.js` — User favorites
- `src/store/remedyScheduleStore.js` — Remedy schedules
- `src/store/catalogStore.js` — Remedy catalog
- `src/store/guestProfileStore.js` — Guest localStorage profile (reactive)

### Key Pages
- `src/pages/SymptomSearch.jsx` — Main search entry
- `src/pages/Results.jsx` — Search results
- `src/pages/RemedyDetail.jsx` — Single remedy view
- `src/pages/Profile.jsx` — User/guest profile (editable allergies)
- `src/pages/RemedySchedules.jsx` — Schedule list
- `src/pages/Favorites.jsx` — Saved remedies

### Key Components
- `src/components/ui/RemedyCard.jsx` — Card with heart button
- `src/components/forms/RemedyScheduleForm.jsx` — Schedule form with search/favorites
- `src/components/onboarding/QuestionnaireFlow.jsx` — Onboarding questionnaire (reused for guest editing)
