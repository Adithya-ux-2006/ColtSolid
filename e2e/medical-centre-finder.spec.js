import { test, expect } from '@playwright/test';

test.describe('Medical Centre Finder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Scroll to the medical centres section
    await page.locator('#medical-centres').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('renders search input and locate-me button', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/enter city, area, or pin code/i);
    await expect(searchInput).toBeVisible();

    const locateBtn = page.getByRole('button', { name: /find medical centres near me/i });
    await expect(locateBtn).toBeVisible();
  });

  test('search input accepts text', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/enter city, area, or pin code/i);
    await searchInput.fill('Mumbai');
    await expect(searchInput).toHaveValue('Mumbai');
  });

  test('shows "or search manually" divider', async ({ page }) => {
    const divider = page.locator('text=or search manually');
    await expect(divider).toBeVisible();
  });

  test('manual search triggers mocked Nominatim + Overpass flow', async ({ page }) => {
    // Mock Nominatim geocoding
    await page.route('**/nominatim.openstreetmap.org/search**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { lat: '19.0760', lon: '72.8777', display_name: 'Mumbai, Maharashtra, India' },
        ]),
      });
    });

    // Mock Overpass API
    await page.route('**/overpass-api.de/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          elements: [
            {
              type: 'node',
              id: 1,
              lat: 19.08,
              lon: 72.88,
              tags: {
                name: 'Test Hospital',
                amenity: 'hospital',
                'addr:city': 'Mumbai',
              },
            },
          ],
        }),
      });
    });

    const searchInput = page.getByPlaceholder(/enter city, area, or pin code/i);
    await searchInput.fill('Mumbai');

    // Click the exact "Search" button (not the FAQ expand button)
    const searchBtn = page.getByRole('button', { name: 'Search', exact: true });
    await searchBtn.click();

    // Wait for results
    await page.waitForTimeout(3000);

    // Should show results or map or loading state
    const resultOrMap = page.locator('text=Test Hospital').or(page.locator('.leaflet-container'));
    await expect(resultOrMap.first()).toBeVisible({ timeout: 10000 });
  });

  test('locate-me button calls geolocation', async ({ page }) => {
    // Grant geolocation permission
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 19.076, longitude: 72.877 });

    // Mock Overpass API
    await page.route('**/overpass-api.de/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ elements: [] }),
      });
    });

    const locateBtn = page.getByRole('button', { name: /find medical centres near me/i });
    await locateBtn.click();

    await page.waitForTimeout(3000);

    // Should show loading or empty results state
    const loadingOrEmpty = page.locator('text=Finding medical centres').or(page.locator('text=no results')).or(page.locator('text=clinics'));
    await expect(loadingOrEmpty.first()).toBeVisible({ timeout: 10000 });
  });
});
