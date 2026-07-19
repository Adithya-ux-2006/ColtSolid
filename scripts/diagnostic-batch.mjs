/**
 * Diagnostic batch test — gather evidence for what's actually failing.
 *
 * Three sections:
 *   1. Gemini endpoint health check (direct HTTP call)
 *   2. Deterministic engine only (offline, no network)
 *   3. Full pipeline with simulated Gemini override
 *
 * Usage:  node scripts/diagnostic-batch.mjs
 */

import { resolveQuery } from '../src/utils/symptomEngine.js';
import { SYMPTOMS } from '../src/data/symptoms.js';
import { REMEDIES } from '../src/data/remedies.js';
import { rankRemedies, classifyRelationship, REMEDY_TIER } from '../src/engine/relevanceRanker.js';
import { getPhraseMap, getConceptSymptoms } from '../src/data/conceptPhrases.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const GEMINI_URL = 'http://localhost:8888/.netlify/functions/gemini-nlu';
const PROD_GEMINI_URL = 'https://curaapp.netlify.app/.netlify/functions/gemini-nlu';

import { readFileSync } from 'fs';

function loadApiKey() {
  try {
    const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    const match = env.match(/GOOGLE_AI_STUDIO_API_KEY=(.+)/);
    if (match) return match[1].trim();
  } catch {}
  return process.env.GOOGLE_AI_STUDIO_API_KEY || '';
}

function symptomLabel(id) {
  return SYMPTOMS.find(s => s.id === id)?.label || id;
}

