export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'transgender-male', label: 'Transgender Male' },
  { value: 'transgender-female', label: 'Transgender Female' },
  { value: 'intersex', label: 'Intersex' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const CONDITIONS = [
  { value: 'headache', label: 'Headaches / Migraines', emoji: '🤕' },
  { value: 'cold', label: 'Cold & Flu', emoji: '🤧' },
  { value: 'anxiety', label: 'Anxiety & Stress', emoji: '😰' },
  { value: 'insomnia', label: 'Sleep Issues / Insomnia', emoji: '😴' },
  { value: 'nausea', label: 'Nausea / Digestive Issues', emoji: '🤢' },
  { value: 'muscle-pain', label: 'Muscle Pain / Body Aches', emoji: '💪' },
  { value: 'menstrual', label: 'Menstrual Discomfort', emoji: '🩸' },
  { value: 'respiratory', label: 'Respiratory Issues', emoji: '🫁' },
  { value: 'fatigue', label: 'Brain Fog / Fatigue', emoji: '🧠' },
  { value: 'none', label: 'None of the above', emoji: '😶' },
];

export const ALLERGIES = [
  { value: 'pollen', label: 'Pollen / Seasonal', emoji: '🌿' },
  { value: 'nuts', label: 'Nuts (peanut, tree nuts)', emoji: '🥜' },
  { value: 'gluten', label: 'Gluten / Wheat', emoji: '🌾' },
  { value: 'dairy', label: 'Dairy / Lactose', emoji: '🥛' },
  { value: 'fish', label: 'Fish / Shellfish', emoji: '🐟' },
  { value: 'herbal', label: 'Herbal Supplements', emoji: '🌱' },
  { value: 'antibiotics', label: 'Penicillin / Antibiotics', emoji: '💊' },
  { value: 'insect', label: 'Bee stings / Insect venom', emoji: '🐝' },
  { value: 'none', label: 'No known allergies', emoji: '🚫' },
];

export const PREFS = [
  { value: 'natural', label: 'Natural & herbal first', emoji: '🌿' },
  { value: 'conventional', label: 'Conventional medicine', emoji: '🏥' },
  { value: 'tcm', label: 'Traditional (TCM / Ayurveda)', emoji: '☯️' },
  { value: 'open', label: 'Open to everything', emoji: '⚖️' },
  { value: 'budget', label: 'Budget-friendly options', emoji: '💸' },
  { value: 'vegan', label: 'Vegan / Plant-based only', emoji: '🥗' },
  { value: 'fast', label: 'Fast-acting relief', emoji: '⚡' },
  { value: 'research', label: 'Evidence / Research-backed', emoji: '🔬' },
];

export const FAQ_ITEMS = [
  {
    question: 'Are these remedies safe to use?',
    answer: 'All remedies on ClotSolid are sourced from peer-reviewed research and traditional medical literature. However, they are informational only and not a substitute for professional medical advice. Always consult a doctor before starting any new treatment, especially if you have existing conditions or take medication.',
  },
  {
    question: 'Can I use ClotSolid instead of seeing a doctor?',
    answer: 'No. ClotSolid is designed to help you understand your options before a doctor visit, not replace one. If your symptoms are severe, persistent, or worsening, please seek professional medical care immediately.',
  },
  {
    question: 'Where does the research come from?',
    answer: 'Our remedy database is built from NIH studies, PubMed meta-analyses, WHO guidelines, and established traditional medicine references including TCM and Ayurveda texts. Each remedy card links to its source research.',
  },
  {
    question: 'How are remedies personalized to me?',
    answer: 'When you complete the onboarding questionnaire, we use your common conditions, allergies, and treatment preferences to prioritize relevant remedies and flag ones that may not suit you.',
  },
  {
    question: 'Is my health data private?',
    answer: 'Yes. Your allergy and condition data is stored securely in our database and never shared with third parties. We do not sell user data. You can delete your account and all associated data at any time from your Profile page.',
  },
  {
    question: 'How do I save a remedy?',
    answer: 'Tap the heart icon on any remedy card or on the Remedy Detail page. If you are signed in, it saves to Favorites. If not, you can quick-save it with your email and finish creating an account later.',
  },
  {
    question: 'What do the warning badges mean?',
    answer: 'If a remedy contains an ingredient that matches an allergy you reported during onboarding, a yellow warning badge appears on that card. This does not mean you cannot use the remedy - it means you should review the ingredients carefully and consult a doctor if unsure.',
  },
  {
    question: 'Which countries is ClotSolid available in?',
    answer: 'ClotSolid is available globally. Remedy content is in English. We include both Western conventional medicine and traditional systems including TCM and Ayurveda to serve users across different cultural health contexts.',
  },
];

const PREF_TO_FILTER = {
  natural: 'Natural',
  conventional: 'Conventional',
  tcm: 'TCM',
};

export function mapTreatmentPrefsToFilters(prefs = []) {
  const mapped = prefs
    .map((pref) => PREF_TO_FILTER[pref])
    .filter(Boolean);

  return [...new Set(mapped)];
}
