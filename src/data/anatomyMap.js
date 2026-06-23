const ANATOMY_MAP = {
  head: [
    { symptomId: "headache", weight: 1.0 },
    { symptomId: "migraine", weight: 0.7 },
    { symptomId: "sinus_pressure", weight: 0.6 },
    { symptomId: "eye_strain", weight: 0.3 },
  ],
  forehead: [
    { symptomId: "headache", weight: 0.8 },
    { symptomId: "sinus_pressure", weight: 0.7 },
    { symptomId: "eye_strain", weight: 0.5 },
  ],
  temple: [
    { symptomId: "headache", weight: 0.9 },
    { symptomId: "migraine", weight: 0.8 },
    { symptomId: "eye_strain", weight: 0.6 },
  ],
  eye: [
    { symptomId: "eye_pain", weight: 1.0 },
    { symptomId: "eye_strain", weight: 0.9 },
    { symptomId: "dry_skin", weight: 0.3 },
    { symptomId: "headache", weight: 0.4 },
    { symptomId: "migraine", weight: 0.3 },
  ],
  ear: [
    { symptomId: "ear_pain", weight: 1.0 },
    { symptomId: "headache", weight: 0.3 },
    { symptomId: "cold", weight: 0.3 },
  ],
  nose: [
    { symptomId: "congestion", weight: 1.0 },
    { symptomId: "cold", weight: 0.7 },
    { symptomId: "sinus_pressure", weight: 0.8 },
    { symptomId: "cough", weight: 0.2 },
  ],
  throat: [
    { symptomId: "sore_throat", weight: 1.0 },
    { symptomId: "cold", weight: 0.7 },
    { symptomId: "cough", weight: 0.5 },
  ],
  neck: [
    { symptomId: "neck_pain", weight: 1.0 },
    { symptomId: "headache", weight: 0.5 },
    { symptomId: "stress", weight: 0.4 },
    { symptomId: "anxiety", weight: 0.2 },
  ],
  shoulder: [
    { symptomId: "shoulder_pain", weight: 1.0 },
    { symptomId: "neck_pain", weight: 0.6 },
    { symptomId: "stress", weight: 0.3 },
  ],
  back: [
    { symptomId: "back_pain", weight: 1.0 },
    { symptomId: "muscle_pain", weight: 0.5 },
  ],
  chest: [
    { symptomId: "heartburn", weight: 0.5 },
    { symptomId: "congestion", weight: 0.5 },
    { symptomId: "cold", weight: 0.4 },
    { symptomId: "cough", weight: 0.4 },
    { symptomId: "anxiety", weight: 0.4 },
    { symptomId: "stress", weight: 0.3 },
  ],
  stomach: [
    { symptomId: "stomach_ache", weight: 1.0 },
    { symptomId: "indigestion", weight: 0.8 },
    { symptomId: "nausea", weight: 0.7 },
    { symptomId: "bloating", weight: 0.6 },
    { symptomId: "gas", weight: 0.4 },
  ],
  abdomen: [
    { symptomId: "stomach_ache", weight: 0.8 },
    { symptomId: "indigestion", weight: 0.6 },
    { symptomId: "bloating", weight: 0.7 },
    { symptomId: "gas", weight: 0.5 },
    { symptomId: "nausea", weight: 0.5 },
    { symptomId: "period_cramps", weight: 0.6 },
  ],
  belly: [
    { symptomId: "stomach_ache", weight: 0.9 },
    { symptomId: "bloating", weight: 0.7 },
    { symptomId: "indigestion", weight: 0.6 },
    { symptomId: "gas", weight: 0.5 },
    { symptomId: "nausea", weight: 0.5 },
  ],
  muscle: [
    { symptomId: "muscle_pain", weight: 1.0 },
    { symptomId: "joint_pain", weight: 0.4 },
    { symptomId: "fatigue", weight: 0.4 },
    { symptomId: "back_pain", weight: 0.3 },
  ],
  joint: [
    { symptomId: "joint_pain", weight: 1.0 },
    { symptomId: "muscle_pain", weight: 0.5 },
    { symptomId: "knee_pain", weight: 0.3 },
  ],
  knee: [
    { symptomId: "knee_pain", weight: 1.0 },
    { symptomId: "joint_pain", weight: 0.7 },
    { symptomId: "leg_pain", weight: 0.5 },
  ],
  leg: [
    { symptomId: "leg_pain", weight: 1.0 },
    { symptomId: "muscle_pain", weight: 0.5 },
    { symptomId: "knee_pain", weight: 0.4 },
  ],
  foot: [
    { symptomId: "leg_pain", weight: 0.4 },
    { symptomId: "joint_pain", weight: 0.3 },
  ],
  skin: [
    { symptomId: "skin_rash", weight: 1.0 },
    { symptomId: "dry_skin", weight: 0.8 },
    { symptomId: "acne", weight: 0.5 },
    { symptomId: "allergy", weight: 0.4 },
  ],
  period: [
    { symptomId: "period_cramps", weight: 1.0 },
    { symptomId: "pms", weight: 0.8 },
    { symptomId: "menopause", weight: 0.4 },
    { symptomId: "bloating", weight: 0.3 },
  ],
};

const ANATOMY_ALIASES = {
  eyes: "eye", temples: "temple", ears: "ear",
  shoulders: "shoulder", knees: "knee", legs: "leg",
  feet: "foot", back: "back", neck: "neck",
  throat: "throat", nose: "nose", head: "head",
  forehead: "forehead", chest: "chest",
  tummy: "belly", abdomen: "abdomen", ab: "abdomen",
  gut: "stomach", belly: "belly", stomach: "stomach",
  skin: "skin", muscles: "muscle", joints: "joint",
  menstruation: "period", menstrual: "period", monthly: "period",
  spine: "back", lower_back: "back", upper_back: "back",
  sinus: "nose", sinuses: "nose", nasal: "nose",
};

export function getAnatomyMap() {
  return ANATOMY_MAP;
}

export function getAnatomyAliases() {
  return ANATOMY_ALIASES;
}

export function resolveAnatomy(term) {
  const lower = term.toLowerCase();
  const alias = ANATOMY_ALIASES[lower];
  const key = alias || lower;
  return ANATOMY_MAP[key] ? { key, entries: ANATOMY_MAP[key] } : null;
}
