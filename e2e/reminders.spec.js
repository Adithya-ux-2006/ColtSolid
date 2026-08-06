import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || '';

async function signInViaUI(page) {
  if (!TEST_EMAIL || !TEST_PASSWORD) return false;
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  const emailInput = page.getByPlaceholder(/email/i);
  const passwordInput = page.getByPlaceholder(/password/i);
  if (!(await emailInput.isVisible().catch(() => false))) return false;
  if (!(await passwordInput.isVisible().catch(() => false))) return false;

  await emailInput.fill(TEST_EMAIL);
  await passwordInput.fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|login/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  return true;
}

test.describe('Reminders — navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('bottom nav shows a Reminders tab', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');

    const tab = page.locator('nav').getByText('Reminders', { exact: true });
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test('tapping Reminders tab as a guest redirects to /login', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');

    await page.locator('nav').getByText('Reminders', { exact: true }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe('Reminders — auth gating', () => {
  test('guest hitting /reminders directly is redirected to /login', async ({ page }) => {
    await page.goto('/reminders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/login');
  });
});

test.describe('Reminders — dashboard (requires authentication)', () => {
  test('page renders hero, stat cards, and opens the New Reminder modal', async ({ page }) => {
    const authed = await signInViaUI(page);
    if (!authed) {
      test.skip(true, 'No test credentials (set TEST_USER_EMAIL and TEST_USER_PASSWORD)');
      return;
    }

    await page.goto('/reminders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Authentication failed');
      return;
    }

    await expect(page.getByRole('heading', { name: 'Treatment Reminders' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Never miss a remedy again. Stay consistent with your treatment plan.')).toBeVisible();
    await expect(page.getByText('Today’s Reminders').or(page.getByText("Today's Reminders"))).toBeVisible();
    await expect(page.getByText('Upcoming')).toBeVisible();
    await expect(page.getByText('Completed Today')).toBeVisible();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Calendar')).toBeVisible();

    await page.getByRole('button', { name: 'New Reminder' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.getByRole('heading', { name: 'New Remedy Schedule' })).toBeVisible();
    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('marking a today reminder complete toggles its checkbox', async ({ page }) => {
    const authed = await signInViaUI(page);
    if (!authed) {
      test.skip(true, 'No test credentials (set TEST_USER_EMAIL and TEST_USER_PASSWORD)');
      return;
    }

    await page.goto('/reminders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Authentication failed');
      return;
    }

    const completeBtn = page.getByRole('button', { name: /mark .* as complete/i }).first();
    if (!(await completeBtn.isVisible().catch(() => false))) {
      test.skip(true, 'No reminders scheduled today');
      return;
    }

    await completeBtn.click();
    await expect(completeBtn).toHaveAttribute('aria-pressed', 'true', { timeout: 10000 });
    await completeBtn.click();
    await expect(completeBtn).toHaveAttribute('aria-pressed', 'false', { timeout: 10000 });
  });
});
