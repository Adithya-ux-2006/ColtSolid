const ALIAS_MAP = {
  'blocked nose': 'congestion',
  'stuffed nose': 'congestion',
  'stuffy nose': 'congestion',
  'nasal congestion': 'congestion',
  'nose blocked': 'congestion',
  'clogged nose': 'congestion',
  'can\'t breathe nose': 'congestion',
  'nose stuffy': 'congestion',
  'mental fog': 'brain_fog',
  'can\'t focus': 'brain_fog',
  'cant focus': 'brain_fog',
  'can\'t think': 'brain_fog',
  'cant think': 'brain_fog',
  'foggy head': 'brain_fog',
  'cloudy head': 'brain_fog',
  'mental clarity': 'brain_fog',
  'hard to concentrate': 'brain_fog',
  'scatterbrained': 'brain_fog',
  'spaced out': 'brain_fog',
  'lack of focus': 'brain_fog',
  'cloudy mind': 'brain_fog',
  'eye pain': 'eye_pain',
  'eyes hurt': 'eye_pain',
  'hurting eyes': 'eye_pain',
  'eye ache': 'eye_pain',
  'pain in eye': 'eye_pain',
  'pain in eyes': 'eye_pain',
  'eye hurt': 'eye_pain',
  'sore eyes': 'eye_pain',
  'burning eyes': 'eye_pain',
  'stinging eyes': 'eye_pain',
  'back pain': 'back_pain',
  'backache': 'back_pain',
  'lower back': 'back_pain',
  'back hurt': 'back_pain',
  'back ache': 'back_pain',
  'sore back': 'back_pain',
  'lower back pain': 'back_pain',
  'leg pain': 'leg_pain',
  'leg hurt': 'leg_pain',
  'leg ache': 'leg_pain',
  'leg cramp': 'leg_pain',
  'shin splints': 'leg_pain',
  'cramp in leg': 'leg_pain',
  'sore leg': 'leg_pain',
  'knee pain': 'knee_pain',
  'knee hurt': 'knee_pain',
  'knee ache': 'knee_pain',
  'sore knee': 'knee_pain',
  'pain in knee': 'knee_pain',
  'neck pain': 'neck_pain',
  'neck hurt': 'neck_pain',
  'stiff neck': 'neck_pain',
  'cervical pain': 'neck_pain',
  'sore neck': 'neck_pain',
  'pain in neck': 'neck_pain',
  'shoulder pain': 'shoulder_pain',
  'shoulder hurt': 'shoulder_pain',
  'sore shoulder': 'shoulder_pain',
  'frozen shoulder': 'shoulder_pain',
  'pain in shoulder': 'shoulder_pain',
  'scratchy throat': 'sore_throat',
  'throat pain': 'sore_throat',
  'raw throat': 'sore_throat',
  'swollen throat': 'sore_throat',
  'sore throat': 'sore_throat',
  'throat hurts': 'sore_throat',
  'hurts to swallow': 'sore_throat',
  'eye strain': 'eye_strain',
  'tired eyes': 'eye_strain',
  'screen fatigue': 'eye_strain',
  'dry eyes': 'eye_strain',
  'computer vision': 'eye_strain',
  'digital strain': 'eye_strain',
  'strained eyes': 'eye_strain',
  'period cramps': 'period_cramps',
  'menstrual pain': 'period_cramps',
  'period pain': 'period_cramps',
  'cramps': 'period_cramps',
  'dysmenorrhea': 'period_cramps',
  'menstrual cramp': 'period_cramps',
  'monthly cramps': 'period_cramps',
  'uterine cramps': 'period_cramps',
  'fever': 'fever',
  'high temperature': 'fever',
  'high temp': 'fever',
  'running a temp': 'fever',
  'temperature': 'fever',
  'feeling feverish': 'fever',
  'skin rash': 'skin_rash',
  'rash': 'skin_rash',
  'itchy skin': 'skin_rash',
  'hives': 'skin_rash',
  'skin irritation': 'skin_rash',
  'red rash': 'skin_rash',
  'itchy rash': 'skin_rash',
  'ear pain': 'ear_pain',
  'earache': 'ear_pain',
  'ear hurt': 'ear_pain',
  'ear infection': 'ear_pain',
  'blocked ear': 'ear_pain',
  'pain in ear': 'ear_pain',
  'ear ache': 'ear_pain',
  'bloating': 'bloating',
  'bloated': 'bloating',
  'gas': 'bloating',
  'gassy': 'bloating',
  'distended': 'bloating',
  'bloated belly': 'bloating',
  'stomach bloated': 'bloating',
  'hangover': 'hangover',
  'hungover': 'hangover',
  'headache': 'headache',
  'head ache': 'headache',
  'migraine': 'migraine',
  'throbbing head': 'headache',
  'tension head': 'headache',
  'head hurting': 'headache',
  'head pain': 'headache',
  'pounding head': 'headache',
  'cold': 'cold',
  'flu': 'cold',
  'runny nose': 'cold',
  'common cold': 'cold',
  'getting sick': 'cold',
  'congestion': 'congestion',
  'chest congestion': 'congestion',
  'cough': 'cough',
  'hacking cough': 'cough',
  'dry cough': 'cough',
  'wet cough': 'cough',
  'chesty cough': 'cough',
  'persistent cough': 'cough',
  'sinus pressure': 'sinus_pressure',
  'sinus pain': 'sinus_pressure',
  'sinus headache': 'sinus_pressure',
  'sinus congestion': 'sinus_pressure',
  'facial pain': 'sinus_pressure',
  'pressure behind eyes': 'sinus_pressure',
  'sinusitis': 'sinus_pressure',
  'anxiety': 'anxiety',
  'anxious': 'anxiety',
  'panic': 'anxiety',
  'nervous': 'anxiety',
  'panic attack': 'anxiety',
  'feeling anxious': 'anxiety',
  'racing thoughts': 'anxiety',
  'worried': 'anxiety',
  'insomnia': 'insomnia',
  'can\'t sleep': 'insomnia',
  'cant sleep': 'insomnia',
  'sleepless': 'insomnia',
  'trouble sleeping': 'insomnia',
  'waking up': 'insomnia',
  'cannot sleep': 'insomnia',
  'sleep issues': 'insomnia',
  'difficulty sleeping': 'insomnia',
  'nausea': 'nausea',
  'nauseous': 'nausea',
  'sick to stomach': 'nausea',
  'queasy': 'nausea',
  'vomiting': 'nausea',
  'feel sick': 'nausea',
  'puking': 'nausea',
  'stress': 'stress',
  'stressed': 'stress',
  'overwhelmed': 'stress',
  'tension': 'stress',
  'stressed out': 'stress',
  'feeling stressed': 'stress',
  'fatigue': 'fatigue',
  'tired': 'fatigue',
  'low energy': 'low_energy',
  'exhausted': 'fatigue',
  'wiped out': 'fatigue',
  'drained': 'fatigue',
  'feeling tired': 'fatigue',
  'burnout': 'burnout',
  'burned out': 'burnout',
  'depleted': 'burnout',
  'burnt out': 'burnout',
  'brain fog': 'brain_fog',
  'brainfog': 'brain_fog',
  'joint pain': 'joint_pain',
  'joint ache': 'joint_pain',
  'sore joints': 'joint_pain',
  'arthritis pain': 'joint_pain',
  'pain in joints': 'joint_pain',
  'aching joints': 'joint_pain',
  'muscle pain': 'muscle_pain',
  'muscle ache': 'muscle_pain',
  'sore muscles': 'muscle_pain',
  'body ache': 'muscle_pain',
  'body pain': 'muscle_pain',
  'aching muscles': 'muscle_pain',
  'indigestion': 'indigestion',
  'upset stomach': 'indigestion',
  'dyspepsia': 'indigestion',
  'bad digestion': 'indigestion',
  'heartburn': 'heartburn',
  'acid reflux': 'heartburn',
  'burning chest': 'heartburn',
  'gerd': 'heartburn',
  'reflux': 'heartburn',
  'constipation': 'constipation',
  'constipated': 'constipation',
  'can\'t poop': 'constipation',
  'cant poop': 'constipation',
  'irregular bowels': 'constipation',
  'hard stools': 'constipation',
  'blocked up': 'constipation',
  'diarrhea': 'diarrhea',
  'loose stools': 'diarrhea',
  'runny stools': 'diarrhea',
  'the runs': 'diarrhea',
  'diarrhoea': 'diarrhea',
  'stomach ache': 'stomach_ache',
  'stomach pain': 'stomach_ache',
  'belly ache': 'stomach_ache',
  'tummy ache': 'stomach_ache',
  'belly pain': 'stomach_ache',
  'gas pain': 'gas',
  'trapped wind': 'gas',
  'flatulence': 'gas',
  'farting': 'gas',
  'dehydration': 'dehydration',
  'dehydrated': 'dehydration',
  'thirsty': 'dehydration',
  'dry mouth': 'dehydration',
  'not drinking enough': 'dehydration',
  'pms': 'pms',
  'premenstrual': 'pms',
  'pms symptoms': 'pms',
  'pre menstrual': 'pms',
  'menopause': 'menopause',
  'perimenopause': 'menopause',
  'hot flashes': 'menopause',
  'night sweats': 'menopause',
  'hormonal balance': 'menopause',
  'hot flushes': 'menopause',
  'dry skin': 'dry_skin',
  'flaky skin': 'dry_skin',
  'rough skin': 'dry_skin',
  'chapped skin': 'dry_skin',
  'peeling skin': 'dry_skin',
  'acne': 'acne',
  'breakout': 'acne',
  'pimples': 'acne',
  'spots': 'acne',
  'zits': 'acne',
  'break outs': 'acne',
};

