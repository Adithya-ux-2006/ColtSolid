const SENSATION_MAP = {
  burning: [
    { symptomId: "heartburn", weight: 1.0, contextAffinity: ["chest"] },
    { symptomId: "eye_pain", weight: 0.8, contextAffinity: ["eye"] },
    { symptomId: "skin_rash", weight: 0.7, contextAffinity: ["skin"] },
    { symptomId: "fever", weight: 0.3 },
    { symptomId: "indigestion", weight: 0.3, contextAffinity: ["stomach"] },
  ],
  scratchy: [
    { symptomId: "sore_throat", weight: 1.0, contextAffinity: ["throat"] },
    { symptomId: "cold", weight: 0.5 },
    { symptomId: "cough", weight: 0.4 },
  ],
  scratch: [
    { symptomId: "sore_throat", weight: 0.8, contextAffinity: ["throat"] },
    { symptomId: "skin_rash", weight: 0.6, contextAffinity: ["skin"] },
    { symptomId: "dry_skin", weight: 0.5, contextAffinity: ["skin"] },
  ],
  tight: [
    { symptomId: "anxiety", weight: 0.9, contextAffinity: ["chest"] },
    { symptomId: "stress", weight: 0.8 },
    { symptomId: "headache", weight: 0.5, contextAffinity: ["head", "neck"] },
    { symptomId: "neck_pain", weight: 0.6, contextAffinity: ["neck"] },
    { symptomId: "congestion", weight: 0.4, contextAffinity: ["chest", "nose"] },
  ],
  throbbing: [
    { symptomId: "headache", weight: 1.0 },
    { symptomId: "migraine", weight: 0.9 },
    { symptomId: "eye_pain", weight: 0.4 },
  ],
  dull: [
    { symptomId: "headache", weight: 0.6 },
    { symptomId: "back_pain", weight: 0.5 },
    { symptomId: "muscle_pain", weight: 0.5 },
    { symptomId: "fatigue", weight: 0.3 },
  ],
  sharp: [
    { symptomId: "headache", weight: 0.5 },
    { symptomId: "migraine", weight: 0.6 },
    { symptomId: "stomach_ache", weight: 0.5 },
    { symptomId: "ear_pain", weight: 0.6 },
    { symptomId: "cough", weight: 0.3 },
  ],
  cramp: [
    { symptomId: "period_cramps", weight: 1.0, contextAffinity: ["period", "abdomen"] },
    { symptomId: "stomach_ache", weight: 0.7, contextAffinity: ["stomach", "belly"] },
    { symptomId: "muscle_pain", weight: 0.5 },
    { symptomId: "leg_pain", weight: 0.4 },
  ],
  swollen: [
    { symptomId: "skin_rash", weight: 0.6, contextAffinity: ["skin"] },
    { symptomId: "joint_pain", weight: 0.6, contextAffinity: ["joint", "knee"] },
    { symptomId: "sinus_pressure", weight: 0.5, contextAffinity: ["nose", "sinus"] },
    { symptomId: "cold", weight: 0.3 },
  ],
  numb: [
    { symptomId: "anxiety", weight: 0.6 },
    { symptomId: "migraine", weight: 0.5 },
    { symptomId: "headache", weight: 0.3 },
    { symptomId: "stress", weight: 0.4 },
    { symptomId: "neck_pain", weight: 0.3 },
  ],
  tingle: [
    { symptomId: "anxiety", weight: 0.7 },
    { symptomId: "stress", weight: 0.5 },
    { symptomId: "migraine", weight: 0.4 },
  ],
  ache: [
    { symptomId: "headache", weight: 0.8, contextAffinity: ["head"] },
    { symptomId: "muscle_pain", weight: 0.8 },
    { symptomId: "back_pain", weight: 0.6 },
    { symptomId: "stomach_ache", weight: 0.7, contextAffinity: ["stomach"] },
    { symptomId: "leg_pain", weight: 0.5 },
    { symptomId: "fatigue", weight: 0.4 },
    { symptomId: "joint_pain", weight: 0.6 },
    { symptomId: "neck_pain", weight: 0.5 },
    { symptomId: "shoulder_pain", weight: 0.5 },
  ],
  pain: [
    { symptomId: "headache", weight: 0.5, contextAffinity: ["head"] },
    { symptomId: "stomach_ache", weight: 0.5, contextAffinity: ["stomach", "belly"] },
    { symptomId: "back_pain", weight: 0.5, contextAffinity: ["back"] },
    { symptomId: "muscle_pain", weight: 0.4 },
    { symptomId: "joint_pain", weight: 0.4 },
    { symptomId: "neck_pain", weight: 0.4 },
    { symptomId: "shoulder_pain", weight: 0.4 },
    { symptomId: "knee_pain", weight: 0.4 },
    { symptomId: "leg_pain", weight: 0.4 },
    { symptomId: "eye_pain", weight: 0.5, contextAffinity: ["eye"] },
    { symptomId: "ear_pain", weight: 0.5, contextAffinity: ["ear"] },
    { symptomId: "sore_throat", weight: 0.5, contextAffinity: ["throat"] },
    { symptomId: "period_cramps", weight: 0.4, contextAffinity: ["period"] },
    { symptomId: "indigestion", weight: 0.2 },
  ],
  tired: [
    { symptomId: "fatigue", weight: 0.9 },
    { symptomId: "low_energy", weight: 0.8 },
    { symptomId: "eye_strain", weight: 0.5, contextAffinity: ["eye"] },
    { symptomId: "burnout", weight: 0.6 },
    { symptomId: "brain_fog", weight: 0.4 },
    { symptomId: "headache", weight: 0.2 },
  ],
  exhausted: [
    { symptomId: "fatigue", weight: 1.0 },
    { symptomId: "burnout", weight: 0.8 },
    { symptomId: "low_energy", weight: 0.9 },
    { symptomId: "brain_fog", weight: 0.5 },
    { symptomId: "stress", weight: 0.3 },
  ],
  heavy: [
    { symptomId: "fatigue", weight: 0.6 },
    { symptomId: "congestion", weight: 0.5, contextAffinity: ["chest", "nose"] },
    { symptomId: "headache", weight: 0.3 },
    { symptomId: "period_cramps", weight: 0.4, contextAffinity: ["period"] },
  ],
  itchy: [
    { symptomId: "skin_rash", weight: 1.0, contextAffinity: ["skin"] },
    { symptomId: "dry_skin", weight: 0.8 },
    { symptomId: "acne", weight: 0.3 },
    { symptomId: "cold", weight: 0.2 },
  ],
  dry: [
    { symptomId: "dry_skin", weight: 0.9, contextAffinity: ["skin"] },
    { symptomId: "eye_strain", weight: 0.6, contextAffinity: ["eye"] },
    { symptomId: "eye_pain", weight: 0.4, contextAffinity: ["eye"] },
    { symptomId: "cough", weight: 0.3, contextAffinity: ["throat"] },
    { symptomId: "sore_throat", weight: 0.3, contextAffinity: ["throat"] },
  ],
  foggy: [
    { symptomId: "brain_fog", weight: 1.0 },
    { symptomId: "fatigue", weight: 0.6 },
    { symptomId: "burnout", weight: 0.5 },
    { symptomId: "stress", weight: 0.3 },
    { symptomId: "low_energy", weight: 0.4 },
    { symptomId: "headache", weight: 0.2 },
  ],
  dizzy: [
    { symptomId: "dehydration", weight: 0.7 },
    { symptomId: "fatigue", weight: 0.6 },
    { symptomId: "low_energy", weight: 0.5 },
    { symptomId: "anxiety", weight: 0.4 },
    { symptomId: "migraine", weight: 0.4 },
    { symptomId: "stress", weight: 0.3 },
  ],
  nauseous: [
    { symptomId: "nausea", weight: 1.0 },
    { symptomId: "indigestion", weight: 0.5 },
    { symptomId: "migraine", weight: 0.4 },
    { symptomId: "stomach_ache", weight: 0.3 },
  ],
  bloated: [
    { symptomId: "bloating", weight: 1.0 },
    { symptomId: "gas", weight: 0.8 },
    { symptomId: "indigestion", weight: 0.6 },
    { symptomId: "stomach_ache", weight: 0.4 },
    { symptomId: "period_cramps", weight: 0.3, contextAffinity: ["period"] },
  ],
  blocked: [
    { symptomId: "congestion", weight: 0.9, contextAffinity: ["nose", "sinus", "chest"] },
    { symptomId: "cold", weight: 0.5 },
    { symptomId: "sinus_pressure", weight: 0.7, contextAffinity: ["nose", "sinus"] },
    { symptomId: "constipation", weight: 0.6, contextAffinity: ["stomach", "abdomen"] },
    { symptomId: "indigestion", weight: 0.3 },
  ],
  runny: [
    { symptomId: "cold", weight: 0.8, contextAffinity: ["nose"] },
    { symptomId: "congestion", weight: 0.6, contextAffinity: ["nose"] },
  ],
  coughing: [
    { symptomId: "cough", weight: 1.0 },
    { symptomId: "cold", weight: 0.7 },
    { symptomId: "sore_throat", weight: 0.5 },
    { symptomId: "congestion", weight: 0.4 },
  ],
  sneezing: [
    { symptomId: "cold", weight: 0.9 },
    { symptomId: "congestion", weight: 0.6 },
  ],
  feverish: [
    { symptomId: "fever", weight: 1.0 },
    { symptomId: "cold", weight: 0.7 },
    { symptomId: "fatigue", weight: 0.3 },
  ],
  anxious: [
    { symptomId: "anxiety", weight: 1.0 },
    { symptomId: "stress", weight: 0.8 },
    { symptomId: "panic", weight: 0.7 },
    { symptomId: "insomnia", weight: 0.3 },
  ],
  stressed: [
    { symptomId: "stress", weight: 1.0 },
    { symptomId: "anxiety", weight: 0.8 },
    { symptomId: "burnout", weight: 0.6 },
    { symptomId: "headache", weight: 0.3 },
    { symptomId: "insomnia", weight: 0.3 },
  ],
  restless: [
    { symptomId: "anxiety", weight: 0.7 },
    { symptomId: "stress", weight: 0.6 },
    { symptomId: "insomnia", weight: 0.8 },
  ],
  irritable: [
    { symptomId: "stress", weight: 0.7 },
    { symptomId: "burnout", weight: 0.6 },
    { symptomId: "anxiety", weight: 0.5 },
    { symptomId: "pms", weight: 0.5 },
  ],
};

