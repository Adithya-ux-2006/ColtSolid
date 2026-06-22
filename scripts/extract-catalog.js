import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS = [
  'seed.sql',
  '008_expanded_remedies.sql',
  '009_symptom_remedies.sql',
  '010_body_pain_symptoms.sql',
  '012_symptom_expansion.sql',
  '013_database_repair.sql',
  '014_symptom_remedies_expansion.sql',
];

const BASE = join(__dirname, '..', 'supabase', 'migrations');
function rf(f) { try { return readFileSync(f, 'utf-8'); } catch { return ''; } }

// Combine all SQL files, trim each
const allSQL = [
  rf(join(__dirname, '..', 'supabase', 'seed.sql')),
  ...MIGRATIONS.filter(m => m !== 'seed.sql').map(m => rf(join(BASE, m))),
].join('\n');
const lines = allSQL.split('\n');

// Helper: parse VALUES rows from an INSERT statement
function parseInsertRows(sqlBlock) {
  const results = [];
  const valuesIdx = sqlBlock.toUpperCase().indexOf('VALUES');
  if (valuesIdx < 0) return results;
  const afterValues = sqlBlock.slice(valuesIdx + 6);
  // Find end: ON CONFLICT or ;
  let end = afterValues.search(/ON CONFLICT/i);
  if (end < 0) end = afterValues.indexOf(';');
  if (end < 0) end = afterValues.length;

  // But also look for "ON DUPLICATE" etc
  const vals = afterValues.slice(0, end);
  // Parse each (...) row
  let depth = 0, start = -1;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === '(') { if (depth === 0) start = i; depth++; }
    else if (vals[i] === ')') {
      depth--;
      if (depth === 0 && start >= 0) {
        results.push(vals.slice(start + 1, i));
        start = -1;
      }
    }
  }
  return results;
}

// Simple CSV parser for a row within parens (handles ARRAY[...] blocks)
function parseRowCSV(row) {
  const fields = [];
  let cur = '', inQ = false, inArr = 0;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === "'" && row[i + 1] === "'") { cur += "'"; i++; continue; }
    if (c === "'") { inQ = !inQ; cur += c; continue; }
    // Track ARRAY blocks to avoid splitting on commas inside them
    if (!inQ && c === 'A' && row.slice(i, i + 6) === 'ARRAY[') { inArr++; cur += c; continue; }
    if (!inQ && inArr > 0 && c === ']') { inArr--; cur += c; continue; }
    if (c === ',' && !inQ && inArr === 0) { fields.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  fields.push(cur.trim());
  return fields.map(f => f.replace(/^'|'$/g, ''));
}

// Collect all INSERT blocks by grouping lines
const insertBlocks = [];
let currentBlock = null;
for (const line of lines) {
  const trimmed = line.trim();
  if (/^INSERT\s+INTO\s+public\./i.test(trimmed)) {
    if (currentBlock) insertBlocks.push(currentBlock.join('\n'));
    currentBlock = [trimmed];
  } else if (currentBlock) {
    currentBlock.push(trimmed);
  }
}
if (currentBlock) insertBlocks.push(currentBlock.join('\n'));

// --- EXTRACT SYMPTOMS ---
const symptoms = new Map();
for (const block of insertBlocks) {
  if (!/INSERT\s+INTO\s+public\.symptoms/i.test(block)) continue;
  const rows = parseInsertRows(block);
  for (const row of rows) {
    const p = parseRowCSV(row);
    if (p.length >= 4) {
      const [id, label, emoji, color] = p;
      const cleanColor = (color === '??' || color === '???' || color === '?????') ? 'sage' : color;
      if (!symptoms.has(id)) symptoms.set(id, { id, label, emoji, color: cleanColor });
    }
  }
}

// --- EXTRACT REMEDIES ---
const remediesMap = new Map();
for (const block of insertBlocks) {
  if (!/INSERT\s+INTO\s+public\.remedies/i.test(block)) continue;
  const rows = parseInsertRows(block);
  for (const row of rows) {
    const p = parseRowCSV(row);
    if (p.length >= 15) {
      const [id, name, cat, ratingStr, reviewStr, sd, ld, htu, warnings, at, ci, tte, diff, cost, feat] = p;
      // Skip deprioritized conventional (mig 012 part 9):
      // They have priority_rank set to 0 in symptom_remedies
      if (cat === 'Conventional') continue;
      const rating = parseFloat(ratingStr) || 0;
      const reviewCount = parseInt(reviewStr) || 0;
      const isFeatured = feat === 'true';
      if (!remediesMap.has(id)) {
        remediesMap.set(id, {
          id, name, category: cat, rating, reviewCount,
          shortDescription: sd, longDescription: ld,
          howToUse: htu, warnings,
          timeToEffect: tte, difficulty: diff, cost, isFeatured,
          // These will be populated later
          allergenTags: [], contraindications: [],
        });
      }
    }
  }
}

