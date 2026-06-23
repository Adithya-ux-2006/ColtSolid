export const EMERGENCY_PHRASES = [
  'heart pain', 'heart attack', 'chest pain', 'chest tightness', 'chest pressure',
  'difficulty breathing', 'shortness of breath', 'cannot breathe', 'hard to breathe',
  'severe allergic reaction', 'anaphylaxis',
  'loss of consciousness', 'fainting', 'unconscious',
  'coughing blood', 'blood in cough', 'vomiting blood', 'blood in vomit',
  'stroke symptoms', 'stroke', 'sudden paralysis', 'sudden numbness', 'sudden weakness',
  'slurred speech', 'facial drooping',
  'severe head injury', 'head injury',
  'suicidal thoughts', 'want to die', 'self harm',
  'overdose', 'ingested poison', 'poisoning',
  'severe burn', 'third degree burn', 'uncontrollable bleeding', 'severe bleeding',
  'seizure', 'convulsions',
  'severe abdominal pain', 'acute abdominal pain',
  'high fever adult', 'fever over 103', 'very high fever',
];

export function isEmergencySymptom(query) {
  if (!query) return false;
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 3) return false;

  for (const phrase of EMERGENCY_PHRASES) {
    if (normalized === phrase) return true;
    if (normalized.startsWith(phrase + ' ')) return true;
    if (normalized.endsWith(' ' + phrase)) return true;
    if (normalized.includes(' ' + phrase + ' ')) return true;
    if (normalized.includes(phrase)) return true;
  }

  const emergencyTokens = new Set([
    'emergency', 'urgent', 'severe', 'suicidal', 'overdose', 'poison',
    'anaphylaxis', 'seizure', 'convulsing', 'unconscious',
    'stroke', 'heart attack',
  ]);
  const queryTokens = normalized.split(/\s+/);
  for (const token of queryTokens) {
    if (emergencyTokens.has(token)) return true;
  }

  return false;
}

export const EMERGENCY_MESSAGE = 'This symptom may require urgent medical attention.';
export const EMERGENCY_ACTION = 'Do not rely on self-treatment guidance. Seek immediate medical care.';
