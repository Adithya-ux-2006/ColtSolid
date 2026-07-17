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
    'emergency', 'urgent', 'suicidal', 'overdose', 'poison',
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

export const UNIVERSAL_EMERGENCY_FLAGS = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Loss of consciousness',
  'Sudden confusion',
  'Severe allergic reaction',
];

export const SYMPTOM_EMERGENCY_FLAGS = {
  headache: [
    'Sudden severe "thunderclap" headache',
    'Headache with stiff neck and fever',
    'Headache after a head injury',
    'Vision changes',
  ],
  migraine: [
    'Migraine with prolonged aura',
    'Sudden worst headache of life',
    'Headache with fever and stiff neck',
  ],
  back_pain: [
    'Loss of bladder or bowel control',
    'Numbness or weakness in legs',
    'Fever',
    'Sudden severe pain after injury',
  ],
  neck_pain: [
    'Neck pain with fever and stiff neck',
    'Neck pain after injury',
    'Difficulty swallowing or breathing',
  ],
  cold: [
    'High fever over 103°F',
    'Difficulty breathing',
    'Symptoms lasting more than 10 days',
  ],
  cough: [
    'Coughing blood',
    'Difficulty breathing',
    'Persistent cough over 3 weeks',
  ],
  sore_throat: [
    'Severe pain preventing swallowing',
    'Difficulty breathing',
    'Drooling',
  ],
  fever: [
    'Fever over 103°F',
    'Fever with rash',
    'Fever with stiff neck',
  ],
  anxiety: [
    'Suicidal thoughts',
    'Panic attack with chest pain',
    'Self-harm thoughts',
  ],
  nausea: [
    'Persistent vomiting',
    'Blood in vomit',
    'Severe abdominal pain',
  ],
  chest_pain: [
    'Chest pain with shortness of breath',
    'Pain radiating to arm or jaw',
    'Sweating with chest pain',
  ],
  difficulty_breathing: [
    'Severe breathlessness at rest',
    'Blue lips or fingernails',
    'Chest pain',
  ],
  diarrhea: [
    'Bloody diarrhea',
    'Severe dehydration',
    'Persistent diarrhea over 3 days',
  ],
  constipation: [
    'Severe pain',
    'Blood in stool',
    'Complete blockage',
  ],
  sprain: [
    'Severe swelling',
    'Inability to bear weight',
    'Deformity of the joint',
  ],
  sunburn: [
    'Blistering over large area',
    'Fever with sunburn',
    'Signs of dehydration',
  ],
  skin_rash: [
    'Rash with fever',
    'Sudden widespread rash',
    'Rash with difficulty breathing',
  ],
  vertigo: [
    'Sudden severe vertigo',
    'Vertigo with headache',
    'Difficulty speaking or walking',
  ],
  period_cramps: [
    'Severe pelvic pain',
    'Heavy bleeding',
    'Missed period with severe pain',
  ],
  low_libido: [
    'Sudden onset with other symptoms',
    'Depression or mood changes',
  ],
  erectile_difficulty: [
    'Sudden onset with chest pain',
    'Numbness or vision changes',
  ],
};