const RELATED_SYMPTOMS = {
  congestion: ['sinus_pressure', 'cold', 'headache', 'cough'],
  sinus_pressure: ['congestion', 'headache', 'cold'],
  cold: ['cough', 'congestion', 'fever', 'sore_throat', 'sinus_pressure'],
  cough: ['cold', 'congestion', 'sore_throat'],
  sore_throat: ['cold', 'cough', 'congestion'],
  fever: ['cold', 'dehydration', 'headache'],
  headache: ['migraine', 'eye_strain', 'sinus_pressure', 'stress', 'dehydration'],
  migraine: ['headache', 'eye_strain', 'nausea'],
  brain_fog: ['fatigue', 'low_energy', 'stress', 'dehydration', 'burnout'],
  fatigue: ['low_energy', 'brain_fog', 'stress', 'burnout', 'dehydration'],
  low_energy: ['fatigue', 'brain_fog', 'dehydration'],
  burnout: ['stress', 'fatigue', 'brain_fog', 'insomnia'],
  stress: ['anxiety', 'burnout', 'insomnia', 'fatigue', 'headache'],
  anxiety: ['stress', 'insomnia', 'panic'],
  insomnia: ['stress', 'anxiety', 'fatigue', 'burnout'],
  nausea: ['indigestion', 'stomach_ache', 'headache', 'migraine', 'hangover'],
  stomach_ache: ['nausea', 'indigestion', 'bloating', 'gas'],
  indigestion: ['heartburn', 'bloating', 'nausea', 'stomach_ache'],
  heartburn: ['indigestion', 'nausea'],
  bloating: ['gas', 'indigestion', 'constipation'],
  gas: ['bloating', 'indigestion', 'constipation'],
  constipation: ['bloating', 'gas', 'stomach_ache'],
  diarrhea: ['dehydration', 'stomach_ache', 'nausea'],
  hangover: ['dehydration', 'headache', 'nausea', 'fatigue'],
  dehydration: ['headache', 'fatigue', 'dry_skin', 'low_energy'],
  back_pain: ['muscle_pain', 'neck_pain', 'shoulder_pain'],
  neck_pain: ['back_pain', 'shoulder_pain', 'headache', 'stress'],
  shoulder_pain: ['neck_pain', 'back_pain', 'stress'],
  joint_pain: ['muscle_pain', 'fatigue'],
  muscle_pain: ['joint_pain', 'back_pain', 'fatigue', 'dehydration'],
  leg_pain: ['muscle_pain', 'fatigue', 'dehydration'],
  knee_pain: ['leg_pain', 'joint_pain'],
  eye_pain: ['eye_strain', 'headache', 'sinus_pressure'],
  eye_strain: ['eye_pain', 'headache', 'dry_skin'],
  ear_pain: ['cold', 'sinus_pressure', 'congestion'],
  period_cramps: ['pms', 'back_pain', 'fatigue', 'bloating'],
  pms: ['period_cramps', 'bloating', 'fatigue', 'acne'],
  menopause: ['insomnia', 'fatigue', 'anxiety'],
  skin_rash: ['dry_skin', 'acne'],
  dry_skin: ['skin_rash', 'dehydration'],
  acne: ['skin_rash', 'stress', 'pms'],
};