function topRemedyForSymptom(symptomId, symptomRemediesMap) {
  // Build a minimal symptomRemedies map from the remedy data itself
  const direct = REMEDIES.filter(r =>
    r.primarySymptoms?.includes(symptomId)
  ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return direct[0] || null;
}

// ── Section 1: Gemini health check ───────────────────────────────────────────

async function testGeminiEndpoint(baseUrl, label) {
  const apiKey = loadApiKey();
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  SECTION 1: Gemini endpoint health check (${label})`);
  console.log(`${'='.repeat(70)}`);
  console.log(`  API key present: ${apiKey ? `yes (${apiKey.length} chars)` : 'NO'}`);

  if (!apiKey) {
    console.log('  ⚠  No API key found — Gemini will return source: "unavailable"');
    console.log('  This is EXPECTED if key is not in .env or environment.');
    return;
  }

  const testQueries = [
    'headache',
    'stomach pain after eating',
    'my head is killing me',
    "can't stop throwing up",
  ];

  for (const query of testQueries) {
    try {
      const body = JSON.stringify({
        query,
        symptoms: SYMPTOMS.map(s => ({ id: s.id, label: s.label })),
      });

      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();
      const source = data.source || 'unknown';
      const interp = data.interpretation;

      console.log(`\n  Query: "${query}"`);
      console.log(`    source: ${source}`);
      if (data.reason) console.log(`    reason: ${data.reason}`);
      if (interp) {
        console.log(`    primarySymptoms: ${JSON.stringify(interp.primarySymptoms)}`);
        console.log(`    secondarySymptoms: ${JSON.stringify(interp.secondarySymptoms)}`);
        console.log(`    confidence: ${interp.confidence}`);
      }
    } catch (err) {
      console.log(`\n  Query: "${query}"`);
      console.log(`    ERROR: ${err.message}`);
    }
  }
}

// ── Section 2: Deterministic engine only ─────────────────────────────────────

function runDeterministicTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log('  SECTION 2: Deterministic engine only (offline)');
  console.log(`${'='.repeat(70)}`);

  // Build a minimal symptomRemedies map from remedy primarySymptoms/secondarySymptoms
  const symptomRemediesMap = {};
  for (const remedy of REMEDIES) {
    for (const sid of (remedy.primarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({
        remedyId: remedy.id,
        evidenceScore: 8,
        priorityRank: 5,
      });
    }
    for (const sid of (remedy.secondarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({
        remedyId: remedy.id,
        evidenceScore: 4,
        priorityRank: 3,
      });
    }
  }

  const testCases = [
    // Exact symptom names
    { query: 'headache', expectedPrimary: 'headache', category: 'exact' },
    { query: 'back pain', expectedPrimary: 'back_pain', category: 'exact' },
    // Known-good phrases (in conceptPhrases.js)
    { query: 'stomach pain', expectedPrimary: 'stomach_ache', category: 'phrase' },
    { query: 'dry cough', expectedPrimary: 'cough', category: 'phrase' },
    // Casual/colloquial
    { query: 'my head is killing me', expectedPrimary: 'headache', category: 'casual' },
    { query: "can't stop throwing up", expectedPrimary: 'nausea', category: 'casual' },
    { query: 'skin is itchy all over', expectedPrimary: 'skin_rash', category: 'casual' },
    // Multi-symptom
    { query: 'headache and nausea', expectedPrimary: 'headache', expectedSecondary: 'nausea', category: 'multi' },
    { query: "back pain that's making me anxious", expectedPrimary: 'back_pain', category: 'multi' },
    // Recently-added content
    { query: 'pink eye', expectedPrimary: 'eye_pain', category: 'recent' },
    { query: 'low sex drive', expectedPrimary: 'low_libido', category: 'recent' },
    // Edge cases from benchmark
    { query: 'my stomach hurts', expectedPrimary: 'stomach_ache', category: 'phrase' },
    { query: "i'm throwing up everything", expectedPrimary: 'nausea', category: 'phrase' },
    { query: 'tight chest', expectedPrimary: 'anxiety', category: 'phrase' },
    { query: 'burning chest', expectedPrimary: 'heartburn', category: 'phrase' },
    { query: 'dehydrated', expectedPrimary: 'dehydration', category: 'phrase' },
    { query: 'constipated', expectedPrimary: 'constipation', category: 'phrase' },
    { query: 'migraine', expectedPrimary: 'migraine', category: 'exact' },
    { query: 'earache', expectedPrimary: 'ear_pain', category: 'phrase' },
    { query: 'sinus pain', expectedPrimary: 'sinus_pressure', category: 'phrase' },
  ];

  console.log(`\n  Running ${testCases.length} queries through deterministic engine...\n`);

  let pass = 0, fail = 0;
  const failures = [];

  // Header
  console.log('  ' + '-'.repeat(100));
  console.log(`  ${'Query'.padEnd(38)} ${'Expected'.padEnd(18)} ${'Got (top)'.padEnd(18)} ${'All Top IDs'.padEnd(28)} Result`);
  console.log('  ' + '-'.repeat(100));

  for (const tc of testCases) {
    const result = resolveQuery(tc.query, SYMPTOMS);
    const topId = result.symptomIds[0] || '(none)';
    const allTopIds = result.symptomIds.slice(0, 5).join(', ');
    const topLabel = symptomLabel(topId);

    const ok = topId === tc.expectedPrimary;
    ok ? pass++ : fail++;

    if (!ok) {
      failures.push({ query: tc.query, expected: tc.expectedPrimary, got: topId, all: allTopIds });
    }

    const mark = ok ? '✓' : '✗';
    console.log(`  ${mark} ${tc.query.padEnd(36)} ${tc.expectedPrimary.padEnd(18)} ${topId.padEnd(18)} ${allTopIds.padEnd(28)} conf=${result.confidence}`);
  }

  console.log('  ' + '-'.repeat(100));
  console.log(`\n  PASS: ${pass}/${testCases.length}   FAIL: ${fail}/${testCases.length}`);

  if (failures.length > 0) {
    console.log('\n  FAILURES:');
    for (const f of failures) {
      console.log(`    "${f.query}" → expected ${f.expected}, got ${f.got} (all: ${f.all})`);
    }
  }

  return { pass, fail, failures, testCases, symptomRemediesMap };
}

// ── Section 3: Remedy ranking per symptom (card click simulation) ────────────

function runRemedyRankingTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log('  SECTION 3: Direct symptom card clicks (bypass search)');
  console.log(`${'='.repeat(70)}`);

  // Build same symptomRemedies map
  const symptomRemediesMap = {};
  for (const remedy of REMEDIES) {
    for (const sid of (remedy.primarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({ remedyId: remedy.id, evidenceScore: 8, priorityRank: 5 });
    }
    for (const sid of (remedy.secondarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({ remedyId: remedy.id, evidenceScore: 4, priorityRank: 3 });
    }
  }

  const testSymptoms = [
    'headache', 'back_pain', 'nausea', 'cough', 'insomnia',
    'sore_throat', 'anxiety', 'low_libido', 'eye_pain',
  ];

  console.log(`\n  Testing ${testSymptoms.length} symptom card clicks...\n`);

  for (const sid of testSymptoms) {
    const s = SYMPTOMS.find(x => x.id === sid);
    const concerns = [{ id: sid, label: s.label, emoji: s.emoji, color: s.color, isPrimary: true }];

    const ranked = rankRemedies(REMEDIES, concerns, symptomRemediesMap, { symptoms: SYMPTOMS });
    const top3 = ranked.slice(0, 3);

    console.log(`  Symptom: ${s.label} (${sid})`);
    if (top3.length === 0) {
      console.log('    ⚠  NO remedies returned');
    } else {
      for (let i = 0; i < top3.length; i++) {
        const r = top3[i];
        const tier = r._tier === REMEDY_TIER.DIRECT ? 'DIRECT' : r._tier === REMEDY_TIER.ASSOCIATED ? 'ASSOCIATED' : 'SUPPORTIVE';
        const isDirectlyForSymptom = r.primarySymptoms?.includes(sid);
        console.log(`    ${i+1}. ${r.name} [${tier}] score=${r._relevanceScore} directFor=${isDirectlyForSymptom}`);
      }
    }
    console.log('');
  }
}

// ── Section 4: Gemini-enhanced resolution test ───────────────────────────────

function runGeminiEnhancedTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log('  SECTION 4: Full pipeline with simulated Gemini interpretations');
  console.log(`${'='.repeat(70)}`);

  const symptomRemediesMap = {};
  for (const remedy of REMEDIES) {
    for (const sid of (remedy.primarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({ remedyId: remedy.id, evidenceScore: 8, priorityRank: 5 });
    }
    for (const sid of (remedy.secondarySymptoms || [])) {
      if (!symptomRemediesMap[sid]) symptomRemediesMap[sid] = [];
      symptomRemediesMap[sid].push({ remedyId: remedy.id, evidenceScore: 4, priorityRank: 3 });
    }
  }

  // Simulate what Gemini would return for each query
  const testCases = [
    {
      query: 'my head is killing me',
      gemini: { primarySymptoms: ['headache'], secondarySymptoms: [], confidence: 0.9, bodyLocations: ['head'], sensations: ['throbbing'], duration: '', severity: 'severe', possibleContexts: [] },
      expectedPrimary: 'headache',
    },
    {
      query: "can't stop throwing up",
      gemini: { primarySymptoms: ['nausea'], secondarySymptoms: [], confidence: 0.95, bodyLocations: ['stomach'], sensations: ['nauseous'], duration: '', severity: 'moderate', possibleContexts: [] },
      expectedPrimary: 'nausea',
    },
    {
      query: 'headache and nausea',
      gemini: { primarySymptoms: ['headache', 'nausea'], secondarySymptoms: [], confidence: 0.85, bodyLocations: ['head', 'stomach'], sensations: [], duration: '', severity: '', possibleContexts: [] },
      expectedPrimary: 'headache',
    },
    {
      query: 'skin is itchy all over',
      gemini: { primarySymptoms: ['skin_rash'], secondarySymptoms: ['dry_skin'], confidence: 0.7, bodyLocations: ['skin'], sensations: ['itchy'], duration: '', severity: '', possibleContexts: [] },
      expectedPrimary: 'skin_rash',
    },
    {
      query: 'low sex drive',
      gemini: { primarySymptoms: ['low_libido'], secondarySymptoms: [], confidence: 0.92, bodyLocations: [], sensations: [], duration: '', severity: '', possibleContexts: [] },
      expectedPrimary: 'low_libido',
    },
  ];

  console.log(`\n  Running ${testCases.length} queries with simulated Gemini...\n`);
  console.log('  ' + '-'.repeat(90));
  console.log(`  ${'Query'.padEnd(32)} ${'Det. Engine'.padEnd(16)} ${'With Gemini'.padEnd(16)} ${'Gemini IDs'.padEnd(20)} Match`);
  console.log('  ' + '-'.repeat(90));

  for (const tc of testCases) {
    // Deterministic only
    const detResult = resolveQuery(tc.query, SYMPTOMS);
    const detTop = detResult.symptomIds[0] || '(none)';

    // With simulated Gemini
    const gemResult = resolveQuery(tc.query, SYMPTOMS, tc.gemini);
    const gemTop = gemResult.symptomIds[0] || '(none)';

    const gemIds = gemResult.symptomIds.slice(0, 3).join(', ');
    const detCorrect = detTop === tc.expectedPrimary;
    const gemCorrect = gemTop === tc.expectedPrimary;

    const mark = gemCorrect ? '✓' : '✗';
    console.log(`  ${mark} ${tc.query.padEnd(30)} ${detTop.padEnd(16)} ${gemTop.padEnd(16)} ${gemIds.padEnd(20)} det=${detCorrect ? 'Y' : 'N'} gem=${gemCorrect ? 'Y' : 'N'}`);
  }

  console.log('  ' + '-'.repeat(90));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  DIAGNOSTIC BATCH TEST — Search Pipeline Evidence Gathering               ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');

  // Try local dev server first, fall back to production
  const localUrl = 'http://localhost:8888/.netlify/functions/gemini-nlu';
  const prodUrl = 'https://curaapp.netlify.app/.netlify/functions/gemini-nlu';

  let geminiUrl = localUrl;
  let geminiLabel = 'local dev server';
  try {
    const testResp = await fetch(localUrl, { method: 'OPTIONS', signal: AbortSignal.timeout(3000) });
    if (testResp.ok || testResp.status === 204 || testResp.status === 405) {
      console.log('  → Local dev server reachable, using it for Gemini tests.');
    } else {
      throw new Error('not ok');
    }
  } catch {
    geminiUrl = prodUrl;
    geminiLabel = 'production';
    console.log('  → Local dev server not reachable, using production URL.');
  }

  await testGeminiEndpoint(geminiUrl, geminiLabel);
  runDeterministicTests();
  runRemedyRankingTests();
  runGeminiEnhancedTests();

  console.log(`\n${'='.repeat(70)}`);
  console.log('  SUMMARY');
  console.log(`${'='.repeat(70)}`);
  console.log('  Check the results above for:');
  console.log('  1. Is Gemini returning source: "gemini" or source: "fallback"?');
  console.log('  2. Are deterministic engine top matches correct (✓ vs ✗)?');
  console.log('  3. Do direct symptom card clicks return relevant remedies?');
  console.log('  4. Does adding Gemini improve or worsen results vs deterministic-only?');
  console.log(`${'='.repeat(70)}\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
