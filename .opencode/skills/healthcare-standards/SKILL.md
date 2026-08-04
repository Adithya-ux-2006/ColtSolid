# Skill: Healthcare Industry Standards Compliance

Use when writing, reviewing, or modifying ANY code in this project. Remzy is a
healthcare web app. Every change must pass these gates before acceptance.

**Assumption:** This app is NOT a medical device and does NOT require FDA
clearance. It is an informational/educational tool. All language must reflect
this. If you're unsure about a claim, err on the side of MORE disclaimers.

## GATE 1: Language — Absolute Rejections

Ship NOTHING with these words/phrases:

```
proven | guaranteed | cure | treats | heals | remedy (as verb)
no side effects | completely safe | 100% effective
medical advice | diagnosis | prescription
clinically proven | peer-reviewed (unless journal is named and verifiable)
```

Replace with: "may help", "research suggests", "informational only",
"evidence indicates", "traditional use supports".

**Specific violations in current code:**
- `Landing.jsx:35` — "Research-backed relief" → "Information based on published research"
- `Landing.jsx:111` — "No pseudoscience, just proven results" → Remove entirely
- `RemedyDetail.jsx:268-270` — "Medically Reviewed" badge → Add reviewer name+credentials, or REMOVE
- `Results.jsx:90-98` — Disclaimer is `text-xs` (too small) → Minimum `text-sm`
- `Profile.jsx:338` — "for serious health concerns" → Remove "serious" qualifier

## GATE 2: Emergency Handling

Every emergency response MUST include **actionable phone numbers**:

```
CRISIS_HOTLINES = {
  US: { emergency: '911', suicide: '988', crisis: '741741' },
  India: { emergency: '112', iCall: '9152987821', vandrevala: '080-25497777' },
  UK: { emergency: '999', samaritans: '116 123' },
  EU: { emergency: '112' },
};
```

- Emergency banner: clickable `tel:` links, not just text
- `emergency.js` detection is good — but response must include numbers
- Remove the dead `EvidenceBanner` component (`Results.jsx:86-88`)

## GATE 3: Evidence Grading

Replace paper-count scoring (`RemedyDetail.jsx:109-114`) with GRADE-based tiers:

```
SYSTEMATIC_REVIEW / META_ANALYSIS → Strong (score 8-9)
RCT → Moderate (score 7)
COHORT / CASE_CONTROL → Limited (score 4-5)
CASE_SERIES → Very Low (score 2-5)
EXPERT_OPINION / TRADITIONAL_USE → Low (score 1-2)
```

Each remedy MUST store: `evidenceTier`, `studyType`, `lastReviewed`, `reviewedBy`.

## GATE 4: Child Safety (COPPA)

- Age gate: **mandatory** on first visit (currently optional in `SafetyProfilePanel`)
- Under-13: require parental consent checkbox
- `childSafe === false` remedies: **HARD BLOCK** (currently soft penalty in `relevanceRanker.js:107-163`)
- `prefer-not-to-say`: default to **most restrictive** safety mode

## GATE 5: Privacy & Legal

**These are LEGALLY REQUIRED before collecting health data:**

1. Privacy Policy page — linked in footer of every page
2. Terms of Service page — linked in footer of every page
3. Must disclose: PHI collected, storage method, third-party AI sharing, retention period
4. Account deletion button in Profile (currently missing)
5. Cookie consent banner if analytics are active

**Status:** FAQ now discloses AI processing (Google Gemini) for search accuracy.
Server-side proxy keeps API key secure. Still needs a full Privacy Policy page
(not just FAQ) that details: data collected, storage method, third-party
processing, retention period, and deletion rights.

## GATE 6: Accessibility (WCAG 2.1 AA)

- Contrast: 4.5:1 minimum for text (`text-xs text-ink-muted` patterns may fail)
- Skip-to-content link on every page
- Alt text on all images
- Keyboard navigation for all interactive elements
- Visible focus indicators
- Form inputs with associated labels
- `aria-live` for error/success messages

## GATE 7: Footer — Every Page

Every page footer MUST contain:

```
© 2026 Remzy | Privacy Policy | Terms of Service | Not Medical Advice
```

Current footer (`Landing.jsx:146-152`) has only copyright — missing all links.

## SUCCESS CRITERIA

Before any healthcare-related change is complete, verify:

1. `grep -r "proven\|guaranteed\|cure\|treats\|clinically" src/` returns ZERO matches
2. Emergency components show clickable `tel:` links with real numbers
3. Disclaimer text is `text-sm` or larger on all pages
4. Footer has Privacy Policy + Terms of Service links on every page
5. "Medically Reviewed" badge either has real reviewer data or is removed
6. Age gate blocks under-13 from collecting data without consent
7. No dead/placeholder components (`return null` without reason)
