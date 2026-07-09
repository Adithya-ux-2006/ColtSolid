import { test, expect } from '@playwright/test';

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 375, height: 812 };

test.describe('Visual Regression — Landing Page', () => {
  test('landing page matches snapshot (desktop)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('landing-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('landing page matches snapshot (mobile)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('landing-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual Regression — Results Page', () => {
  test('results page matches snapshot (desktop)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/results?symptom=headache');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    await expect(page).toHaveScreenshot('results-headache-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('results page matches snapshot (mobile)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/results?symptom=headache');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    await expect(page).toHaveScreenshot('results-headache-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual Regression — Remedy Detail Page', () => {
  test('remedy detail page matches snapshot (desktop)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    // Navigate via results to ensure catalog is loaded
    await page.goto('/results?symptom=headache');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const firstRemedyLink = page.locator('a[href^="/remedy/"]').first();
    await firstRemedyLink.waitFor({ state: 'visible', timeout: 10000 });
    const href = await firstRemedyLink.getAttribute('href');
    await page.goto(href);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('remedy-detail-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('remedy detail page matches snapshot (mobile)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/results?symptom=headache');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const firstRemedyLink = page.locator('a[href^="/remedy/"]').first();
    await firstRemedyLink.waitFor({ state: 'visible', timeout: 10000 });
    const href = await firstRemedyLink.getAttribute('href');
    await page.goto(href);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('remedy-detail-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