const SENSATION_ALIASES = {
  burning: "burning", burn: "burning",
  scratchy: "scratchy", scratchiness: "scratchy", scratch: "scratchy",
  throbbing: "throbbing", throb: "throbbing", pulsing: "throbbing",
  cramping: "cramp", cramps: "cramp", cramp: "cramp",
  swelling: "swollen", swell: "swollen", puffy: "swollen",
  numbness: "numb", numbing: "numb",
  tingling: "tingle", tingle: "tingle",
  aching: "ache", aches: "ache", achy: "ache",
  painful: "pain", pains: "pain", hurts: "pain", hurt: "pain", hurting: "pain",
  tiredness: "tired", fatigue: "exhausted", exhaustion: "exhausted",
  heavily: "heavy", heaviness: "heavy",
  itchiness: "itchy", itching: "itchy", itch: "itchy",
  dryness: "dry", dries: "dry",
  fog: "foggy", fogginess: "foggy",
  dizziness: "dizzy",
  nausea: "nauseous", queasy: "nauseous", sick: "nauseous",
  bloating: "bloated", bloat: "bloated",
  obstruction: "blocked", blockage: "blocked", blocking: "blocked", stuffy: "blocked", stuffed: "blocked", clogged: "blocked",
  runniness: "runny",
  cough: "coughing", coughs: "coughing",
  sneeze: "sneezing", sneezes: "sneezing",
  fever: "feverish", feverishly: "feverish", temperature: "feverish", hot: "feverish",
  anxiety: "anxious", nervous: "anxious", worry: "anxious", worried: "anxious", panicking: "anxious", panic: "anxious",
  stress: "stressed", tensed: "stressed", overwhelm: "stressed",
  restlessness: "restless",
  irritated: "irritable", irritation: "irritable",
};

export function getSensationMap() {
  return SENSATION_MAP;
}

export function getSensationAliases() {
  return SENSATION_ALIASES;
}

export function resolveSensation(term) {
  const lower = term.toLowerCase();
  const alias = SENSATION_ALIASES[lower];
  const key = alias || lower;
  return SENSATION_MAP[key] ? { key, entries: SENSATION_MAP[key] } : null;
}
