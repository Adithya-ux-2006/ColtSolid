import { UNIVERSAL_EMERGENCY_FLAGS } from '../constants/emergency';

export const SYMPTOMS = [
  {
    id: 'headache', label: 'Headache', emoji: '🤕', color: 'forest',
    medicalCareWarnings: [
      'Sudden, severe "thunderclap" headache (worst of your life)',
      'Headache with a fever and stiff neck',
      'Headache after a head injury',
      'Vision changes, weakness, or slurred speech with a headache',
      'New confusion or a change in behaviour with a headache',
    ],
  },
  {
    id: 'migraine', label: 'Migraine', emoji: '🤕', color: 'forest',
    medicalCareWarnings: [
      'Sudden, severe "thunderclap" headache',
      'Migraine with a new or prolonged aura',
      'Headache with a fever and stiff neck',
      'Weakness, vision loss, or slurred speech with a headache',
      'Headache that wakes you from sleep or worsens with activity',
    ],
  },
  {
    id: 'cold', label: 'Cold', emoji: '🤧', color: 'sage',
    medicalCareWarnings: [
      'High fever over 103°F (39.4°C)',
      'Difficulty breathing or wheezing',
      'Symptoms lasting more than 10 days or getting worse',
      'Severe headache, sinus pain, or ear pain',
      'Cold symptoms in a baby under 3 months old',
    ],
  },
  { id: 'cough', label: 'Cough', emoji: '🤧', color: 'sage', medicalCareWarnings: [
    'Coughing up blood',
    'Difficulty breathing or shortness of breath',
    'A cough lasting more than 3 weeks',
    'High fever with shaking chills',
    'Coughing with chest pain, fainting, or weight loss',
  ] },
  { id: 'congestion', label: 'Congestion', emoji: '🫁', color: 'sage' },
  { id: 'sinus_pressure', label: 'Sinus Pressure', emoji: '😤', color: 'amber', medicalCareWarnings: [
    'High fever',
    'Swelling or redness around the eyes',
    'A severe headache',
    'Vision changes',
  ] },
  {
    id: 'anxiety', label: 'Anxious', emoji: '😰', color: 'amber',
    medicalCareWarnings: [
      'Thoughts of harming yourself or suicidal thoughts',
      'Chest pain or pressure with a racing heart',
      'A panic attack that does not ease',
      'Feeling faint, confused, or unable to stay awake',
    ],
  },
  { id: 'insomnia', label: 'Insomnia', emoji: '😴', color: 'forest' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢', color: 'sage', medicalCareWarnings: [
    'Persistent vomiting (unable to keep fluids down)',
    'Vomiting blood or material that looks like coffee grounds',
    'Severe abdominal pain',
    'Signs of dehydration (dark urine, dizziness, no urine for 8+ hours)',
  ] },
  {
    id: 'stress', label: 'Stress', emoji: '😤', color: 'amber',
    medicalCareWarnings: [
      'Thoughts of harming yourself or suicidal thoughts',
      'Chest pain or pressure',
      'A racing heart that does not settle',
      'Feeling unable to cope or keep yourself safe',
    ],
  },
  { id: 'burnout', label: 'Burnout', emoji: '😮‍💨', color: 'amber', medicalCareWarnings: [
    'Thoughts of harming yourself or suicidal thoughts',
    'Chest pain or pressure',
  ] },
  { id: 'brain_fog', label: 'Brain Fog', emoji: '🌫️', color: 'amber' },
  { id: 'back_pain', label: 'Back Pain', emoji: '💪', color: 'forest', medicalCareWarnings: [
    'Loss of bladder or bowel control',
    'Numbness or tingling in the groin or legs',
    'Fever or chills with back pain',
    'Sudden severe pain after a fall or injury',
  ] },
  { id: 'neck_pain', label: 'Neck Pain', emoji: '🧘', color: 'amber', medicalCareWarnings: [
    'Neck pain with a fever and stiff neck',
    'Neck pain after a fall or injury',
    'Difficulty swallowing or breathing',
    'Numbness or weakness in the arms or legs',
  ] },
  { id: 'shoulder_pain', label: 'Shoulder Pain', emoji: '💪', color: 'forest', medicalCareWarnings: [
    'Shoulder pain with chest pain, shortness of breath, or dizziness',
    'Fever with a red, swollen shoulder',
    'Severe pain or deformity after a fall',
    'Inability to lift or move the arm',
  ] },
  { id: 'joint_pain', label: 'Joint Pain', emoji: '🦶', color: 'forest', medicalCareWarnings: [
    'A hot, red, swollen joint with a fever',
    'Inability to bear weight on the joint',
    'Sudden severe pain after an injury',
    'Deformity or locking of the joint',
  ] },
  { id: 'muscle_pain', label: 'Muscle Pain', emoji: '💪', color: 'forest', medicalCareWarnings: [
    'Chest pain or pressure',
    'Very dark or brown urine',
    'Severe weakness or inability to move a limb',
    'Fever with severe muscle pain',
  ] },
  { id: 'leg_pain', label: 'Leg Pain', emoji: '🦵', color: 'forest', medicalCareWarnings: [
    'Sudden severe swelling and pain in one leg (possible blood clot)',
    'Chest pain or shortness of breath with leg pain',
    'Inability to bear weight after an injury',
    'Numbness or weakness in the leg',
  ] },
  { id: 'knee_pain', label: 'Knee Pain', emoji: '🦵', color: 'sage', medicalCareWarnings: [
    'Fever with a red, swollen, warm knee',
    'Inability to bear weight',
    'A knee that locks or gives way',
    'Severe pain after an injury',
  ] },
  { id: 'eye_pain', label: 'Eye Pain', emoji: '👁️', color: 'forest', medicalCareWarnings: [
    'Sudden vision loss or changes in vision',
    'Severe eye pain with nausea or vomiting',
    'Eye injury or chemical exposure',
    'Seeing halos around lights',
    'One pupil larger than the other',
  ] },
  { id: 'eye_strain', label: 'Eye Strain', emoji: '👀', color: 'amber', medicalCareWarnings: [
    'Sudden vision loss or changes in vision',
    'Eye pain with nausea or vomiting',
    'Double vision',
    'Eye injury',
  ] },
  { id: 'ear_pain', label: 'Ear Pain', emoji: '👂', color: 'forest', medicalCareWarnings: [
    'Severe pain with a high fever',
    'Discharge from the ear',
    'Sudden hearing loss',
    'Ear pain in a baby under 6 months old',
  ] },
  { id: 'sore_throat', label: 'Sore Throat', emoji: '🗣️', color: 'sage', medicalCareWarnings: [
    'Difficulty breathing or swallowing',
    'Drooling or a muffled voice',
    'Severe pain with a fever',
    'A stiff neck or rash with a sore throat',
  ] },
  { id: 'period_cramps', label: 'Period Cramps', emoji: '🌙', color: 'forest', medicalCareWarnings: [
    'Severe pelvic pain not relieved by medication',
    'Heavy bleeding (soaking through a pad hourly)',
    'Fever or unusual discharge with pelvic pain',
    'Dizziness or fainting with bleeding',
  ] },
  { id: 'pms', label: 'PMS', emoji: '🌙', color: 'forest' },
  { id: 'menopause', label: 'Menopause', emoji: '🌸', color: 'amber' },
  { id: 'fever', label: 'Fever', emoji: '🌡️', color: 'amber', medicalCareWarnings: [
    'Fever over 103°F (39.4°C)',
    'Fever with a stiff neck or severe headache',
    'Fever with a rash',
    'Fever with confusion or unusual drowsiness',
    'Fever in a baby under 3 months old',
  ] },
  { id: 'skin_rash', label: 'Skin Rash', emoji: '🩹', color: 'sage', medicalCareWarnings: [
    'Rash with a fever or stiff neck',
    'Sudden, rapidly spreading rash',
    'Difficulty breathing with a rash',
    'Rash that turns black or looks bruised',
  ] },
  { id: 'dry_skin', label: 'Dry Skin', emoji: '🧴', color: 'sage' },
  { id: 'acne', label: 'Acne', emoji: '🧏', color: 'sage' },
  { id: 'bloating', label: 'Bloating', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'Severe or persistent abdominal pain',
    'Blood in the stool',
    'Unexplained weight loss',
    'Persistent vomiting',
    'Bloating with a fever',
  ] },
  { id: 'indigestion', label: 'Indigestion', emoji: '🍽️', color: 'amber', medicalCareWarnings: [
    'Difficulty swallowing or pain with swallowing',
    'Vomiting blood or black, tarry stools',
    'Chest pain or pressure',
    'Unexplained weight loss',
  ] },
  { id: 'heartburn', label: 'Heartburn', emoji: '🔥', color: 'amber', medicalCareWarnings: [
    'Difficulty swallowing or pain with swallowing',
    'Vomiting blood or black, tarry stools',
    'Chest pain or pressure',
    'Unexplained weight loss',
  ] },
  { id: 'constipation', label: 'Constipation', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'Severe or worsening abdominal pain',
    'Blood in the stool',
    'Unable to pass gas or stool (possible blockage)',
    'Constipation with vomiting or weight loss',
  ] },
  { id: 'diarrhea', label: 'Diarrhea', emoji: '💧', color: 'sage', medicalCareWarnings: [
    'Blood or pus in the stool',
    'Diarrhea lasting more than 3 days',
    'Signs of dehydration (dry mouth, no urine, dizziness)',
    'High fever with diarrhea',
  ] },
  { id: 'stomach_ache', label: 'Stomach Ache', emoji: '🤕', color: 'sage', medicalCareWarnings: [
    'Severe or worsening abdominal pain',
    'Vomiting blood or blood in the stool',
    'Persistent vomiting',
    'Fever with abdominal pain',
    'A swollen, tender belly',
  ] },
  { id: 'gas', label: 'Gas', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'Severe or persistent abdominal pain',
    'Bloating with persistent vomiting',
    'Fever with abdominal pain',
  ] },
  { id: 'hangover', label: 'Hangover', emoji: '🥴', color: 'amber' },
  { id: 'fatigue', label: 'Fatigue', emoji: '🔋', color: 'forest' },
  { id: 'low_energy', label: 'Low Energy', emoji: '🔋', color: 'forest' },
  { id: 'dehydration', label: 'Dehydration', emoji: '💧', color: 'amber', medicalCareWarnings: [
    'Confusion or unusual drowsiness',
    'No urination for 8 or more hours',
    'Dizziness or fainting when standing',
    'A rapid heartbeat or rapid breathing',
  ] },

  { id: 'allergies', label: 'Allergies', emoji: '🤧', color: 'sage', medicalCareWarnings: [
    'Difficulty breathing or wheezing',
    'Swelling of the lips, tongue, or throat',
    'Dizziness or fainting',
  ] },
  { id: 'asthma', label: 'Asthma', emoji: '🫁', color: 'amber', medicalCareWarnings: [
    'Severe breathlessness at rest',
    'Blue or grey lips or fingernails',
    'Symptoms not relieved by a quick-relief inhaler',
    'Difficulty speaking full sentences',
  ] },
  { id: 'hives', label: 'Hives', emoji: '🩹', color: 'sage', medicalCareWarnings: [
    'Swelling of the lips, tongue, or throat',
    'Difficulty breathing',
    'Dizziness or fainting',
  ] },
  { id: 'allergic_reaction', label: 'Allergic Reaction', emoji: '⚠️', color: 'amber', medicalCareWarnings: [
    'Difficulty breathing or wheezing',
    'Swelling of the lips, tongue, or throat',
    'Dizziness, fainting, or a rapid heartbeat',
    'Hives with breathing trouble (possible anaphylaxis)',
  ] },

  { id: 'uti', label: 'Urinary Tract Infection', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'Fever and chills',
    'Pain in the back or flank',
    'Blood in the urine',
    'Confusion (especially in older adults)',
  ] },
  { id: 'kidney_stone', label: 'Kidney Stone', emoji: '💎', color: 'amber', medicalCareWarnings: [
    'Severe pain with fever and chills',
    'Inability to urinate',
    'Blood in the urine with severe pain',
    'Nausea or vomiting with severe pain',
  ] },
  { id: 'frequent_urination', label: 'Frequent Urination', emoji: '🚻', color: 'sage' },
  { id: 'urinary_incontinence', label: 'Urinary Incontinence', emoji: '🫧', color: 'sage' },

  { id: 'yeast_infection', label: 'Yeast Infection', emoji: '🫧', color: 'sage' },
  { id: 'prostate_issues', label: 'Prostate Issues', emoji: '🫧', color: 'forest', medicalCareWarnings: [
    'Inability to urinate',
    'Blood in the urine',
    'Fever with pain or burning',
  ] },
  { id: 'testicular_pain', label: 'Testicular Pain', emoji: '😣', color: 'forest', medicalCareWarnings: [
    'Sudden, severe testicular pain (possible torsion — an emergency)',
    'Nausea or vomiting with testicular pain',
    'Fever or swelling',
  ] },
  { id: 'pelvic_pain', label: 'Pelvic Pain', emoji: '🤕', color: 'forest', medicalCareWarnings: [
    'Severe or sudden pelvic pain',
    'Fever',
    'Heavy or unusual bleeding',
    'Dizziness or fainting (possible ectopic pregnancy)',
  ] },
  { id: 'breast_pain', label: 'Breast Pain', emoji: '🤕', color: 'sage' },
  { id: 'endometriosis', label: 'Endometriosis', emoji: '🌸', color: 'forest', medicalCareWarnings: [
    'Severe pelvic pain not relieved by medication',
    'Fever',
    'Heavy bleeding',
    'Dizziness or fainting with bleeding',
  ] },

  { id: 'toothache', label: 'Toothache', emoji: '🦷', color: 'amber', medicalCareWarnings: [
    'Swelling in the face, jaw, or mouth',
    'Difficulty breathing or swallowing',
    'High fever',
    'A cracked or knocked-out tooth with severe pain',
  ] },
  { id: 'canker_sore', label: 'Canker Sore', emoji: '👄', color: 'sage' },
  { id: 'gum_pain', label: 'Gum Pain', emoji: '🦷', color: 'amber' },
  { id: 'bad_breath', label: 'Bad Breath', emoji: '👄', color: 'sage' },
  { id: 'tmj_pain', label: 'Jaw Pain', emoji: '😬', color: 'forest' },
  { id: 'dry_mouth', label: 'Dry Mouth', emoji: '💧', color: 'sage' },
  { id: 'cold_sore', label: 'Cold Sore', emoji: '👄', color: 'sage' },

  { id: 'ankle_pain', label: 'Ankle Pain', emoji: '🦶', color: 'forest', medicalCareWarnings: [
    'Inability to bear weight',
    'Severe swelling or deformity',
    'Numbness below the ankle',
    'Fever or redness after an open wound',
  ] },
  { id: 'wrist_pain', label: 'Wrist Pain', emoji: '🤚', color: 'forest', medicalCareWarnings: [
    'Deformity or inability to move the wrist',
    'Severe swelling',
    'Numbness in the fingers',
    'Redness and swelling with a fever',
  ] },
  { id: 'hip_pain', label: 'Hip Pain', emoji: '🦵', color: 'forest', medicalCareWarnings: [
    'Inability to bear weight',
    'Fever with hip pain',
    'Sudden severe pain after a fall',
    'Pain with swelling, redness, or heat',
  ] },
  { id: 'elbow_pain', label: 'Elbow Pain', emoji: '💪', color: 'forest', medicalCareWarnings: [
    'Deformity or inability to straighten the elbow',
    'Numbness in the hand or fingers',
    'Redness and swelling with a fever',
    'Severe pain after a fall',
  ] },
  { id: 'foot_pain', label: 'Foot Pain', emoji: '🦶', color: 'forest', medicalCareWarnings: [
    'Inability to bear weight',
    'Numbness or loss of feeling (especially with diabetes)',
    'Redness, heat, or a fever after a wound',
    'Deformity or a bone poking through the skin',
  ] },
  { id: 'hand_pain', label: 'Hand Pain', emoji: '🤚', color: 'forest', medicalCareWarnings: [
    'Severe pain after an injury',
    'Numbness or tingling in the fingers',
    'Inability to move the fingers',
    'Redness and swelling with a fever',
  ] },

  { id: 'eczema', label: 'Eczema', emoji: '🩹', color: 'sage' },
  { id: 'psoriasis', label: 'Psoriasis', emoji: '🩹', color: 'sage' },
  { id: 'sunburn', label: 'Sunburn', emoji: '☀️', color: 'amber', medicalCareWarnings: [
    'Blistering over a large area',
    'Fever, chills, or confusion with sunburn',
    'Signs of dehydration',
    'Sunburn on an infant',
  ] },
  { id: 'fungal_infection', label: 'Fungal Infection', emoji: '🩹', color: 'sage' },
  { id: 'rosacea', label: 'Rosacea', emoji: '🧏', color: 'sage' },

  { id: 'sleep_apnea', label: 'Sleep Apnea', emoji: '😴', color: 'forest', medicalCareWarnings: [
    'Chest pain or an irregular heartbeat during the night',
    'Gasping or choking while sleeping',
    'Severe daytime sleepiness that interferes with daily life',
  ] },
  { id: 'restless_leg', label: 'Restless Legs', emoji: '🦵', color: 'forest' },
  { id: 'night_sweats', label: 'Night Sweats', emoji: '🌙', color: 'amber', medicalCareWarnings: [
    'Fever with night sweats',
    'Unexplained weight loss',
  ] },
  { id: 'teeth_grinding', label: 'Teeth Grinding', emoji: '🦷', color: 'amber' },

  { id: 'tinnitus', label: 'Tinnitus', emoji: '👂', color: 'amber', medicalCareWarnings: [
    'Sudden hearing loss',
    'Pulsatile tinnitus (a heartbeat sound in the ear)',
    'Tinnitus with dizziness, vertigo, or weakness in the face',
  ] },
  { id: 'vertigo', label: 'Vertigo', emoji: '😵', color: 'amber', medicalCareWarnings: [
    'Sudden, severe vertigo',
    'Vertigo with a headache, weakness, or trouble speaking',
    'Difficulty walking or standing',
    'Vertigo after a head injury',
  ] },
  { id: 'neuropathy', label: 'Nerve Pain / Tingling', emoji: '🦶', color: 'forest', medicalCareWarnings: [
    'Sudden weakness or paralysis',
    'Difficulty breathing',
    'Rapidly spreading numbness',
    'A foot injury you cannot feel',
  ] },
  { id: 'sciatica', label: 'Sciatica', emoji: '💪', color: 'forest', medicalCareWarnings: [
    'Loss of bladder or bowel control',
    'Numbness or tingling in the groin area',
    'Severe weakness in the leg',
    'Sudden severe pain after an injury',
  ] },

  { id: 'palpitations', label: 'Heart Palpitations', emoji: '💓', color: 'amber', medicalCareWarnings: [
    'Chest pain or pressure',
    'Fainting or near-fainting',
    'Shortness of breath',
    'Palpitations with dizziness or confusion',
  ] },
  { id: 'poor_circulation', label: 'Poor Circulation', emoji: '🥶', color: 'sage', medicalCareWarnings: [
    'Sudden pain, numbness, or paleness in a limb',
    'Chest pain or shortness of breath',
    'A non-healing sore with signs of infection',
  ] },
  { id: 'edema', label: 'Edema', emoji: '🦶', color: 'sage', medicalCareWarnings: [
    'Sudden swelling',
    'Difficulty breathing or chest pain',
    'Swelling in only one leg',
    'Swelling with shortness of breath when lying flat',
  ] },

  { id: 'anemia', label: 'Anemia', emoji: '🩸', color: 'amber', medicalCareWarnings: [
    'Chest pain or pressure',
    'Shortness of breath with minimal activity',
    'Fainting or severe dizziness',
    'A rapid or irregular heartbeat',
  ] },
  { id: 'arthritis', label: 'Arthritis', emoji: '🦴', color: 'forest', medicalCareWarnings: [
    'A hot, red, swollen joint with a fever',
    'Sudden severe pain or inability to move a joint',
    'Joint pain with a rash or vision changes',
  ] },
  { id: 'ibs', label: 'Irritable Bowel (IBS)', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'Blood in the stool',
    'Unexplained weight loss',
    'Persistent diarrhea, especially at night',
    'Fever with abdominal pain',
  ] },
  { id: 'hemorrhoids', label: 'Hemorrhoids', emoji: '😣', color: 'sage', medicalCareWarnings: [
    'Heavy or persistent rectal bleeding',
    'A large amount of blood in the stool',
    'Dizziness or fainting',
    'Severe pain',
  ] },
  { id: 'gerd', label: 'Acid Reflux', emoji: '🔥', color: 'amber', medicalCareWarnings: [
    'Difficulty swallowing or pain with swallowing',
    'Vomiting blood or black, tarry stools',
    'Chest pain or pressure',
    'Unexplained weight loss',
  ] },

  { id: 'hair_loss', label: 'Hair Loss', emoji: '🧑‍🦲', color: 'sage' },

  { id: 'sprain', label: 'Sprain', emoji: '🤕', color: 'forest', medicalCareWarnings: [
    'Severe pain or inability to bear weight',
    'Deformity or a bone poking through the skin',
    'Numbness or tingling below the injury',
    'Fever, redness, or heat around the joint',
  ] },
  { id: 'insect_bite', label: 'Insect Bite', emoji: '🦟', color: 'sage', medicalCareWarnings: [
    'Difficulty breathing or wheezing',
    'Swelling of the lips, face, or throat',
    'Fever or spreading redness',
    'Dizziness or fainting after the bite',
  ] },
  { id: 'minor_burn', label: 'Minor Burn', emoji: '🔥', color: 'amber', medicalCareWarnings: [
    'Burns to the face, hands, feet, genitals, or over a joint',
    'A burn larger than your palm',
    'Signs of infection (increasing pain, redness, or discharge)',
    'Difficulty breathing after smoke inhalation',
  ] },
  { id: 'bruising', label: 'Bruising', emoji: '🩹', color: 'sage', medicalCareWarnings: [
    'Frequent large bruises without a clear injury',
    'Bruising with bleeding from the gums or nose',
    'A bruise over the head with confusion, vomiting, or a severe headache',
  ] },

  { id: 'loss_of_appetite', label: 'Loss of Appetite', emoji: '🍽️', color: 'sage' },
  { id: 'chills', label: 'Chills', emoji: '🥶', color: 'amber', medicalCareWarnings: [
    'Fever over 103°F (39.4°C)',
    'A stiff neck or severe headache',
    'Difficulty breathing',
    'A rash with a fever',
  ] },
  { id: 'swollen_lymph_nodes', label: 'Swollen Lymph Nodes', emoji: '🫧', color: 'sage', medicalCareWarnings: [
    'A painful, hard, or rapidly growing lump',
    'Persistent swelling with a fever',
    'Unexplained weight loss',
  ] },

  // Sexual Wellness
  { id: 'low_libido', label: 'Low Libido', emoji: '💭', color: 'amber', medicalCareWarnings: [
    'Sudden loss of libido with chest pain, severe fatigue, or other new symptoms',
    'Low libido with depression or persistent mood changes',
  ] },
  { id: 'erectile_difficulty', label: 'Erectile Difficulty', emoji: '💙', color: 'sage', medicalCareWarnings: [
    'Sudden onset with chest pain',
    'Numbness or vision changes',
  ] },
  { id: 'vaginal_dryness', label: 'Vaginal Dryness', emoji: '🌸', color: 'forest' },
  { id: 'painful_intercourse', label: 'Painful Intercourse', emoji: '⚠️', color: 'amber' },
];

export function getMedicalCareWarnings(symptomId) {
  const symptom = SYMPTOMS.find((s) => s.id === symptomId);
  if (symptom?.medicalCareWarnings?.length) return symptom.medicalCareWarnings;
  return UNIVERSAL_EMERGENCY_FLAGS;
}
