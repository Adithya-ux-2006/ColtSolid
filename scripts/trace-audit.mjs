// Trace audit — simulates the full user journey for 5 queries
import { readFileSync } from 'fs';

// Load catalog data from the generated file
const catalogRaw = readFileSync('src/data/localCatalog.js', 'utf-8');

// Extract JSON objects from the export statements
function extractJSON(name, text) {
  const re = new RegExp(`export const ${name} = ([\\s\\S]*?);\\n`);
  const m = text.match(re);
  if (!m) throw new Error(`Can't find ${name}`);
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    // Fix trailing commas or other issues
    return JSON.parse(m[1].replace(/,(\s*[\]}])/g, '$1'));
  }
}

const LOCAL_SYMPTOMS = extractJSON('LOCAL_SYMPTOMS', catalogRaw);
const LOCAL_REMEDIES = extractJSON('LOCAL_REMEDIES', catalogRaw);
const LOCAL_SYMPTOM_REMEDIES = extractJSON('LOCAL_SYMPTOM_REMEDIES', catalogRaw);

// === Copy of resolveQuery logic from symptomEngine.js ===
const ALIAS_MAP = {
  'blocked nose': 'congestion',
  'stuffed nose': 'congestion',
  'stuffy nose': 'congestion',
  'nasal congestion': 'congestion',
  'nose blocked': 'congestion',
  'clogged nose': 'congestion',
  'can\'t breathe nose': 'congestion',
  'nose stuffy': 'congestion',
  'eye pain': 'eye_pain',
  'eye hurt': 'eye_pain',
  'sore eyes': 'eye_pain',
  'burning eyes': 'eye_pain',
  'stinging eyes': 'eye_pain',
  'eyes hurt': 'eye_pain',
  'hurting eyes': 'eye_pain',
  'eye ache': 'eye_pain',
  'pain in eye': 'eye_pain',
  'pain in eyes': 'eye_pain',
  'brain fog': 'brain_fog',
  'brainfog': 'brain_fog',
  'mental fog': 'brain_fog',
  'can\'t focus': 'brain_fog',
  'cant focus': 'brain_fog',
  'can\'t think': 'brain_fog',
  'cant think': 'brain_fog',
  'foggy head': 'brain_fog',
  'cloudy head': 'brain_fog',
  'mental clarity': 'brain_fog',
  'hard to concentrate': 'brain_fog',
  'scatterbrained': 'brain_fog',
  'spaced out': 'brain_fog',
  'lack of focus': 'brain_fog',
  'cloudy mind': 'brain_fog',
  'leg pain': 'leg_pain',
  'leg hurt': 'leg_pain',
  'leg ache': 'leg_pain',
  'leg cramp': 'leg_pain',
  'shin splints': 'leg_pain',
  'cramp in leg': 'leg_pain',
  'sore leg': 'leg_pain',
  'headache': 'headache',
  'head ache': 'headache',
  'migraine': 'migraine',
  'throbbing head': 'headache',
  'tension head': 'headache',
  'head hurting': 'headache',
  'head pain': 'headache',
  'pounding head': 'headache',
};

function normalize(q) { return q.toLowerCase().trim().replace(/\s+/g, ' '); }
function buildLabelIndex(symptoms) {
  const idx = {};
  for (const s of symptoms) { idx[s.label.toLowerCase()] = s.id; idx[s.id] = s.id; }
  return idx;
}
function isContainedIn(query, alias) {
  return query === alias
    || query.startsWith(alias + ' ')
    || query.endsWith(' ' + alias)
    || query.includes(' ' + alias + ' ');
}

function resolveQuery(query, symptoms) {
  if (!query || !symptoms?.length) return { symptomIds: [], confidence: 0 };
  const normalized = normalize(query);
  const labelIndex = buildLabelIndex(symptoms);
  const matchedIds = new Set();
  const log = [];

  if (labelIndex[normalized]) {
    matchedIds.add(labelIndex[normalized]);
    log.push(`  [exact_label] → ${labelIndex[normalized]}`);
  }

  for (const [alias, id] of Object.entries(ALIAS_MAP)) {
    if (isContainedIn(normalized, alias)) {
      if (!matchedIds.has(id)) {
        matchedIds.add(id);
        log.push(`  [alias] → ${id} (via "${alias}")`);
      }
    }
  }

  return { symptomIds: Array.from(matchedIds), log };
}

