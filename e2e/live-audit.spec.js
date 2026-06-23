import { test, expect } from '@playwright/test';

test.describe('Live Production Audit - Symptom to Remedy Pipeline', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('catalog state is loaded', async ({ page }) => {
    const state = await page.evaluate(() => {
      const store = window.__ZUSTAND_STORE__;
      if (!store) return { error: 'No zustand store found' };
      const s = store.getState();
      return {
        symptomsCount: s.symptoms?.length,
        remediesCount: s.remedies?.length,
        symptomRemediesKeys: Object.keys(s.symptomRemedies || {}),
        srCount: Object.keys(s.symptomRemedies || {}).length,
        hasLoaded: s.hasLoaded,
      };
    });
    console.log('Zustand store state:', JSON.stringify(state, null, 2));
    expect(state.symptomsCount).toBeGreaterThan(0);
    expect(state.remediesCount).toBeGreaterThan(0);
  });

  const QUERIES = [
    { q: 'blocked nose',  expectedSymptom: 'Congestion' },
    { q: 'my nose is blocked', expectedSymptom: 'Congestion' },
    { q: 'eye pain',      expectedSymptom: 'Eye Pain' },
    { q: 'brain fog',     expectedSymptom: 'Brain Fog' },
    { q: 'leg pain',      expectedSymptom: 'Leg Pain' },
  ];

  for (const { q, expectedSymptom } of QUERIES) {
    test(`"${q}" shows remedies`, async ({ page }) => {
      const preState = await page.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const s = store?.getState();
        return { srKeys: Object.keys(s?.symptomRemedies || {}) };
      });
      console.log(`Pre-search state for "${q}": keys=${preState.srKeys.join(',')}`);

      await page.getByPlaceholder(/search/i).fill(q);
      await page.waitForTimeout(1200);

      const remedyLinks = await page.locator('a[href^="/remedy/"]').all();
      console.log(`"${q}" dropdown: ${remedyLinks.length} remedy links`);

      const dropdownNoRemedies = await page.getByText(/no remedies found for this symptom/i).isVisible().catch(() => false);

      if (dropdownNoRemedies) {
        console.log(`❌ "${q}" dropdown shows 'No remedies found for this symptom'`);
      } else if (remedyLinks.length > 0) {
        const names = await Promise.all(remedyLinks.map(l => l.textContent()));
        console.log(`✅ "${q}" remedies: ${names.join(', ')}`);
      } else {
        console.log(`⚠️  "${q}" dropdown: no remedy links but also no 'not found' text`);
        const allText = await page.locator('.absolute.left-0.right-0.top-full').textContent().catch(() => 'NO DROPDOWN');
        console.log('  text:', allText);
      }

      await page.goto(`http://localhost:5173/results?q=${encodeURIComponent(q)}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);

      const resultsHeading = await page.getByRole('heading').first().textContent().catch(() => 'N/A');
      console.log(`Results heading: "${resultsHeading}"`);

      const bestMatch = await page.getByText('Best Match').isVisible().catch(() => false);
      const noResultsTitle = await page.getByText('No remedies found').isVisible().catch(() => false);
      const remedyCards = await page.locator('[class*="rounded-2xl"]').count();

      if (bestMatch) {
        const featuredName = await page.locator('[class*="rounded-2xl"]').first().textContent().catch(() => '');
        console.log(`✅ "${q}" Results: Best Match visible, ${remedyCards} cards, featured: "${featuredName?.substring(0,80)}"`);
      } else if (noResultsTitle) {
        const desc = await page.getByRole('heading').nth(1).textContent().catch(() => 'N/A');
        console.log(`❌ "${q}" Results: No remedies found (${desc})`);
      } else {
        console.log(`⚠️  "${q}" Results: neither Best Match nor No remedies found, cards: ${remedyCards}`);
      }

      expect(bestMatch || remedyCards > 0).toBe(true);
    });
  }
});
