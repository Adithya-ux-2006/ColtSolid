import { test, expect } from '@playwright/test';

const QUERIES = ['blocked nose', 'my nose is blocked', 'eye pain', 'brain fog', 'leg pain'];

test.describe('Live engine trace in browser', () => {
  test('trace all 5 queries through the real engine + store', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('http://localhost:5173/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // ensure catalog loads

    // Evaluate store state
    const storeState = await page.evaluate(async () => {
      // Wait a moment for zustand to hydrate
      await new Promise(r => setTimeout(r, 1000));
      // Try to access the zustand store via React internals
      // Find the root fiber
      const root = document.getElementById('root');
      if (!root) return { error: 'no root' };
      
      // Access zustand store via __ZUSTAND_DEVTOOLS__ or inspect React fiber
      // Actually, let's inspect the window for any stores
      const keys = Object.keys(window).filter(k => k.includes('zustand') || k.includes('store') || k.includes('Store'));
      
      // Try to get data from DOM — check if the page rendered symptoms
      const bodyText = document.body?.innerText || '';
      const hasCatalog = bodyText.includes('Search') || bodyText.includes('symptom');
      
      return { keys, hasCatalog, bodyTextLength: bodyText.length };
    });
    console.log('Store access attempt:', JSON.stringify(storeState));

    // Now call resolveQuery via importing it dynamically in the browser
    for (const query of QUERIES) {
      const trace = await page.evaluate(async (q) => {
        try {
          // Vite exposes modules via import()
          const engine = await import('/src/utils/symptomEngine.js');
          const searchUtils = await import('/src/utils/symptomSearch.js');
          
          const resolution = engine.resolveQuery(q, []);
          return { query: q, resolution, error: null };
        } catch (e) {
          return { query: q, resolution: null, error: e.message };
        }
      }, query);
      console.log(`Engine trace for "${query}":`, JSON.stringify(trace));
    }

    // Check actual rendered dropdown for blocked nose
    await page.getByPlaceholder(/search/i).click();
    await page.getByPlaceholder(/search/i).fill('blocked nose');
    await page.waitForTimeout(1500);
    
    const dropdown = await page.locator('.absolute.left-0.right-0.top-full');
    const dropdownText = await dropdown.textContent().catch(() => 'no dropdown');
    console.log('DROPDOWN for blocked nose:', dropdownText);
    
    const remedyLinks = await page.locator('a[href^="/remedy/"]').count();
    console.log('Remedy link count:', remedyLinks);

    console.log('Console errors:', errors);
  });
});
