import { test, expect } from '@playwright/test';

test.describe('Search Flow — Symptom to Remedy Detail', () => {

  test('full search flow: type symptom → dropdown → results → remedy detail', async ({ page }) => {
    // 1. Navigate to search page
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 2. Type a symptom into the search bar
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('headache');

    // 3. Wait for dropdown to appear with results
    await page.waitForTimeout(1200);
    const dropdown = page.locator('.absolute.left-0.right-0.top-full');
    await expect(dropdown).toBeVisible();

    // 4. Verify dropdown shows remedy links
    const remedyLinks = dropdown.locator('a[href^="/remedy/"]');
    await expect(remedyLinks.first()).toBeVisible({ timeout: 5000 });
    const linkCount = await remedyLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // 5. Click "See all results" to navigate to results page
    const seeAllBtn = page.getByRole('button', { name: /see all/i });
    await expect(seeAllBtn).toBeVisible();
    await seeAllBtn.click();

    // 6. Verify results page loads with the correct heading
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/results\?symptom=headache/);
    await expect(page.getByRole('heading').first()).toContainText('Headache');

    // 7. Verify "Recommended for you" section is visible
    const recommendedForYou = page.getByText('Recommended for you');
    await expect(recommendedForYou).toBeVisible();

    // 8. Click on a remedy card to navigate to detail page
    const firstRemedyLink = page.locator('a[href^="/remedy/"]').first();
    await expect(firstRemedyLink).toBeVisible({ timeout: 5000 });
    // Get remedy name from the h3 in the card (not inside the link)
    const remedyCard = firstRemedyLink.locator('xpath=ancestor::div[contains(@class, "rounded-3xl")]').first();
    const remedyName = await remedyCard.locator('h3').textContent();
    await firstRemedyLink.click();

    // 9. Verify remedy detail page loads
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/remedy\//);
    await expect(page.locator('h1')).toContainText(remedyName);

    // 10. Verify back button exists and has correct fallback
    const backBtn = page.getByRole('button', { name: /back/i });
    await expect(backBtn).toBeVisible();
  });

  test('popular symptom card navigates to results', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');

    // Wait for the popular symptoms section to render (catalog loads async)
    await expect(page.getByText('Common Searches')).toBeVisible({ timeout: 15000 });

    // Click the first symptom card in the grid — find any button with an emoji inside
    const firstCard = page.locator('.grid button').first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });
    await firstCard.click();

    // Verify navigation to results page with a symptom query
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/results\?symptom=/);
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('Enter key navigates to results page', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('anxiety');
    await searchInput.press('Enter');

    // Verify navigation to results page
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/results\?q=anxiety/);
    await expect(page.getByRole('heading').first()).toContainText('Anxious');
  });

  test('back button on results page returns to search', async ({ page }) => {
    await page.goto('/results?symptom=headache');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const backBtn = page.getByRole('button', { name: /back to search/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/search/);
  });
});
