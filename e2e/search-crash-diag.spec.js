import { test } from '@playwright/test';

test('capture /search crash', async ({ page }) => {
  const errors = [];
  const consoleMessages = [];

  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`PAGE ERROR: ${err.message}\n${err.stack}`);
  });

  try {
    await page.goto('/search', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    errors.push(`NAVIGATION ERROR: ${e.message}`);
  }

  await page.waitForTimeout(5000);

  console.log('=== ERRORS ===');
  errors.forEach((e) => console.log(e));
  console.log('=== CONSOLE ===');
  consoleMessages.forEach((m) => console.log(m));
  console.log('=== PAGE CONTENT (first 2000 chars) ===');
  const content = await page.content();
  console.log(content.slice(0, 2000));
});
