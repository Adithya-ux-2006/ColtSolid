import { resolveQuery } from '../src/utils/symptomEngine.js';
import { SYMPTOMS } from '../src/data/symptoms.js';
import BENCHMARK_QUERIES from '../src/data/benchmarkQueries.js';

let pass = 0, fail = 0;
const failures = [];
for (const bq of BENCHMARK_QUERIES) {
  const result = resolveQuery(bq.query, SYMPTOMS);
  const top = result.topSymptoms[0]?.label;
  const allLabels = result.topSymptoms.map(s => s.label);
  let ok = true;
  if (bq.expectedTopLabel && top !== bq.expectedTopLabel) ok = false;
  if (bq.expectedLabels && !bq.expectedLabels.some(l => allLabels.includes(l))) ok = false;
  if (bq.expectNegation && !result.hasNegation) ok = false;
  ok ? pass++ : (fail++, failures.push({ query: bq.query, got: top, all: allLabels }));
}
console.log(`PASS: ${pass}/${BENCHMARK_QUERIES.length}`);
console.log(failures);
