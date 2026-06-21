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

  'eyes hurt': 'eye_pain',
  'hurting eyes': 'eye_pain',
  'eye ache': 'eye_pain',
  'pain in eye': 'eye_pain',
  'pain in eyes': 'eye_pain',

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

  'eye pain': 'eye_pain',
  'eye hurt': 'eye_pain',
  'sore eyes': 'eye_pain',
  'burning eyes': 'eye_pain',
  'stinging eyes': 'eye_pain',

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

function normalize(query) {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

function buildLabelIndex(symptoms) {
  const labelToId = {};
  for (const s of symptoms) {
    labelToId[s.label.toLowerCase()] = s.id;
    labelToId[s.id] = s.id;
  }
  return labelToId;
}

function buildAliasTrie(aliasMap) {
  return Object.entries(aliasMap).map(([alias, id]) => ({
    alias: alias.toLowerCase(),
    id,
  }));
}

function wordOverlap(queryWords, labelWords) {
  if (!queryWords.length || !labelWords.length) return 0;
  const matches = queryWords.filter(w => labelWords.includes(w)).length;
  return matches / Math.max(queryWords.length, labelWords.length);
}

function isContainedIn(query, alias) {
  return query === alias
    || query.startsWith(alias + ' ')
    || query.endsWith(' ' + alias)
    || query.includes(' ' + alias + ' ');
}

function normalizeToken(word) {
  return word.replace(/[^a-z0-9]/g, '');
}

export function resolveQuery(query, symptoms) {
  if (!query || !symptoms?.length) {
    return { symptomIds: [], relatedIds: [], confidence: 0, matches: [] };
  }

  const normalized = normalize(query);
  if (query.trim().length < 2) {
    return { symptomIds: [], relatedIds: [], confidence: 0, matches: [] };
  }

  const labelIndex = buildLabelIndex(symptoms);
  const aliasEntries = buildAliasTrie(ALIAS_MAP);

  const matches = [];
  const matchedIds = new Set();

  if (labelIndex[normalized]) {
    matches.push({ id: labelIndex[normalized], confidence: 100, type: 'exact_label' });
    matchedIds.add(labelIndex[normalized]);
  }

  for (const { alias, id } of aliasEntries) {
    if (isContainedIn(normalized, alias)) {
      if (!matchedIds.has(id)) {
        matches.push({ id, confidence: 95, type: 'alias', matchedText: alias });
        matchedIds.add(id);
      }
    }
  }

  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 1) {
    for (const s of symptoms) {
      if (matchedIds.has(s.id)) continue;
      const lowerLabel = s.label.toLowerCase();
      const labelWords = lowerLabel.split(/\s+/);
      const overlap = wordOverlap(words, labelWords);
      if (overlap >= 0.8) {
        matches.push({ id: s.id, confidence: 90, type: 'high_word_overlap', overlap });
        matchedIds.add(s.id);
      } else if (overlap >= 0.5) {
        const allMatch = words.every(w => lowerLabel.includes(w));
        if (allMatch) {
          matches.push({ id: s.id, confidence: 85, type: 'partial_word_match' });
          matchedIds.add(s.id);
        }
      }
    }
  }

  if (matchedIds.size === 0 && words.length >= 1) {
    for (const s of symptoms) {
      if (matchedIds.has(s.id)) continue;
      const lowerLabel = s.label.toLowerCase();
      const labelWords = lowerLabel.split(/\s+/);
      const queryWordsFiltered = words.map(normalizeToken).filter(w => w.length >= 3);
      for (const qw of queryWordsFiltered) {
        if (qw.length >= 4 && lowerLabel.includes(qw)) {
          matches.push({ id: s.id, confidence: 70, type: 'fuzzy_substring', matchWord: qw });
          matchedIds.add(s.id);
          break;
        }
      }
    }
  }

  if (matchedIds.size === 0 && words.length >= 1) {
    const queryWordsFiltered = words.map(normalizeToken).filter(w => w.length >= 3);
    for (const [alias, id] of Object.entries(ALIAS_MAP)) {
      if (matchedIds.has(id)) continue;
      const aliasWords = alias.split(/\s+/);
      const overlap = wordOverlap(queryWordsFiltered, aliasWords);
      if (overlap >= 0.5) {
        matches.push({ id, confidence: 75, type: 'alias_word_overlap', matchedText: alias, overlap });
        matchedIds.add(id);
      }
    }
  }

  const symptomIds = Array.from(matchedIds);

  const confidence = matches.length > 0
    ? Math.max(...matches.map(m => m.confidence))
    : 0;

  const matchInfo = matches.length > 0 ? {
    id: matches[0].id,
    confidence: matches[0].confidence,
    type: matches[0].type,
  } : null;

  return { symptomIds, confidence, matchInfo };
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