const TOKEN_MAP = {
  eye: [{ id: 'eye_pain', weight: 1 }, { id: 'eye_strain', weight: 0.8 }, { id: 'sinus_pressure', weight: 0.3 }],
  eyes: [{ id: 'eye_pain', weight: 1 }, { id: 'eye_strain', weight: 0.8 }, { id: 'sinus_pressure', weight: 0.3 }],
  vision: [{ id: 'eye_strain', weight: 0.8 }, { id: 'eye_pain', weight: 0.5 }],
  blurry: [{ id: 'eye_strain', weight: 0.8 }, { id: 'eye_pain', weight: 0.4 }],
  burning: [{ id: 'eye_pain', weight: 0.7 }, { id: 'eye_strain', weight: 0.5 }, { id: 'heartburn', weight: 0.5 }],
  stinging: [{ id: 'eye_pain', weight: 0.8 }],
  itchy: [{ id: 'skin_rash', weight: 0.7 }, { id: 'eye_pain', weight: 0.5 }, { id: 'dry_skin', weight: 0.4 }],
  dry: [{ id: 'dry_skin', weight: 0.9 }, { id: 'dehydration', weight: 0.6 }, { id: 'cough', weight: 0.3 }],
  tired: [{ id: 'fatigue', weight: 0.9 }, { id: 'eye_strain', weight: 0.6 }, { id: 'insomnia', weight: 0.4 }],
  strained: [{ id: 'eye_strain', weight: 0.9 }, { id: 'headache', weight: 0.3 }],
  screen: [{ id: 'eye_strain', weight: 0.9 }, { id: 'headache', weight: 0.5 }],
  laptop: [{ id: 'eye_strain', weight: 0.7 }, { id: 'headache', weight: 0.4 }],
  computer: [{ id: 'eye_strain', weight: 0.8 }, { id: 'headache', weight: 0.4 }],
  studying: [{ id: 'eye_strain', weight: 0.7 }, { id: 'fatigue', weight: 0.5 }, { id: 'stress', weight: 0.5 }, { id: 'headache', weight: 0.4 }],
  reading: [{ id: 'eye_strain', weight: 0.6 }, { id: 'headache', weight: 0.4 }],

  nose: [{ id: 'congestion', weight: 1 }, { id: 'sinus_pressure', weight: 0.7 }, { id: 'cold', weight: 0.5 }],
  nasal: [{ id: 'congestion', weight: 1 }, { id: 'sinus_pressure', weight: 0.7 }],
  blocked: [{ id: 'congestion', weight: 0.9 }, { id: 'constipation', weight: 0.4 }],
  stuffed: [{ id: 'congestion', weight: 0.9 }],
  stuffy: [{ id: 'congestion', weight: 0.9 }],
  runny: [{ id: 'cold', weight: 0.8 }, { id: 'congestion', weight: 0.6 }],
  sneezing: [{ id: 'cold', weight: 0.8 }, { id: 'congestion', weight: 0.5 }],
  clogged: [{ id: 'congestion', weight: 0.9 }, { id: 'sinus_pressure', weight: 0.5 }],
  breathe: [{ id: 'congestion', weight: 0.7 }, { id: 'cold', weight: 0.4 }],

  head: [{ id: 'headache', weight: 1 }, { id: 'sinus_pressure', weight: 0.5 }, { id: 'migraine', weight: 0.4 }],
  headache: [{ id: 'headache', weight: 1 }, { id: 'migraine', weight: 0.7 }],
  throbbing: [{ id: 'headache', weight: 0.9 }, { id: 'migraine', weight: 0.6 }],
  pounding: [{ id: 'headache', weight: 0.9 }, { id: 'migraine', weight: 0.5 }],
  tight: [{ id: 'headache', weight: 0.7 }, { id: 'stress', weight: 0.6 }, { id: 'neck_pain', weight: 0.4 }],
  migraine: [{ id: 'migraine', weight: 1 }, { id: 'headache', weight: 0.8 }],
  temple: [{ id: 'headache', weight: 0.7 }, { id: 'stress', weight: 0.4 }],

  fog: [{ id: 'brain_fog', weight: 1 }, { id: 'fatigue', weight: 0.5 }],
  foggy: [{ id: 'brain_fog', weight: 1 }, { id: 'fatigue', weight: 0.5 }],
  focus: [{ id: 'brain_fog', weight: 0.9 }, { id: 'fatigue', weight: 0.5 }],
  forgetful: [{ id: 'brain_fog', weight: 0.8 }],
  concentrate: [{ id: 'brain_fog', weight: 0.9 }, { id: 'fatigue', weight: 0.4 }],
  concentration: [{ id: 'brain_fog', weight: 0.9 }, { id: 'fatigue', weight: 0.4 }],
  scatterbrained: [{ id: 'brain_fog', weight: 0.9 }, { id: 'stress', weight: 0.4 }],
  cloudy: [{ id: 'brain_fog', weight: 0.8 }, { id: 'sinus_pressure', weight: 0.3 }],
  clarity: [{ id: 'brain_fog', weight: 0.6 }, { id: 'fatigue', weight: 0.4 }],
  spaced: [{ id: 'brain_fog', weight: 0.7 }, { id: 'fatigue', weight: 0.4 }],

  drained: [{ id: 'fatigue', weight: 0.8 }, { id: 'burnout', weight: 0.7 }, { id: 'brain_fog', weight: 0.5 }, { id: 'dehydration', weight: 0.4 }],
  exhausted: [{ id: 'fatigue', weight: 0.9 }, { id: 'burnout', weight: 0.7 }, { id: 'insomnia', weight: 0.4 }],
  wiped: [{ id: 'fatigue', weight: 0.8 }, { id: 'burnout', weight: 0.5 }],
  depleted: [{ id: 'burnout', weight: 0.8 }, { id: 'fatigue', weight: 0.7 }, { id: 'dehydration', weight: 0.4 }],
  energy: [{ id: 'low_energy', weight: 0.9 }, { id: 'fatigue', weight: 0.8 }, { id: 'burnout', weight: 0.5 }],
  sleepy: [{ id: 'insomnia', weight: 0.4 }, { id: 'fatigue', weight: 0.6 }],

  leg: [{ id: 'leg_pain', weight: 1 }, { id: 'muscle_pain', weight: 0.5 }],
  legs: [{ id: 'leg_pain', weight: 1 }, { id: 'muscle_pain', weight: 0.5 }],
  heavy: [{ id: 'leg_pain', weight: 0.6 }, { id: 'fatigue', weight: 0.6 }, { id: 'muscle_pain', weight: 0.4 }],
  walking: [{ id: 'leg_pain', weight: 0.5 }, { id: 'muscle_pain', weight: 0.5 }, { id: 'knee_pain', weight: 0.4 }],
  cramp: [{ id: 'period_cramps', weight: 0.6 }, { id: 'leg_pain', weight: 0.6 }, { id: 'muscle_pain', weight: 0.5 }],
  shin: [{ id: 'leg_pain', weight: 0.7 }],

  knee: [{ id: 'knee_pain', weight: 1 }, { id: 'leg_pain', weight: 0.6 }, { id: 'joint_pain', weight: 0.5 }],
  back: [{ id: 'back_pain', weight: 1 }, { id: 'muscle_pain', weight: 0.4 }],
  neck: [{ id: 'neck_pain', weight: 1 }, { id: 'headache', weight: 0.4 }, { id: 'stress', weight: 0.3 }],
  shoulder: [{ id: 'shoulder_pain', weight: 1 }, { id: 'neck_pain', weight: 0.5 }, { id: 'stress', weight: 0.3 }],
  joint: [{ id: 'joint_pain', weight: 0.9 }, { id: 'muscle_pain', weight: 0.5 }],
  muscle: [{ id: 'muscle_pain', weight: 0.9 }, { id: 'joint_pain', weight: 0.4 }, { id: 'back_pain', weight: 0.3 }],
  muscles: [{ id: 'muscle_pain', weight: 0.9 }, { id: 'joint_pain', weight: 0.3 }],
  body: [{ id: 'muscle_pain', weight: 0.6 }, { id: 'fatigue', weight: 0.4 }, { id: 'fever', weight: 0.3 }],

  throat: [{ id: 'sore_throat', weight: 1 }, { id: 'cough', weight: 0.5 }, { id: 'cold', weight: 0.4 }],
  scratchy: [{ id: 'sore_throat', weight: 0.8 }, { id: 'cough', weight: 0.4 }],
  swallow: [{ id: 'sore_throat', weight: 0.7 }],

  stomach: [{ id: 'stomach_ache', weight: 0.8 }, { id: 'indigestion', weight: 0.6 }, { id: 'nausea', weight: 0.5 }, { id: 'bloating', weight: 0.4 }],
  belly: [{ id: 'stomach_ache', weight: 0.8 }, { id: 'bloating', weight: 0.5 }],
  nausea: [{ id: 'nausea', weight: 1 }, { id: 'indigestion', weight: 0.4 }],
  nauseous: [{ id: 'nausea', weight: 1 }, { id: 'indigestion', weight: 0.3 }],
  queasy: [{ id: 'nausea', weight: 0.9 }, { id: 'indigestion', weight: 0.4 }],
  vomit: [{ id: 'nausea', weight: 0.9 }],
  heartburn: [{ id: 'heartburn', weight: 1 }, { id: 'indigestion', weight: 0.6 }],
  reflux: [{ id: 'heartburn', weight: 0.9 }, { id: 'indigestion', weight: 0.4 }],
  bloated: [{ id: 'bloating', weight: 1 }, { id: 'indigestion', weight: 0.6 }, { id: 'constipation', weight: 0.4 }],
  constipated: [{ id: 'constipation', weight: 1 }, { id: 'bloating', weight: 0.4 }],
  diarrhea: [{ id: 'diarrhea', weight: 1 }, { id: 'dehydration', weight: 0.4 }],

  stress: [{ id: 'stress', weight: 1 }, { id: 'anxiety', weight: 0.7 }, { id: 'headache', weight: 0.4 }, { id: 'burnout', weight: 0.4 }],
  anxious: [{ id: 'anxiety', weight: 1 }, { id: 'stress', weight: 0.7 }, { id: 'panic', weight: 0.5 }],
  stressed: [{ id: 'stress', weight: 1 }, { id: 'anxiety', weight: 0.5 }],
  overwhelmed: [{ id: 'stress', weight: 0.7 }, { id: 'burnout', weight: 0.7 }, { id: 'anxiety', weight: 0.5 }],
  worried: [{ id: 'anxiety', weight: 0.7 }, { id: 'stress', weight: 0.5 }],
  panic: [{ id: 'anxiety', weight: 0.8 }, { id: 'stress', weight: 0.5 }],
  nervous: [{ id: 'anxiety', weight: 0.8 }, { id: 'stress', weight: 0.4 }],
  burnout: [{ id: 'burnout', weight: 1 }, { id: 'stress', weight: 0.6 }, { id: 'fatigue', weight: 0.5 }],
  sleep: [{ id: 'insomnia', weight: 0.8 }, { id: 'fatigue', weight: 0.6 }, { id: 'brain_fog', weight: 0.4 }],
  insomnia: [{ id: 'insomnia', weight: 1 }, { id: 'stress', weight: 0.5 }, { id: 'anxiety', weight: 0.4 }],
  sleepless: [{ id: 'insomnia', weight: 0.9 }, { id: 'fatigue', weight: 0.4 }],

  ear: [{ id: 'ear_pain', weight: 1 }, { id: 'sinus_pressure', weight: 0.5 }, { id: 'cold', weight: 0.3 }],
  ears: [{ id: 'ear_pain', weight: 1 }, { id: 'sinus_pressure', weight: 0.5 }],
  sinus: [{ id: 'sinus_pressure', weight: 1 }, { id: 'congestion', weight: 0.6 }, { id: 'headache', weight: 0.4 }],
  fever: [{ id: 'fever', weight: 1 }, { id: 'cold', weight: 0.6 }, { id: 'dehydration', weight: 0.3 }],
  cold: [{ id: 'cold', weight: 1 }, { id: 'congestion', weight: 0.6 }, { id: 'cough', weight: 0.5 }, { id: 'fever', weight: 0.4 }],
  cough: [{ id: 'cough', weight: 1 }, { id: 'cold', weight: 0.6 }, { id: 'sore_throat', weight: 0.4 }],
  flu: [{ id: 'cold', weight: 0.9 }, { id: 'fever', weight: 0.5 }],
  skin: [{ id: 'skin_rash', weight: 0.7 }, { id: 'dry_skin', weight: 0.6 }, { id: 'acne', weight: 0.3 }],
  rash: [{ id: 'skin_rash', weight: 1 }, { id: 'dry_skin', weight: 0.4 }],
  hives: [{ id: 'skin_rash', weight: 0.8 }],

  dehydrated: [{ id: 'dehydration', weight: 1 }, { id: 'headache', weight: 0.4 }],
  thirsty: [{ id: 'dehydration', weight: 0.7 }, { id: 'dry_skin', weight: 0.3 }],
  hangover: [{ id: 'hangover', weight: 1 }, { id: 'dehydration', weight: 0.6 }, { id: 'headache', weight: 0.5 }],
  hungover: [{ id: 'hangover', weight: 1 }, { id: 'dehydration', weight: 0.4 }],
  pms: [{ id: 'pms', weight: 1 }, { id: 'period_cramps', weight: 0.7 }, { id: 'bloating', weight: 0.4 }],
  menopause: [{ id: 'menopause', weight: 1 }, { id: 'insomnia', weight: 0.4 }, { id: 'fatigue', weight: 0.3 }],
  acne: [{ id: 'acne', weight: 1 }, { id: 'skin_rash', weight: 0.5 }],
  pimple: [{ id: 'acne', weight: 0.9 }, { id: 'skin_rash', weight: 0.3 }],
  exam: [{ id: 'stress', weight: 0.8 }, { id: 'anxiety', weight: 0.7 }, { id: 'fatigue', weight: 0.5 }],
  exams: [{ id: 'stress', weight: 0.8 }, { id: 'anxiety', weight: 0.7 }, { id: 'fatigue', weight: 0.5 }],
  work: [{ id: 'stress', weight: 0.6 }, { id: 'burnout', weight: 0.5 }, { id: 'fatigue', weight: 0.4 }, { id: 'eye_strain', weight: 0.3 }],
  dust: [{ id: 'congestion', weight: 0.6 }, { id: 'sinus_pressure', weight: 0.6 }, { id: 'cough', weight: 0.4 }],
  pollen: [{ id: 'congestion', weight: 0.6 }, { id: 'sinus_pressure', weight: 0.5 }, { id: 'skin_rash', weight: 0.3 }],
  allergy: [{ id: 'congestion', weight: 0.6 }, { id: 'sinus_pressure', weight: 0.5 }, { id: 'skin_rash', weight: 0.4 }],
  weather: [{ id: 'sinus_pressure', weight: 0.5 }, { id: 'headache', weight: 0.4 }, { id: 'joint_pain', weight: 0.3 }],

  pain: [{ id: '', weight: 0 }],
  ache: [{ id: '', weight: 0 }],
  sore: [{ id: '', weight: 0 }],
  hurts: [{ id: '', weight: 0 }],
  hurt: [{ id: '', weight: 0 }],
  aching: [{ id: '', weight: 0 }],
};

