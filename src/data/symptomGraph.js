const SYMPTOM_GRAPH = {
  headache: {
    relatedSymptoms: ['migraine', 'eye_strain', 'sinus_pressure', 'stress', 'dehydration', 'neck_pain'],
    possibleCauses: ['tension', 'dehydration', 'eye strain', 'sinus congestion', 'poor sleep', 'stress'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['sudden severe thunderclap headache', 'headache with stiff neck and fever', 'headache after head injury'],
  },
  migraine: {
    relatedSymptoms: ['nausea', 'headache', 'eye_strain', 'fatigue', 'stress'],
    possibleCauses: ['neurological sensitivity', 'hormonal changes', 'sleep disruption', 'dietary triggers', 'stress'],
    severityFlags: ['moderate', 'severe'],
    emergencyFlags: ['migraine with prolonged aura', 'sudden worst headache of life'],
  },
  cold: {
    relatedSymptoms: ['cough', 'congestion', 'sore_throat', 'fever', 'sinus_pressure', 'fatigue', 'headache'],
    possibleCauses: ['viral infection', 'seasonal transmission', 'immune system response'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['high fever over 103', 'difficulty breathing', 'symptoms lasting more than 10 days'],
  },
  cough: {
    relatedSymptoms: ['cold', 'congestion', 'sore_throat', 'sinus_pressure'],
    possibleCauses: ['viral infection', 'allergies', 'irritants', 'post-nasal drip', 'asthma'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['coughing blood', 'difficulty breathing', 'persistent cough over 3 weeks'],
  },
  congestion: {
    relatedSymptoms: ['sinus_pressure', 'cold', 'cough', 'headache', 'sore_throat'],
    possibleCauses: ['viral infection', 'allergies', 'sinus inflammation', 'weather changes'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  sinus_pressure: {
    relatedSymptoms: ['congestion', 'headache', 'cold', 'ear_pain', 'tooth pain'],
    possibleCauses: ['sinus infection', 'allergies', 'congestion', 'weather changes', 'facial structure'],
    severityFlags: ['moderate', 'severe'],
    emergencyFlags: ['high fever with facial swelling', 'vision changes'],
  },
  sore_throat: {
    relatedSymptoms: ['cold', 'cough', 'congestion', 'fever'],
    possibleCauses: ['viral infection', 'bacterial infection', 'dry air', 'irritants', 'vocal strain'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe pain preventing swallowing', 'difficulty breathing', 'drooling'],
  },
  fever: {
    relatedSymptoms: ['cold', 'dehydration', 'headache', 'fatigue', 'muscle_pain'],
    possibleCauses: ['infection', 'immune response', 'inflammation', 'heat exhaustion'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['fever over 103', 'fever with rash', 'fever with stiff neck', 'fever in infant'],
  },
  anxiety: {
    relatedSymptoms: ['stress', 'insomnia', 'panic', 'heart palpitations', 'fatigue', 'brain_fog'],
    possibleCauses: ['stress', 'hormonal imbalance', 'life changes', 'genetic predisposition', 'trauma'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['suicidal thoughts', 'panic attack with chest pain', 'self-harm thoughts'],
  },
  stress: {
    relatedSymptoms: ['anxiety', 'insomnia', 'fatigue', 'headache', 'burnout', 'brain_fog', 'muscle_pain'],
    possibleCauses: ['work pressure', 'life changes', 'relationship issues', 'financial concerns', 'health problems'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  burnout: {
    relatedSymptoms: ['fatigue', 'stress', 'brain_fog', 'insomnia', 'low_energy', 'anxiety'],
    possibleCauses: ['prolonged stress', 'overwork', 'lack of recovery', 'poor boundaries', 'sleep deprivation'],
    severityFlags: ['moderate', 'severe'],
    emergencyFlags: [],
  },
  insomnia: {
    relatedSymptoms: ['stress', 'anxiety', 'fatigue', 'brain_fog', 'burnout', 'low_energy'],
    possibleCauses: ['stress', 'anxiety', 'poor sleep hygiene', 'caffeine', 'screen time', 'hormonal changes', 'pain'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: [],
  },
  fatigue: {
    relatedSymptoms: ['low_energy', 'brain_fog', 'stress', 'burnout', 'insomnia', 'dehydration', 'anemia concern'],
    possibleCauses: ['poor sleep', 'stress', 'dehydration', 'nutritional deficiency', 'overexertion', 'illness recovery'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['extreme fatigue with chest pain', 'sudden severe fatigue'],
  },
  low_energy: {
    relatedSymptoms: ['fatigue', 'brain_fog', 'dehydration', 'stress', 'insomnia'],
    possibleCauses: ['poor sleep', 'dehydration', 'nutritional deficiency', 'sedentary lifestyle', 'stress'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  brain_fog: {
    relatedSymptoms: ['fatigue', 'low_energy', 'stress', 'dehydration', 'burnout', 'insomnia'],
    possibleCauses: ['poor sleep', 'stress', 'dehydration', 'nutritional deficiency', 'information overload', 'illness'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['sudden confusion', 'memory loss', 'difficulty speaking'],
  },
  nausea: {
    relatedSymptoms: ['indigestion', 'stomach_ache', 'headache', 'migraine', 'hangover', 'anxiety'],
    possibleCauses: ['indigestion', 'migraine', 'anxiety', 'food poisoning', 'motion sickness', 'hangover', 'pregnancy'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['persistent vomiting', 'blood in vomit', 'severe abdominal pain'],
  },
  stomach_ache: {
    relatedSymptoms: ['nausea', 'indigestion', 'bloating', 'gas', 'constipation', 'diarrhea'],
    possibleCauses: ['indigestion', 'gas', 'constipation', 'food intolerance', 'infection', 'stress'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe abdominal pain', 'blood in stool', 'persistent pain'],
  },
  indigestion: {
    relatedSymptoms: ['heartburn', 'bloating', 'nausea', 'stomach_ache', 'gas'],
    possibleCauses: ['overeating', 'spicy food', 'fatty food', 'eating too fast', 'stress', 'alcohol'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  heartburn: {
    relatedSymptoms: ['indigestion', 'nausea', 'chest discomfort'],
    possibleCauses: ['acid reflux', 'spicy food', 'large meals', 'lying down after eating', 'obesity', 'pregnancy'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['chest pain with shortness of breath', 'pain radiating to arm or jaw'],
  },
  bloating: {
    relatedSymptoms: ['gas', 'indigestion', 'constipation', 'stomach_ache', 'pms'],
    possibleCauses: ['gas', 'overeating', 'food intolerance', 'constipation', 'hormonal changes', 'swallowing air'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe abdominal distension', 'persistent bloating'],
  },
  gas: {
    relatedSymptoms: ['bloating', 'indigestion', 'constipation', 'stomach_ache'],
    possibleCauses: ['swallowing air', 'dietary fiber', 'food intolerance', 'digestive issues', 'carbonated drinks'],
    severityFlags: ['mild'],
    emergencyFlags: [],
  },
  constipation: {
    relatedSymptoms: ['bloating', 'gas', 'stomach_ache', 'irregular bowels'],
    possibleCauses: ['low fiber diet', 'dehydration', 'sedentary lifestyle', 'stress', 'medication side effects', 'travel'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe pain', 'blood in stool', 'complete blockage'],
  },
  diarrhea: {
    relatedSymptoms: ['dehydration', 'stomach_ache', 'nausea', 'fatigue'],
    possibleCauses: ['infection', 'food poisoning', 'food intolerance', 'stress', 'medication side effects'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['bloody diarrhea', 'severe dehydration', 'persistent diarrhea over 3 days'],
  },
  dehydration: {
    relatedSymptoms: ['headache', 'fatigue', 'dry_skin', 'low_energy', 'dizziness concern'],
    possibleCauses: ['insufficient water intake', 'excessive sweating', 'diarrhea', 'vomiting', 'fever', 'alcohol'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['severe dehydration with confusion', 'no urination for 8 hours', 'rapid heart rate'],
  },
  hangover: {
    relatedSymptoms: ['dehydration', 'headache', 'nausea', 'fatigue', 'low_energy', 'brain_fog'],
    possibleCauses: ['alcohol consumption', 'dehydration', 'toxic byproducts', 'sleep disruption'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  back_pain: {
    relatedSymptoms: ['muscle_pain', 'neck_pain', 'shoulder_pain', 'sciatica concern', 'joint_pain'],
    possibleCauses: ['muscle strain', 'poor posture', 'sedentary lifestyle', 'heavy lifting', 'injury', 'prolonged sitting'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['loss of bladder control', 'sudden severe back pain', 'back pain with fever', 'numbness in legs'],
  },
  neck_pain: {
    relatedSymptoms: ['back_pain', 'shoulder_pain', 'headache', 'stress', 'muscle_pain'],
    possibleCauses: ['poor posture', 'tech neck', 'muscle strain', 'sleep position', 'stress', 'injury'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['neck pain with fever and stiff neck', 'neck pain after injury'],
  },
  shoulder_pain: {
    relatedSymptoms: ['neck_pain', 'back_pain', 'muscle_pain', 'stress'],
    possibleCauses: ['muscle strain', 'poor posture', 'overuse', 'injury', 'frozen shoulder', 'stress'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['sudden shoulder pain with chest discomfort', 'shoulder pain after injury'],
  },
  muscle_pain: {
    relatedSymptoms: ['joint_pain', 'back_pain', 'fatigue', 'dehydration', 'leg_pain'],
    possibleCauses: ['overexertion', 'exercise', 'dehydration', 'poor posture', 'strain', 'viral illness'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe muscle pain with dark urine', 'muscle pain with fever'],
  },
  joint_pain: {
    relatedSymptoms: ['muscle_pain', 'fatigue', 'knee_pain', 'back_pain', 'inflammation concern'],
    possibleCauses: ['arthritis', 'overuse', 'injury', 'inflammation', 'age-related wear', 'weather changes'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['hot swollen joint', 'joint pain with fever'],
  },
  leg_pain: {
    relatedSymptoms: ['muscle_pain', 'fatigue', 'dehydration', 'knee_pain', 'cramp concern'],
    possibleCauses: ['muscle strain', 'overuse', 'dehydration', 'cramping', 'prolonged standing', 'exercise'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['leg pain with swelling and redness', 'sudden severe calf pain'],
  },
  knee_pain: {
    relatedSymptoms: ['leg_pain', 'joint_pain', 'muscle_pain'],
    possibleCauses: ['overuse', 'injury', 'arthritis', 'running', 'aging', 'poor biomechanics'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['knee pain after serious injury', 'inability to bear weight'],
  },
  eye_strain: {
    relatedSymptoms: ['headache', 'eye_pain', 'dry_skin', 'fatigue', 'neck_pain'],
    possibleCauses: ['screen time', 'reading', 'poor lighting', 'uncorrected vision', 'dry air'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['sudden vision changes', 'eye pain with nausea'],
  },
  eye_pain: {
    relatedSymptoms: ['eye_strain', 'headache', 'sinus_pressure', 'dry_skin'],
    possibleCauses: ['eye strain', 'sinus pressure', 'dry eyes', 'infection', 'injury', 'allergies'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['sudden severe eye pain', 'vision loss', 'eye injury'],
  },
  ear_pain: {
    relatedSymptoms: ['cold', 'sinus_pressure', 'congestion', 'sore_throat'],
    possibleCauses: ['ear infection', 'sinus congestion', 'cold', 'pressure changes', 'swimmer ear'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe ear pain with fever', 'fluid drainage', 'hearing loss'],
  },
  skin_rash: {
    relatedSymptoms: ['dry_skin', 'acne', 'allergy concern'],
    possibleCauses: ['allergies', 'irritants', 'infection', 'dry skin', 'heat', 'autoimmune response'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['rash with fever', 'sudden widespread rash', 'rash with difficulty breathing'],
  },
  dry_skin: {
    relatedSymptoms: ['skin_rash', 'dehydration', 'acne'],
    possibleCauses: ['dehydration', 'cold weather', 'low humidity', 'hot showers', 'harsh soaps', 'aging'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  acne: {
    relatedSymptoms: ['skin_rash', 'stress', 'pms', 'hormonal imbalance'],
    possibleCauses: ['hormonal changes', 'stress', 'diet', 'skincare products', 'genetics', 'bacteria'],
    severityFlags: ['mild', 'moderate', 'severe'],
    emergencyFlags: ['severe cystic acne', 'acne with fever'],
  },
  period_cramps: {
    relatedSymptoms: ['pms', 'back_pain', 'fatigue', 'bloating', 'headache', 'low_energy'],
    possibleCauses: ['menstruation', 'prostaglandin release', 'uterine contractions', 'hormonal changes'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: ['severe pelvic pain', 'heavy bleeding', 'missed period with severe pain'],
  },
  pms: {
    relatedSymptoms: ['period_cramps', 'bloating', 'fatigue', 'acne', 'headache', 'mood changes', 'insomnia'],
    possibleCauses: ['hormonal changes', 'menstrual cycle', 'progesterone changes', 'serotonin fluctuations'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
  menopause: {
    relatedSymptoms: ['insomnia', 'fatigue', 'anxiety', 'mood changes', 'hot flashes', 'dry_skin'],
    possibleCauses: ['hormonal changes', 'aging', 'estrogen decline', 'life transition'],
    severityFlags: ['mild', 'moderate'],
    emergencyFlags: [],
  },
};

export function getSymptomGraph() {
  return SYMPTOM_GRAPH;
}

export function getSymptomGraphEntry(symptomId) {
  return SYMPTOM_GRAPH[symptomId] || null;
}