// --- EXTRACT remedy_symptoms (filter to valid symptom IDs only) ---
const remedySymptomsMap = new Map(); // symptom_id -> [[remedy_id, match_strength]]
const validSymptomIds = new Set(symptoms.keys());
for (const block of insertBlocks) {
  if (!/INSERT\s+INTO\s+public\.remedy_symptoms/i.test(block)) continue;
  const rows = parseInsertRows(block);
  for (const row of rows) {
    const p = parseRowCSV(row);
    if (p.length >= 2) {
      const [rid, sid, ms] = [p[0], p[1], p[2] || 'primary'];
      if (!validSymptomIds.has(sid)) continue;
      if (!remedySymptomsMap.has(sid)) remedySymptomsMap.set(sid, []);
      const arr = remedySymptomsMap.get(sid);
      if (!arr.find(e => e[0] === rid)) arr.push([rid, ms]);
    }
  }
}

// --- EXTRACT symptom_remedies (direct VALUES inserts) ---
const symptomRemediesMap = new Map(); // symptom_id -> [{remedyId, evidenceScore, priorityRank}]
for (const block of insertBlocks) {
  if (!/INSERT\s+INTO\s+public\.symptom_remedies/i.test(block)) continue;
  // Skip SELECT-based inserts (handled separately)
  if (/SELECT\s/i.test(block)) continue;
  const rows = parseInsertRows(block);
  for (const row of rows) {
    const p = parseRowCSV(row);
    if (p.length >= 4) {
      const [sid, rid, es, pr] = [p[0], p[1], parseInt(p[2]), parseInt(p[3])];
      if (!symptomRemediesMap.has(sid)) symptomRemediesMap.set(sid, []);
      const arr = symptomRemediesMap.get(sid);
      if (!arr.find(e => e.remedyId === rid)) arr.push({ remedyId: rid, evidenceScore: es, priorityRank: pr });
    }
  }
}

// --- EXTRACT symptom_remedies (SELECT-based with CASE) ---
// Handle both `= 'value'` and `IN ('v1','v2')` syntax
function parseCaseWhenSQL(sql) {
  const entries = [];
  // Match: WHEN rs.symptom_id = 'xxx' AND rs.remedy_id = 'yyy' THEN N
  const reEq = /WHEN\s+rs\.symptom_id\s*=\s*'([^']+)'\s+AND\s+rs\.remedy_id\s*=\s*'([^']+)'\s+(?:AND\s+rs\.symptom_id\s*=\s*'[^']+'\s+)?THEN\s+(\d+)/gi;
  let m;
  while ((m = reEq.exec(sql)) !== null) entries.push({ sid: m[1], rid: m[2], pr: parseInt(m[3]) });

  // Match: WHEN rs.symptom_id = 'xxx' AND rs.remedy_id IN ('v1','v2',...) THEN N
  const reIn = /WHEN\s+rs\.symptom_id\s*=\s*'([^']+)'\s+AND\s+rs\.remedy_id\s+IN\s*\(([^)]+)\)\s+THEN\s+(\d+)/gi;
  let m2;
  while ((m2 = reIn.exec(sql)) !== null) {
    const sid = m2[1], pr = parseInt(m2[3]);
    const rids = m2[2].split(',').map(s => s.trim().replace(/^'|'$/g, ''));
    for (const rid of rids) entries.push({ sid, rid, pr });
  }
  return entries;
}

const caseEntries = parseCaseWhenSQL(allSQL);
const skippedSids = new Set();
for (const { sid, rid, pr } of caseEntries) {
  if (!symptoms.has(sid)) { skippedSids.add(sid); continue; }
  if (!symptomRemediesMap.has(sid)) symptomRemediesMap.set(sid, []);
  const arr = symptomRemediesMap.get(sid);
  if (!arr.find(e => e.remedyId === rid)) arr.push({ remedyId: rid, evidenceScore: 5, priorityRank: pr });
}
console.log('CASE WHEN entries:', caseEntries.length);
if (skippedSids.size > 0) console.log('Skipped sids:', [...skippedSids].join(', '));

