// Mapping from UI condition values to contraindication terms used in remedy data
// This allows the filtering logic to correctly match user conditions to remedy contraindications

export const CONDITION_TO_CONTRAINDICATION_MAP = {
  'asthma': ['asthma', 'respiratory conditions', 'breathing difficulties'],
  'diabetes': ['diabetes', 'diabetes (consult doctor)', 'blood sugar'],
  'high-blood-pressure': ['high blood pressure', 'hypertension', 'cardiovascular disease', 'heart disease'],
  'heart-conditions': ['heart arrhythmia', 'heart disease', 'cardiovascular disease', 'congestive heart failure', 'coronary artery disease'],
  'ibs-digestive-issues': ['ibs', 'irritable bowel', 'bowel obstruction', 'digestive issues', 'gastrointestinal', 'esophageal stricture'],
  'anxiety': ['anxiety', 'panic disorder', 'mental health'],
  'depression': ['depression', 'mental health', 'mood disorders'],
  'pcos': ['pcos', 'polycystic ovary syndrome', 'hormonal imbalance'],
  'thyroid-disorders': ['thyroid conditions', 'thyroid disorders', 'hypothyroidism', 'hyperthyroidism', 'hashimoto', 'graves disease'],
  'migraines': ['migraines', 'headaches', 'headache disorders', 'neurological conditions'],
  'pregnancy': ['pregnancy', 'pregnant', 'breastfeeding'],
  'bleeding-disorders': ['bleeding conditions', 'bleeding disorders', 'anticoagulation', 'blood thinners'],
  'kidney-disease': ['kidney disease', 'kidney stones', 'renal impairment', 'kidney impairment'],
  'liver-disease': ['liver disease', 'hepatic impairment', 'liver impairment'],
  'epilepsy': ['seizure disorders', 'epilepsy', 'seizures'],
  'glaucoma': ['glaucoma', 'eye pressure', 'intraocular pressure'],
  'osteoporosis': ['osteoporosis', 'bone density', 'bone loss'],
  'cancer': ['cancer', 'malignancy', 'chemotherapy', 'radiation'],
  'autoimmune': ['autoimmune', 'immunocompromised', 'immune system disorders'],
  'stroke': ['stroke', 'cerebrovascular accident', 'cva', 'transient ischemic attack'],
  'high-cholesterol': ['high cholesterol', 'hyperlipidemia', 'dyslipidemia', 'cardiovascular disease'],
  'gerd': ['gerd', 'acid reflux', 'heartburn', 'esophageal stricture', 'reflux'],
  'sleep-apnea': ['sleep apnea', 'breathing difficulties', 'respiratory conditions'],
  'depression': ['depression', 'mood disorders', 'mental health'],
  'bipolar': ['bipolar', 'mood disorders', 'mental health'],
  'schizophrenia': ['schizophrenia', 'psychosis', 'mental health'],
  'adhd': ['adhd', 'attention deficit', 'mental health'],
  'autism': ['autism', 'autism spectrum', 'neurodevelopmental'],
  'dementia': ['dementia', 'cognitive impairment', 'alzheimer'],
  'parkinsons': ['parkinsons', 'parkinson disease', 'movement disorders'],
  'multiple-sclerosis': ['multiple sclerosis', 'ms', 'autoimmune', 'neurological conditions'],
  'lupus': ['lupus', 'sle', 'autoimmune', 'systemic lupus erythematosus'],
  'rheumatoid-arthritis': ['rheumatoid arthritis', 'autoimmune', 'joint inflammation'],
  'celiac': ['celiac', 'gluten intolerance', 'celiac disease', 'digestive issues'],
  'crohns': ["crohn's", 'crohns', 'inflammatory bowel disease', 'ibd', 'digestive issues'],
  'ulcerative-colitis': ['ulcerative colitis', 'inflammatory bowel disease', 'ibd', 'digestive issues'],
  'endometriosis': ['endometriosis', 'pelvic pain', 'reproductive conditions'],
  'pcos': ['pcos', 'polycystic ovary syndrome', 'hormonal imbalance', 'reproductive conditions'],
  'infertility': ['infertility', 'reproductive conditions'],
  'erectile-dysfunction': ['erectile dysfunction', 'sexual dysfunction', 'cardiovascular disease'],
  'low-testosterone': ['low testosterone', 'hormonal imbalance', 'endocrine disorders'],
  'menopause': ['menopause', 'hormonal changes', 'hot flashes'],
  'pms': ['pms', 'premenstrual syndrome', 'menstrual conditions'],
  'menorrhagia': ['menorrhagia', 'heavy menstrual bleeding', 'menstrual conditions'],
};

// Reverse map for debugging - which contraindications map to which conditions
export function getContraindicationsForCondition(conditionValue) {
  return CONDITION_TO_CONTRAINDICATION_MAP[conditionValue] || [];
}

// Normalize a condition value for matching
export function normalizeConditionValue(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

// Check if a user condition matches a remedy contraindication
export function conditionMatchesContraindication(userCondition, contraindication) {
  const normalizedUser = normalizeConditionValue(userCondition);
  const normalizedContra = contraindication.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  
  // Direct substring match
  if (normalizedContra.includes(normalizedUser) || normalizedUser.includes(normalizedContra)) {
    return true;
  }
  
  // Check mapped contraindications
  const mapped = CONDITION_TO_CONTRAINDICATION_MAP[userCondition];
  if (mapped) {
    return mapped.some(m => {
      const normM = m.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      return normM === normalizedContra || normM.includes(normalizedContra) || normalizedContra.includes(normM);
    });
  }
  
  return false;
}