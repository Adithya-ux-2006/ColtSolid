import { test, expect } from '@playwright/test';
import BENCHMARK_QUERIES from '../src/data/benchmarkQueries';

test.describe('NLU Preprocessor Benchmark Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/search');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  const results = { passed: 0, failed: 0, details: [] };

  test.afterAll(() => {
    console.log('='.repeat(60));
    console.log('NLU BENCHMARK RESULTS');
    console.log(`Passed: ${results.passed} / ${results.passed + results.failed}`);
    console.log(`Failed: ${results.failed}`);
    console.log('='.repeat(60));
    for (const d of results.details) {
      const icon = d.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} "${d.query}" → expected ${JSON.stringify(d.expected)} got ${JSON.stringify(d.actual)}`);
    }
  });

  for (const bq of BENCHMARK_QUERIES) {
    test(`benchmark: "${bq.query}"`, async ({ page }) => {
      const engine = await page.evaluate(async (query) => {
        const mod = await import('/src/utils/symptomEngine.js');
        const symMod = await import('/src/data/symptoms.js');
        const result = await mod.resolveQuery(query, symMod.SYMPTOMS);
        return {
          topSymptoms: (result.topSymptoms || []).slice(0, 3).map(s => ({ label: s.label, score: s.score })),
          primaryCount: (result.topSymptoms || []).filter(s => (s.score || 0) > 0.2).length,
          hasNegation: result.hasNegation,
          matchedPhrases: result.matchedPhrases,
          queryContext: result.queryContext,
        };
      }, bq.query);

      const actualLabels = engine.topSymptoms.map(s => s.label);
      const actualPrimaryCount = engine.topSymptoms.filter(s => (s.score || 0) > 0.2).length;
      const expectedSymptoms = bq.expectedSymptoms || [];

      const hasExpected = expectedSymptoms.length === 0
        ? true
        : expectedSymptoms.some(es => actualLabels.includes(es));

      const record = {
        query: bq.query,
        status: 'PASS',
        expected: { symptoms: expectedSymptoms, primaryCount: bq.expectedPrimaryCount },
        actual: { labels: actualLabels, primaryCount: actualPrimaryCount },
      };

      try {
        expect(hasExpected).toBe(true);
        if (bq.expectedPrimaryCount !== undefined) {
          expect(actualPrimaryCount).toBe(bq.expectedPrimaryCount);
        }
        results.passed++;
      } catch (e) {
        record.status = 'FAIL';
        record.error = e.message;
        results.failed++;
      }

      results.details.push(record);
      console.log(`  "${bq.query}" → top: ${actualLabels.join(', ')} (primary: ${actualPrimaryCount})`);
    });
  }
});
