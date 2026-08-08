import { test, expect } from '@playwright/test';

test.describe('Google Scholar Research Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
  });

  test('Google Scholar link appears in RemedyDetail Supporting Information section', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const supportingInfo = page.getByText('Supporting Information');
    await expect(supportingInfo).toBeVisible();

    const googleScholarLink = page.locator('a[href*="scholar.google.com"]');
    await expect(googleScholarLink).toBeVisible({ timeout: 10000 });

    const linkText = await googleScholarLink.textContent();
    expect(linkText?.toLowerCase()).toContain('google scholar');
  });

  test('Google Scholar link has correct target and rel attributes', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const googleScholarLink = page.locator('a[href*="scholar.google.com"]').first();
    await expect(googleScholarLink).toHaveAttribute('target', '_blank');
    await expect(googleScholarLink).toHaveAttribute('rel', 'noreferrer');
  });

  test('Google Scholar link opens Google Scholar search results with correct query', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const googleScholarLink = page.locator('a[href*="scholar.google.com"]').first();
    const href = await googleScholarLink.getAttribute('href');
    
    expect(href).toContain('scholar.google.com/scholar?q=');
    expect(href).toContain('Steam+Inhalation');
    expect(href).toContain('clinical+study');
  });

  test('EvidenceCard displays "Search Index" badge for Google Scholar links', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const searchIndexBadge = page.locator('span:has-text("Search Index")');
    await expect(searchIndexBadge).toBeVisible({ timeout: 10000 });
  });

  test('Google Scholar link appears for multiple remedies', async ({ page }) => {
    const remedyIds = ['rem_c09', 'rem_s05', 'rem_a02'];
    
    for (const id of remedyIds) {
      await page.goto(`/remedy/${id}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const googleScholarLink = page.locator('a[href*="scholar.google.com"]');
      await expect(googleScholarLink).toBeVisible({ timeout: 10000 });
      
      const href = await googleScholarLink.getAttribute('href');
      expect(href).toContain('scholar.google.com/scholar?q=');
      expect(href).toContain('scholar?q=');
    }
  });

  test('Google Scholar link label includes remedy name', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const googleScholarLink = page.locator('a[href*="scholar.google.com"]').first();
    const linkText = await googleScholarLink.textContent();
    
    expect(linkText?.toLowerCase()).toContain('google scholar');
    expect(linkText?.toLowerCase()).toContain('steam');
  });

  test('Google Scholar link is added alongside existing research papers', async ({ page }) => {
    await page.goto('/remedy/rem_sr04');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const scholarLink = page.locator('a[href*="scholar.google.com"]');
    
    await expect(scholarLink).toBeVisible({ timeout: 15000 });
  });

  test('EvidenceCard for Google Scholar has correct "Search Index" badge styling', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const badge = page.locator('span:has-text("Search Index")');
    await expect(badge).toBeVisible({ timeout: 10000 });
    
    const className = await badge.getAttribute('class');
    expect(className).toContain('text-primary');
  });

  test('Google Scholar link URL encodes special characters properly', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const googleScholarLink = page.locator('a[href*="scholar.google.com"]').first();
    const href = await googleScholarLink.getAttribute('href');
    
    expect(href).not.toContain(' ');
    expect(href).toMatch(/scholar\.google\.com\/scholar\?q=.+/);
  });

  test('Google Scholar link appears in Supporting Information section with other research', async ({ page }) => {
    await page.goto('/remedy/rem_c09');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const supportingInfo = page.getByText('Supporting Information');
    await expect(supportingInfo).toBeVisible();

    const scholarLink = page.locator('a[href*="scholar.google.com"]');
    await expect(scholarLink).toBeVisible({ timeout: 10000 });
  });
});