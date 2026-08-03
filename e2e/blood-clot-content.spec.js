import { test, expect } from '@playwright/test';

test.describe('Blood Clot Warning Signs & Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Scroll to the blood clot section
    await page.locator('#symptom-warning-signs').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('renders blood clot warning signs section', async ({ page }) => {
    const section = page.locator('#symptom-warning-signs');
    await expect(section).toBeVisible();
  });

  test('shows DVT warning signs', async ({ page }) => {
    const dvtSigns = page.locator('text=Swelling in one leg');
    await expect(dvtSigns.first()).toBeVisible();
  });

  test('shows PE warning signs', async ({ page }) => {
    const peSigns = page.locator('text=Sudden difficulty breathing');
    await expect(peSigns.first()).toBeVisible();
  });

  test('renders prevention tips section', async ({ page }) => {
    const prevention = page.getByRole('region', { name: /blood clot prevention/i });
    await expect(prevention).toBeVisible();
  });

  test('prevention tips include movement advice', async ({ page }) => {
    const movement = page.locator('text=move').or(page.locator('text=walk')).or(page.locator('text=exercise'));
    await expect(movement.first()).toBeVisible();
  });

  test('shows emergency number 112', async ({ page }) => {
    const emergency = page.locator('text=112');
    await expect(emergency.first()).toBeVisible();
  });

  test('displays medical disclaimer', async ({ page }) => {
    const disclaimer = page.locator('text=not treatment for a suspected blood clot');
    await expect(disclaimer.first()).toBeVisible();
  });
});

test.describe('Risk Result Cards', () => {
  test('Landing page renders without errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify key sections are present
    await expect(page.locator('text=ClotSolid').first()).toBeVisible();
    await expect(page.locator('text=Research-backed relief')).toBeVisible();
  });
});