// === Copy of getRankedRemediesForSymptoms logic ===
function getRankedRemediesForSymptoms(symptomIds, symptomRemediesMap, remedies) {
  if (!symptomIds?.length || !remedies?.length) return [];
  const trace = { symptomRemediesEntries: [], fallbackEntries: [], deduped: [] };

  const remedyMap = {};
  for (const r of remedies) remedyMap[r.id] = r;
  const hasCuratedData = symptomRemediesMap && Object.keys(symptomRemediesMap).length > 0;

  const primaryScored = [];
  const secondaryScored = [];

  for (const symptomId of symptomIds) {
    if (hasCuratedData) {
      const entries = symptomRemediesMap[symptomId];
      if (entries?.length) {
        trace.symptomRemediesEntries.push({ symptomId, count: entries.length });
        for (const entry of entries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy) {
            trace.symptomRemediesEntries.push({ symptomId, skipped: entry.remedyId + ' not in remedyMap' });
            continue;
          }
          const isPrimary = remedy.primarySymptoms?.includes(symptomId) || !remedy.secondarySymptoms?.includes(symptomId);
          const bucket = isPrimary ? primaryScored : secondaryScored;
          bucket.push({
            ...remedy,
            _matchSymptomId: symptomId,
            _evidenceScore: entry.evidenceScore,
            _priorityRank: entry.priorityRank,
            _isPrimary: isPrimary,
          });
        }
        continue;
      }
    }

    // Fallback
    const fallbacks = [];
    for (const remedy of remedies) {
      if (remedy.primarySymptoms?.includes(symptomId)) {
        fallbacks.push(remedy.id);
        const paperCount = remedy.researchPapers?.length || 0;
        primaryScored.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: 5,
          _isPrimary: true,
        });
      } else if (remedy.secondarySymptoms?.includes(symptomId)) {
        fallbacks.push(remedy.id);
        secondaryScored.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: 3,
          _isPrimary: false,
        });
      }
    }
    if (fallbacks.length > 0) {
      trace.fallbackEntries.push({ symptomId, count: fallbacks.length, remedies: fallbacks });
    } else {
      trace.fallbackEntries.push({ symptomId, count: 0, reason: 'no remedies have this symptom in primarySymptoms/secondarySymptoms' });
    }
  }

  const seen = new Map();
  const allScored = [...primaryScored, ...secondaryScored];
  for (const item of allScored) {
    const existing = seen.get(item.id);
    if (!existing) { seen.set(item.id, item); }
    else if (item._isPrimary && !existing._isPrimary) { seen.set(item.id, item); }
    else if (item._isPrimary === existing._isPrimary && item._priorityRank > existing._priorityRank) {
      seen.set(item.id, { ...existing, _evidenceScore: Math.max(existing._evidenceScore, item._evidenceScore), _priorityRank: item._priorityRank });
    }
  }
  const deduped = Array.from(seen.values());
  trace.dedupedCount = deduped.length;
  return { remedies: deduped, trace };
}

// === RUN AUDIT ===
console.log('=== CATALOG STATS ===');
console.log('Symptoms:', LOCAL_SYMPTOMS.length);
console.log('Remedies:', LOCAL_REMEDIES.length);
console.log('Symptoms with remedy mappings:', Object.keys(LOCAL_SYMPTOM_REMEDIES).length);
console.log('Total SR entries:', Object.values(LOCAL_SYMPTOM_REMEDIES).flat().length);

for (const q of ['blocked nose', 'eye pain', 'brain fog', 'leg pain', 'headache']) {
  console.log('\n========================================');
  console.log('QUERY:', q);
  console.log('========================================');

  // Step 1: Resolve
  const resolution = resolveQuery(q, LOCAL_SYMPTOMS);
  console.log('Step 1 - resolveQuery:');
  console.log('  symptomIds:', resolution.symptomIds.length ? resolution.symptomIds.join(', ') : '(none)');
  resolution.log.forEach(l => console.log(l));

  if (resolution.symptomIds.length === 0) {
    console.log('  ❌ NO SYMPTOM RESOLVED');
    continue;
  }

  // Step 2: Get ranked remedies
  const ranked = getRankedRemediesForSymptoms(resolution.symptomIds, LOCAL_SYMPTOM_REMEDIES, LOCAL_REMEDIES);
  console.log('\nStep 2 - getRankedRemediesForSymptoms:');
  console.log('  hasCuratedData:', Object.keys(LOCAL_SYMPTOM_REMEDIES).length > 0);
  
  for (const sr of ranked.trace.symptomRemediesEntries) {
    if (sr.skipped) console.log('  symptom_remedies[' + sr.symptomId + ']: skipped ' + sr.skipped);
    else console.log('  symptom_remedies[' + sr.symptomId + ']:', sr.count, 'entries');
  }
  for (const fb of ranked.trace.fallbackEntries) {
    if (fb.remedies) console.log('  fallback[' + fb.symptomId + ']:', fb.count, 'remedies via primarySymptoms:', fb.remedies.join(', '));
    else console.log('  fallback[' + fb.symptomId + ']:', fb.count, '-', fb.reason);
  }

  console.log('  Total ranked remedies (before filter):', ranked.remedies.length);
  if (ranked.remedies.length > 0) {
    console.log('  Top 5:', ranked.remedies.slice(0, 5).map(r => r.id + '(' + r._priorityRank + ')').join(', '));
  }

  // Step 3: Filter conventional
  const nonConv = ranked.remedies.filter(r => r.category !== 'Conventional');
  console.log('\nStep 3 - nonConventional filter:');
  console.log('  After removing Conventional:', nonConv.length);
  if (nonConv.length > 0) {
    console.log('  Top 5:', nonConv.slice(0, 5).map(r => r.id).join(', '));
  }

  if (nonConv.length === 0) {
    console.log('  ❌ ALL REMEDIES FILTERED OUT');
    if (ranked.remedies.length > 0) {
      const conv = ranked.remedies.filter(r => r.category === 'Conventional');
      console.log('  Conventional remedies found:', conv.map(r => r.id).join(', '));
    }
  }
}
