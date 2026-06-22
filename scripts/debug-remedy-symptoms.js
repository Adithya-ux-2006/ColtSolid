const fs = require('fs');
const path = require('path');
const BASE = 'supabase/migrations';
const files = [
  'supabase/seed.sql',
  path.join(BASE, '008_expanded_remedies.sql'),
  path.join(BASE, '009_symptom_remedies.sql'),
  path.join(BASE, '010_body_pain_symptoms.sql'),
  path.join(BASE, '012_symptom_expansion.sql'),
  path.join(BASE, '013_database_repair.sql'),
  path.join(BASE, '014_symptom_remedies_expansion.sql'),
];

const allSQL = files.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

const checkSymptoms = [
  'sinus_pressure','indigestion','heartburn','constipation','diarrhea',
  'brain_fog','burnout','joint_pain','muscle_pain','dry_skin','acne',
  'pms','menopause','dehydration','low_energy','stomach_ache','gas',
  'cough','congestion','migraine',
];

for (const sym of checkSymptoms) {
  const rx = new RegExp("'" + sym + "'", 'i');
  const blocks = allSQL.split(/INSERT INTO public\.remedy_symptoms/i);
  let found = false;
  for (let i = 1; i < blocks.length; i++) {
    if (rx.test(blocks[i])) { found = true; break; }
  }
  console.log(sym + ':', found ? 'HAS entries' : 'NO entries');
}
