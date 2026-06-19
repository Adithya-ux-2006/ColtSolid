---
name: playwright-superpowers
description: |
  Use when writing, running, debugging, or reasoning about end-to-end tests
  with Playwright. Trigger on requests for tests, test setup, test
  infrastructure, or browser automation. Also use when asked to add test
  coverage for a feature.
---

# Playwright Superpowers

Playwright is NOT yet installed in this project. When this skill is
triggered, start by running setup, then proceed with test generation.

## Setup

```powershell
# Install Playwright
npm install -D @playwright/test
npx playwright install chromium

# Create config if it doesn't exist
npx playwright init --yes
```

The project uses Vite + React. Playwright config should set `webServer` to
start `npm run dev` before tests.

## Conventions

- Tests live in `e2e/` directory at project root.
- File naming: `feature-name.spec.js`
- Use `test.describe` blocks for feature areas.
- Use `test.step` for multi-step flows.
- Prefer `page.getByRole`, `page.getByText`, `page.getByTestId` selectors
  over CSS or XPath.
- Add `data-testid` attributes only when semantic selectors are impossible.
- Each test should be independent (no shared state).
- Use `page.waitForURL` and `page.waitForSelector` instead of hardcoded
  timeouts.

## Common Test Patterns

### Routing test
```js
test('navigates to search page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /search/i }).click();
  await expect(page).toHaveURL(/\/search/);
});
```

### Search and verify
```js
test('finds remedies for headache', async ({ page }) => {
  await page.goto('/search');
  await page.getByPlaceholder(/search/i).fill('headache');
  await page.getByRole('button', { name: /search/i }).click();
  await expect(page.getByText(/remedies found/i)).toBeVisible();
});
```

### Allergy filter
```js
test('hides remedies with user allergen', async ({ page }) => {
  // set up guest profile with allergy
  await page.evaluate(() => {
    localStorage.setItem('clotsolid_guest_profile', JSON.stringify({
      known_allergies: ['aloe-vera']
    }));
  });
  await page.goto('/results?symptom=headache');
  // remedy containing aloe vera should not appear
  await expect(page.getByText(/aloe vera/i)).not.toBeVisible();
});
```

## Running Tests

```powershell
npx playwright test          # headless
npx playwright test --ui     # UI mode
npx playwright test --debug  # debug mode
npx playwright show-report   # view last report
```

## When debugging flaky tests

1. Check for missing `await` on navigation or actions
2. Use `page.waitForLoadState('networkidle')` after navigation
3. Try `test.use({ viewport: { width: 390, height: 844 } })` for mobile
4. Add `await page.pause()` to step through in debug mode
5. Run with `--retries 2` to see if flakiness is consistent
