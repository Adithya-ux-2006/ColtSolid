const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let symptoms = null;
  let symptomRemedies = null;
  page.on('response', async (response) => {
    const url = response.url();
    try {
      if (url.includes('/rest/v1/symptoms?') && !url.includes('remedy')) {
        symptoms = await response.json();
      }
      if (url.includes('/rest/v1/symptom_remedies?')) {
        symptomRemedies = await response.json();
      }
    } catch(e) {}
  });

  await page.goto('http://localhost:5173/search');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('SYMPTOMS (' + (symptoms || []).length + '):');
  for (const s of symptoms || []) {
    console.log('  [' + s.id + '] -> ' + s.label);
  }

  console.log('\nSYMPTOM_REMEDIES (' + (symptomRemedies || []).length + ' entries):');
  const srKeys = new Set((symptomRemedies || []).map(r => r.symptom_id));
  const sortedSR = Array.from(srKeys).sort();
  console.log('  Keys: ' + sortedSR.join(', '));

  await browser.close();
})().catch(e => console.error(e));