// --- Also directly extract ingredient update statements from migration 012 ---
const ingRegex = /WHEN\s+'([^']+)'\s+THEN\s+(ARRAY\[[^\]]*\])/gi;
// We skip ingredients for now - they're not critical for the recommendation engine

// --- BUILD remedies with primary/secondary symptoms ---
const remediesWithSymptoms = [];
for (const [id, remed] of remediesMap) {
  const primary = [];
  const secondary = [];
  for (const [sid, entries] of remedySymptomsMap) {
    for (const [rid, ms] of entries) {
      if (rid === id) {
        if (ms === 'primary') primary.push(sid);
        else secondary.push(sid);
      }
    }
  }
  remed.primarySymptoms = primary;
  remed.secondarySymptoms = secondary;
  remediesWithSymptoms.push(remed);
}

// Add default symptom_remedies for remedies that are linked but have no explicit entry
for (const remed of remediesWithSymptoms) {
  for (const sid of remed.primarySymptoms) {
    if (!symptomRemediesMap.has(sid)) symptomRemediesMap.set(sid, []);
    const arr = symptomRemediesMap.get(sid);
    if (!arr.find(e => e.remedyId === remed.id)) {
      arr.push({ remedyId: remed.id, evidenceScore: 3, priorityRank: 5 });
    }
  }
}

// Filter out Conventional remedies from symptom_remedies mappings
const includedRemedyIds = new Set(remediesWithSymptoms.map(r => r.id));
for (const [sid, entries] of symptomRemediesMap) {
  symptomRemediesMap.set(sid, entries.filter(e => includedRemedyIds.has(e.remedyId)));
}

// --- GENERATE OUTPUT ---
// Debug: which symptoms have no mappings?
let totalSrEntries = 0;
for (const v of symptomRemediesMap.values()) totalSrEntries += v.length;
const allSymptomIds = new Set(symptoms.keys());
const mappedSymptomIds = new Set(symptomRemediesMap.keys());
const unmappedSymptoms = [...allSymptomIds].filter(s => !mappedSymptomIds.has(s));
// Check which unmapped have remedy_symptoms (primary) links
const unmappedWithRemedies = unmappedSymptoms.filter(s => remedySymptomsMap.has(s));
console.log('Symptoms without remedy mappings:', unmappedSymptoms.join(', '));
if (unmappedWithRemedies.length > 0) {
  console.log('Unmapped that HAVE remedy_symptoms:', unmappedWithRemedies.join(', '));
  for (const s of unmappedWithRemedies.slice(0, 3)) {
    console.log('  ' + s + ' primary remedies:', remedySymptomsMap.get(s).map(e => e[0]).join(','));
  }
}
const unmappedNoRemedies = unmappedSymptoms.filter(s => !remedySymptomsMap.has(s));
if (unmappedNoRemedies.length > 0) {
  console.log('Unmapped WITHOUT remedy_symptoms:', unmappedNoRemedies.join(', '));
}
console.log('Total SR entries:', totalSrEntries);
// Debug some specific symptoms
for (const s of ['congestion', 'brain_fog', 'sinus_pressure']) {
  console.log('  ' + s + ': inSymptoms=' + symptoms.has(s) + ' inRemedySym=' + remedySymptomsMap.has(s) + ' inSRMap=' + symptomRemediesMap.has(s));
}

const output = `// Auto-generated from SQL migrations
// Generated: ${new Date().toISOString()}

export const LOCAL_SYMPTOMS = ${JSON.stringify(Array.from(symptoms.values()), null, 2)};

export const LOCAL_REMEDIES = ${JSON.stringify(remediesWithSymptoms, null, 2)};

export const LOCAL_SYMPTOM_REMEDIES = ${JSON.stringify(Object.fromEntries(
  Array.from(symptomRemediesMap.entries()).map(([k, v]) => [k, v])
), null, 2)};
`;

writeFileSync(join(__dirname, '..', 'src', 'data', 'localCatalog.js'), output, 'utf-8');
console.log(`Written: ${remediesWithSymptoms.length} remedies, ${symptoms.size} symptoms, ${symptomRemediesMap.size} symptom mappings`);

// Verify key data (non-Conventional only; Conventional remedies intentionally excluded)
const remIds = remediesWithSymptoms.map(r => r.id);
const expected = ['rem_c09','rem_c10','rem_c02','rem_c01','rem_c06','rem_h01'];
const missing = expected.filter(id => !remIds.includes(id));
if (missing.length) console.log('MISSING remedies:', missing.join(', '));
else console.log('All expected remedies present ✓');
