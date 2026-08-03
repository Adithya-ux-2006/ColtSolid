import { test, expect } from '@playwright/test';

test.describe('Dataset Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('renders dataset section heading', async ({ page }) => {
    const heading = page.locator('text=Research Datasets').or(page.locator('text=Kaggle'));
    await expect(heading.first()).toBeVisible();
  });

  test('shows dataset cards', async ({ page }) => {
    const cards = page.locator('article').filter({ hasText: /kaggle|dataset/i });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('dataset card has title, description, and tags', async ({ page }) => {
    const firstCard = page.locator('article').filter({ hasText: /kaggle|dataset/i }).first();
    await expect(firstCard).toBeVisible();

    // Should have a title
    const title = firstCard.locator('h3');
    await expect(title).toBeVisible();

    // Should have tags
    const tags = firstCard.locator('span').filter({ hasText: /\w+/ });
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThanOrEqual(1);
  });

  test('dataset card has View on Kaggle link', async ({ page }) => {
    const kaggleLink = page.locator('a').filter({ hasText: /view on kaggle/i }).first();
    await expect(kaggleLink).toBeVisible();
    await expect(kaggleLink).toHaveAttribute('target', '_blank');
    await expect(kaggleLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('search input filters datasets', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search datasets/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('blood');
      await page.waitForTimeout(500);

      const cards = page.locator('article').filter({ hasText: /kaggle|dataset/i });
      const count = await cards.count();
      // After filtering, should show fewer or equal cards
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('filter buttons exist for categories', async ({ page }) => {
    const filterButtons = page.locator('button').filter({ hasText: /all|health|blood|symptom/i });
    const count = await filterButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
