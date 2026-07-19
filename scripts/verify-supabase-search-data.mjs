import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

function readEnv() {
  const pairs = fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    });

  return Object.fromEntries(pairs);
}

const symptomIds = [
  'back_pain',
  'cough',
  'sore_throat',
  'anxiety',
  'insomnia',
  'eye_pain',
  'sinus_pressure',
  'stomach_ache',
  'low_libido',
];

async function loadRows(client, table, symptomId) {
  const { data, error } = await client.from(table).select('*').eq('symptom_id', symptomId);
  if (error) throw new Error(`${table} query failed for ${symptomId}: ${error.message}`);
  return data;
}

async function main() {
  const env = readEnv();
  const url = env.VITE_SUPABASE_URL;
  const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
  }

  const client = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const rows = [];

  for (const symptomId of symptomIds) {
    const symptomRemedies = await loadRows(client, 'symptom_remedies', symptomId);
    const remedySymptoms = await loadRows(client, 'remedy_symptoms', symptomId);

    rows.push({
      symptomId,
      symptomRemedies: symptomRemedies.length,
      remedySymptoms: remedySymptoms.length,
      primaryRemedySymptoms: remedySymptoms.filter((row) => !row.match_strength || row.match_strength === 'primary').length,
      secondaryRemedySymptoms: remedySymptoms.filter((row) => row.match_strength === 'secondary').length,
    });
  }

  process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message || error}\n`);
  process.exit(1);
});