const STOP_WORDS = new Set([
  'the', 'my', 'a', 'an', 'is', 'after', 'when', 'while', 'from', 'with',
  'in', 'on', 'at', 'for', 'of', 'to', 'and', 'or', 'but', 'not', 'its',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'you', 'your', 'it',
  'have', 'has', 'had', 'do', 'does', 'did', 'can', 'cant', 'cannot',
  'will', 'would', 'could', 'should', 'may', 'might', 'all', 'every',
  'been', 'being', 'am', 'are', 'was', 'were', 'be',
  'get', 'got', 'feel', 'feels', 'feeling', 'felt', 'having', 'using',
  'dont', 'doesnt', 'wont', 'wouldnt', 'couldnt', 'shouldnt',
  'through', 'too', 'much', 'time', 'very', 'really', 'so', 'just',
  'ache', 'aches', 'aching', 'sore', 'soreness', 'hurt', 'hurts',
  'pain', 'pains', 'painful', 'today',
]);

function normalize(q) {
  return q.toLowerCase().trim().replace(/\s+/g, ' ')
    .replace(/can't/g, 'cannot')
    .replace(/don't/g, 'dont')
    .replace(/won't/g, 'wont')
    .replace(/doesn't/g, 'doesnt')
    .replace(/isn't/g, 'isnt')
    .replace(/aren't/g, 'arent')
    .replace(/wasn't/g, 'wasnt')
    .replace(/weren't/g, 'werent');
}

function buildLabelIndex(symptoms) {
  const idx = {};
  for (const s of symptoms) {
    idx[s.label.toLowerCase()] = s.id;
    idx[s.id] = s.id;
  }
  return idx;
}

function levenshtein(a, b) {
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  const matrix = Array.from({ length: blen + 1 }, (_, i) =>
    Array.from({ length: alen + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= blen; i++) {
    for (let j = 1; j <= alen; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[blen][alen];
}

function maxFuzzDistance(word) {
  if (word.length <= 4) return 1;
  if (word.length <= 7) return 1;
  return 2;
}

function trySplitCompound(word, knownSet) {
  for (let i = 2; i < word.length - 1; i++) {
    const left = word.slice(0, i);
    const right = word.slice(i);
    if (knownSet.has(left) && knownSet.has(right)) {
      return [left, right];
    }
  }
  return null;
}

function tokenize(query) {
  return query.split(/\s+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w));
}

function isContainedIn(query, alias) {
  return query === alias
    || query.startsWith(alias + ' ')
    || query.endsWith(' ' + alias)
    || query.includes(' ' + alias + ' ');
}

export function resolveQuery(query, symptoms) {
  if (!query || !symptoms?.length) {
    return { symptomIds: [], relatedIds: [], allSymptomIds: [], confidence: 0, allMatches: [], primarySymptom: null };
  }

  const normalized = normalize(query);
  if (normalized.length < 2) {
    return { symptomIds: [], relatedIds: [], allSymptomIds: [], confidence: 0, allMatches: [], primarySymptom: null };
  }

  const labelIndex = buildLabelIndex(symptoms);
  const aliasEntries = Object.entries(ALIAS_MAP);
  const words = tokenize(normalized);

  const scores = {};
  const matchedTokens = {};

  function addScore(symptomId, weight, source) {
    if (!scores[symptomId]) {
      scores[symptomId] = 0;
      matchedTokens[symptomId] = [];
    }
    scores[symptomId] += weight;
    matchedTokens[symptomId].push(source);
  }

  // Phase A: Exact symptom label match (confidence 100)
  if (labelIndex[normalized]) {
    addScore(labelIndex[normalized], 50, 'exact_label');
  }

  // Phase B: Multi-word alias match (confidence 95)
  for (const [alias, id] of aliasEntries) {
    if (isContainedIn(normalized, alias)) {
      addScore(id, 30, 'alias:' + alias);
    }
  }

  // Phase C: Token-level analysis against TOKEN_MAP
  for (const word of words) {
    const mappings = TOKEN_MAP[word];
    if (mappings) {
      for (const { id, weight } of mappings) {
        if (id) addScore(id, weight, 'token:' + word);
      }
    }
  }

  // Phase D: Symptom label word overlap
  const symptomLabelWords = {};
  for (const s of symptoms) {
    const labelWords = s.label.toLowerCase().split(/\s+/);
    for (const lw of labelWords) {
      if (!symptomLabelWords[lw]) symptomLabelWords[lw] = [];
      symptomLabelWords[lw].push(s.id);
    }
  }
  for (const word of words) {
    const ids = symptomLabelWords[word];
    if (ids) {
      for (const id of ids) {
        if (!scores[id]) { scores[id] = 0; matchedTokens[id] = []; }
        scores[id] += 3;
        matchedTokens[id].push('label:' + word);
      }
    }
  }

  // Phase E: Fuzzy matching for tokens that matched nothing
  const tokenMapKeys = new Set(Object.keys(TOKEN_MAP));
  const allLabelWords = Object.keys(symptomLabelWords);
  const splitKnownSet = new Set([...tokenMapKeys, ...allLabelWords]);

  const exactMatched = new Set();
  for (const word of words) {
    if (TOKEN_MAP[word]) exactMatched.add(word);
    if (symptomLabelWords[word]) exactMatched.add(word);
  }

  for (const word of words) {
    if (exactMatched.has(word)) continue;
    if (word.length < 3) continue;

    // 1. Compound splitting: "eyepain" → "eye" + "pain"
    const split = trySplitCompound(word, splitKnownSet);
    if (split) {
      for (const part of split) {
        const mappings = TOKEN_MAP[part];
        if (mappings) {
          for (const { id, weight } of mappings) {
            if (id) addScore(id, weight, 'fuzzy_split:' + word);
          }
        } else if (symptomLabelWords[part]) {
          for (const id of symptomLabelWords[part]) {
            addScore(id, 2, 'fuzzy_split_label:' + word);
          }
        }
      }
      continue;
    }

    // 2. Fuzzy match against TOKEN_MAP keys: "noise" → "nose"
    const fuzzDist = maxFuzzDistance(word);
    let bestKey = null;
    let bestDist = Infinity;
    for (const key of tokenMapKeys) {
      if (Math.abs(key.length - word.length) > fuzzDist) continue;
      const dist = levenshtein(word, key);
      if (dist < bestDist && dist <= fuzzDist) {
        bestDist = dist;
        bestKey = key;
      }
    }
    if (bestKey) {
      const penalty = Math.max(1 - bestDist * 0.15, 0.75);
      const mappings = TOKEN_MAP[bestKey];
      for (const { id, weight } of mappings) {
        if (id) addScore(id, weight * penalty, 'fuzzy_token:' + bestKey);
      }
      continue;
    }

    // 3. Fuzzy match against symptom label words
    bestKey = null;
    bestDist = Infinity;
    for (const lw of allLabelWords) {
      if (Math.abs(lw.length - word.length) > fuzzDist) continue;
      const dist = levenshtein(word, lw);
      if (dist < bestDist && dist <= fuzzDist) {
        bestDist = dist;
        bestKey = lw;
      }
    }
    if (bestKey) {
      const ids = symptomLabelWords[bestKey];
      for (const id of ids) {
        addScore(id, 2, 'fuzzy_label:' + bestKey);
      }
    }
  }

  // Build results
  const results = Object.entries(scores).map(([id, rawScore]) => {
    const numTokens = words.length || 1;
    const normalizedScore = Math.min(Math.round(rawScore / numTokens * 20), 100);
    return {
      id,
      score: normalizedScore,
      matchedTokens: [...new Set(matchedTokens[id] || [])],
    };
  });

  results.sort((a, b) => b.score - a.score);

  const threshold = 15;
  const filtered = results.filter(r => r.score >= threshold);
  const validSymptomIds = filtered.map(r => r.id);

  const confidence = filtered.length > 0 ? filtered[0].score : 0;
  const primaryId = filtered.length > 0 ? filtered[0].id : null;
  const primarySymptom = primaryId ? symptoms.find(s => s.id === primaryId) || null : null;

  return {
    symptomIds: validSymptomIds,
    relatedIds: [],
    allSymptomIds: validSymptomIds,
    confidence,
    allMatches: filtered,
    primarySymptom,
  };
}

export function getRelatedSymptoms(symptomIds) {
  const relatedIds = [];
  const seen = new Set(symptomIds);
  for (const id of symptomIds) {
    const related = RELATED_SYMPTOMS[id] || [];
    for (const rId of related) {
      if (!seen.has(rId)) {
        seen.add(rId);
        relatedIds.push(rId);
      }
    }
  }
  return relatedIds;
}
