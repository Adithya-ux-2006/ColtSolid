export const CLOT_SYMPTOMS = {
  dvt: {
    name: 'Deep Vein Thrombosis (DVT)',
    plainName: 'Blood clot in a deep vein, usually in the leg',
    warningSigns: [
      'Swelling in one leg, ankle or foot',
      'Pain or tenderness in the leg, often starting in the calf',
      'Skin that feels warm to the touch',
      'Redness or discolouration of the skin',
      'Visible veins that are larger than normal',
    ],
    seekAdviceIf: [
      'The swelling came on suddenly',
      'The pain gets worse when you stand or walk',
      'You have recently had surgery, a long flight or been bedridden',
      'You have a history of blood clots',
    ],
  },
  pe: {
    name: 'Pulmonary Embolism (PE)',
    plainName: 'A blood clot that has travelled to the lungs',
    warningSigns: [
      'Sudden difficulty breathing',
      'Sharp chest pain that gets worse when you breathe in',
      'Coughing up blood',
      'Rapid heartbeat',
      'Feeling dizzy or fainting',
      'Unexplained anxiety',
    ],
    seekAdviceIf: [
      'Any of these symptoms appear suddenly',
      'You have symptoms of DVT plus breathing problems',
      'You have recently had surgery or been immobile',
    ],
  },
  emergency: {
    name: 'Medical Emergency',
    plainName: 'Call for help immediately',
    signs: [
      'Sudden difficulty breathing or chest pain',
      'Coughing up blood',
      'Fainting or loss of consciousness',
      'Severe weakness on one side of the body',
      'Sudden confusion or trouble speaking',
    ],
  },
};

export const PLAIN_LANGUAGE_TERMS = {
  thrombosis: 'a blood clot inside a blood vessel',
  'deep vein thrombosis': 'a blood clot in a deep vein, usually in the leg',
  dvt: 'a blood clot in a deep vein, usually in the leg',
  'pulmonary embolism': 'a blood clot that has travelled to the lungs',
  pe: 'a blood clot that has travelled to the lungs',
  anticoagulant: 'blood-thinning medicine prescribed by a doctor',
  'clot migration': 'the clot may move to another part of the body',
  edema: 'swelling',
  dyspnea: 'difficulty breathing',
  erythema: 'redness of the skin',
  'compression ultrasound': 'an ultrasound scan used to check the veins',
  prophylaxis: 'steps or treatment used to prevent a clot',
  ambulation: 'walking or moving around',
  thrombus: 'a blood clot',
  embolism: 'a blockage, usually caused by a blood clot that has moved from elsewhere',
  'venous': 'related to veins',
  'arterial': 'related to arteries',
  'hemostasis': 'the process where blood stops flowing after an injury',
};

export const RISK_RESULTS = {
  low: {
    heading: 'No strong warning signs found',
    text: 'Your answers do not show strong warning signs of a blood clot right now. This result is only a basic screening and is not a medical diagnosis. Speak to a doctor if your symptoms continue, become worse or concern you.',
    nextSteps: [
      'Keep track of any new or changing symptoms',
      'Avoid sitting still for very long periods',
      'Move and stretch regularly when it is safe to do so',
      'Follow any treatment already prescribed by your doctor',
      'Arrange a medical check-up if symptoms continue',
    ],
  },
  moderate: {
    heading: 'Medical advice is recommended',
    text: 'Some of your answers may need medical attention. This does not confirm that you have a blood clot, but you should speak to a doctor soon, especially if the symptoms are new or getting worse.',
    nextSteps: [
      'Contact a doctor or medical centre',
      'Explain when the symptoms started',
      'Mention recent surgery, long travel, pregnancy, injury or previous blood clots',
      'Do not massage a swollen or painful leg',
      'Do not take blood-thinning medicine unless a doctor has prescribed it',
    ],
  },
  high: {
    heading: 'Urgent medical assessment needed',
    text: 'Your answers include warning signs that should be checked urgently. A questionnaire cannot confirm a blood clot. Please visit an emergency department or urgent medical centre now.',
    nextSteps: [
      'Visit an emergency department or urgent care centre',
      'Do not drive yourself — ask someone to take you',
      'Tell the doctor about all your symptoms',
      'Mention any risk factors like recent surgery or travel',
    ],
  },
  emergency: {
    heading: 'Get emergency help now',
    text: 'Sudden difficulty breathing, chest pain, coughing up blood, fainting or severe weakness can be signs of a medical emergency. Call emergency services immediately.',
    emergencyNumber: '112',
  },
};

export const PREVENTION_TIPS = [
  'Move regularly during long periods of sitting',
  'Take walking breaks during long journeys when possible',
  'Drink enough water unless a doctor has restricted your fluids',
  'Follow your doctor\'s instructions after surgery or hospital treatment',
  'Take prescribed medicine exactly as directed',
  'Discuss personal risk factors with a healthcare professional',
  'Avoid smoking and seek professional support to stop',
  'Maintain regular physical activity suitable for your health',
];

export const MEDICAL_DISCLAIMER = {
  main: 'ClotSolid provides general educational information and a basic symptom screening. It cannot diagnose or rule out a blood clot. Only a qualified healthcare professional can assess your symptoms and arrange the correct tests.',
  emergency: 'Do not delay emergency care because of a result shown on this website.',
};
