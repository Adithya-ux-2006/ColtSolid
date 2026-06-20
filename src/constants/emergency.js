export const EMERGENCY_SYMPTOMS = new Set([
  'heart pain',
  'heart attack',
  'chest pain',
  'chest tightness',
  'chest pressure',
  'difficulty breathing',
  'shortness of breath',
  'severe allergic reaction',
  'anaphylaxis',
  'loss of consciousness',
  'fainting',
  'coughing blood',
  'blood in cough',
  'vomiting blood',
  'stroke symptoms',
  'stroke',
  'sudden paralysis',
  'sudden numbness',
  'sudden weakness',
  'slurred speech',
  'facial drooping',
  'severe head injury',
  'head injury',
  'suicidal thoughts',
  'overdose',
  'ingested poison',
  'poisoning',
  'severe burn',
  'third degree burn',
  'uncontrollable bleeding',
  'severe bleeding',
  'seizure',
  'convulsions',
  'severe abdominal pain',
  'acute abdominal pain',
  'high fever adult',
  'fever over 103',
]);

export function isEmergencySymptom(query) {
  if (!query) return false;
  const normalized = query.toLowerCase().trim();
  for (const phrase of EMERGENCY_SYMPTOMS) {
    if (normalized === phrase) return true;
    if (normalized.startsWith(phrase + ' ')) return true;
    if (normalized.endsWith(' ' + phrase)) return true;
    if (normalized.includes(' ' + phrase + ' ')) return true;
  }
  return false;
}

export const EMERGENCY_MESSAGE = 'This symptom may require urgent medical attention.';
export const EMERGENCY_ACTION = 'Do not rely on self-treatment guidance. Seek immediate medical care.';
