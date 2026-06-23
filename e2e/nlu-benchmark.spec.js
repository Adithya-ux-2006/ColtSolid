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
    console.log('');
    console.log('='.repeat(60));
    console.log('NLU BENCHMARK RESULTS');
    console.log(`Passed: ${results.passed} / ${results.passed + results.failed}`);
    console.log(`Failed: ${results.failed}`);
    console.log('='.repeat(60));
    for (const d of results.details) {
      const icon = d.status === 'PASS' ? 'PASS' : 'FAIL';
      const color = d.status === 'PASS' ? '✅' : '❌';
      console.log(`${color} ${icon} "${d.query}"`);
      console.log(`   Expected: ${JSON.stringify(d.expected)}`);
      console.log(`   Got:      top=${JSON.stringify(d.actual.topLabels)} neg=${d.actual.hasNegation}`);
      if (d.error) console.log(`   Error: ${d.error}`);
    }
    console.log('='.repeat(60));
  });

  for (const bq of BENCHMARK_QUERIES) {
    test(`benchmark: "${bq.query}"`, async ({ page }) => {
      const engine = await page.evaluate(async (query) => {
        const mod = await import('/src/utils/symptomEngine.js');
        const symMod = await import('/src/data/symptoms.js');
        const result = await mod.resolveQuery(query, symMod.SYMPTOMS);
        return {
          topLabels: (result.topSymptoms || []).slice(0, 5).map(s => s.label),

          hasNegation: result.hasNegation,
          matchedPhrases: result.matchedPhrases,
          queryContext: result.queryContext,
        };
      }, bq.query);

      const actualLabels = engine.topLabels;

      const record = {
        query: bq.query,
        status: 'PASS',
        expected: { topLabel: bq.expectedTopLabel, labels: bq.expectedLabels, empty: bq.expectEmpty },
        actual: { topLabels: actualLabels, hasNegation: engine.hasNegation },
      };

      try {
        if (bq.expectEmpty) {
          expect(actualLabels.length).toBe(0);
        } else if (bq.expectedTopLabel) {
          expect(actualLabels[0]).toBe(bq.expectedTopLabel);
          if (bq.expectedLabels) {
            for (const el of bq.expectedLabels) {
              expect(actualLabels).toContain(el);
            }
          }
        } else if (bq.expectedLabels) {
          const found = bq.expectedLabels.some(el => actualLabels.includes(el));
          expect(found).toBe(true);
        }

        if (bq.expectNegation !== undefined) {
          expect(engine.hasNegation).toBe(bq.expectNegation);
        }

        results.passed++;
      } catch (e) {
        record.status = 'FAIL';
        record.error = e.message;
        results.failed++;
      }

      results.details.push(record);
    });
  }
});
