const SYMPTOM_ALIASES = {
  'back pain': 'back_pain',
  'backache': 'back_pain',
  'lower back': 'back_pain',
  'back hurt': 'back_pain',
  'back ache': 'back_pain',

  'leg pain': 'leg_pain',
  'leg hurt': 'leg_pain',
  'leg ache': 'leg_pain',
  'leg cramp': 'leg_pain',
  'shin splints': 'leg_pain',

  'knee pain': 'knee_pain',
  'knee hurt': 'knee_pain',
  'knee ache': 'knee_pain',
  'sore knee': 'knee_pain',

  'neck pain': 'neck_pain',
  'neck hurt': 'neck_pain',
  'stiff neck': 'neck_pain',
  'cervical pain': 'neck_pain',

  'shoulder pain': 'shoulder_pain',
  'shoulder hurt': 'shoulder_pain',
  'sore shoulder': 'shoulder_pain',
  'frozen shoulder': 'shoulder_pain',

  'eye pain': 'eye_pain',
  'eye hurt': 'eye_pain',
  'sore eyes': 'eye_pain',
  'burning eyes': 'eye_pain',

  'scratchy throat': 'sore_throat',
  'throat pain': 'sore_throat',
  'raw throat': 'sore_throat',
  'swollen throat': 'sore_throat',

  'eye strain': 'eye_strain',
  'tired eyes': 'eye_strain',
  'screen fatigue': 'eye_strain',
  'dry eyes': 'eye_strain',
  'computer vision': 'eye_strain',
  'digital strain': 'eye_strain',

  'period cramps': 'period_cramps',
  'menstrual pain': 'period_cramps',
  'period pain': 'period_cramps',
  'cramps': 'period_cramps',
  'dysmenorrhea': 'period_cramps',
  'menstrual cramp': 'period_cramps',

  'fever': 'fever',
  'high temperature': 'fever',
  'high temp': 'fever',
  'running a temp': 'fever',

  'skin rash': 'skin_rash',
  'rash': 'skin_rash',
  'itchy skin': 'skin_rash',
  'hives': 'skin_rash',
  'skin irritation': 'skin_rash',

  'ear pain': 'ear_pain',
  'earache': 'ear_pain',
  'ear hurt': 'ear_pain',
  'ear infection': 'ear_pain',
  'blocked ear': 'ear_pain',

  'bloating': 'bloating',
  'bloated': 'bloating',
  'gas': 'bloating',
  'gassy': 'bloating',
  'distended': 'bloating',

  'hangover': 'hangover',
  'hungover': 'hangover',

  'headache': 'headache',
  'head ache': 'headache',
  'migraine': 'migraine',
  'throbbing head': 'headache',
  'tension head': 'headache',

  'cold': 'cold',
  'flu': 'cold',
  'runny nose': 'cold',
  'congestion': 'congestion',
  'stuffy nose': 'congestion',
  'blocked nose': 'congestion',

  'cough': 'cough',
  'hacking cough': 'cough',
  'dry cough': 'cough',
  'wet cough': 'cough',
  'chesty cough': 'cough',

  'sinus pressure': 'sinus_pressure',
  'sinus pain': 'sinus_pressure',
  'sinus headache': 'sinus_pressure',
  'sinus congestion': 'sinus_pressure',
  'facial pain': 'sinus_pressure',

  'anxiety': 'anxiety',
  'anxious': 'anxiety',
  'panic': 'anxiety',
  'nervous': 'anxiety',
  'panic attack': 'panic_attacks',

  'insomnia': 'insomnia',
  "can't sleep": 'insomnia',
  'cant sleep': 'insomnia',
  'sleepless': 'insomnia',
  'trouble sleeping': 'insomnia',
  'waking up': 'insomnia',

  'nausea': 'nausea',
  'nauseous': 'nausea',
  'sick to stomach': 'nausea',
  'queasy': 'nausea',
  'vomiting': 'nausea',

  'stress': 'stress',
  'stressed': 'stress',
  'overwhelmed': 'stress',
  'tension': 'stress',

  'fatigue': 'fatigue',
  'tired': 'fatigue',
  'low energy': 'low_energy',
  'exhausted': 'fatigue',
  'wiped out': 'fatigue',

  'burnout': 'burnout',
  'burned out': 'burnout',
  'depleted': 'burnout',

  'brain fog': 'brain_fog',
  'brainfog': 'brain_fog',
  'can\'t focus': 'brain_fog',
  'mental clarity': 'brain_fog',
  'foggy head': 'brain_fog',

  'joint pain': 'joint_pain',
  'joint ache': 'joint_pain',
  'sore joints': 'joint_pain',
  'arthritis pain': 'joint_pain',

  'muscle pain': 'muscle_pain',
  'muscle ache': 'muscle_pain',
  'sore muscles': 'muscle_pain',
  'body ache': 'muscle_pain',
  'body pain': 'muscle_pain',

  'indigestion': 'indigestion',
  'upset stomach': 'indigestion',
  'dyspepsia': 'indigestion',

  'heartburn': 'heartburn',
  'acid reflux': 'heartburn',
  'burning chest': 'heartburn',
  'gerd': 'heartburn',

  'constipation': 'constipation',
  'constipated': 'constipation',
  "can't poop": 'constipation',
  'irregular bowels': 'constipation',

  'diarrhea': 'diarrhea',
  'loose stools': 'diarrhea',
  'runny stools': 'diarrhea',
  'the runs': 'diarrhea',

  'stomach ache': 'stomach_ache',
  'stomach pain': 'stomach_ache',
  'belly ache': 'stomach_ache',
  'tummy ache': 'stomach_ache',

  'gas pain': 'gas',
  'trapped wind': 'gas',
  'flatulence': 'gas',

  'dehydration': 'dehydration',
  'dehydrated': 'dehydration',
  'thirsty': 'dehydration',
  'dry mouth': 'dehydration',

  'pms': 'pms',
  'premenstrual': 'pms',
  'pms symptoms': 'pms',

  'menopause': 'menopause',
  'perimenopause': 'menopause',
  'hot flashes': 'menopause',
  'night sweats': 'menopause',
  'hormonal balance': 'menopause',

  'dry skin': 'dry_skin',
  'flaky skin': 'dry_skin',
  'rough skin': 'dry_skin',
  'chapped skin': 'dry_skin',

  'acne': 'acne',
  'breakout': 'acne',
  'pimples': 'acne',
  'spots': 'acne',
  'zits': 'acne',
};

export function matchQueryToSymptoms(query, symptoms) {
  if (!query || !symptoms?.length) return [];

  const normalized = query.toLowerCase().trim();
  const matchedIds = new Set();

  const labelToId = {};
  for (const s of symptoms) {
    const key = s.label.toLowerCase();
    labelToId[key] = s.id;
    labelToId[s.id] = s.id;
  }

  if (labelToId[normalized]) {
    matchedIds.add(labelToId[normalized]);
  }

  for (const [alias, symptomId] of Object.entries(SYMPTOM_ALIASES)) {
    if (normalized === alias || normalized.startsWith(alias + ' ') || normalized.endsWith(' ' + alias) || normalized.includes(' ' + alias + ' ')) {
      matchedIds.add(symptomId);
    }
  }

  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 1) {
    for (const s of symptoms) {
      const lowerLabel = s.label.toLowerCase();
      const matchCount = words.filter(w => lowerLabel.includes(w)).length;
      if (matchCount === words.length) {
        matchedIds.add(s.id);
      }
    }
  }

  return Array.from(matchedIds);
}

export function getRankedRemediesForSymptoms(symptomIds, symptomRemediesMap, remedies) {
  if (!symptomIds?.length || !remedies?.length) return [];

  const remedyMap = {};
  for (const r of remedies) {
    remedyMap[r.id] = r;
  }

  const hasCuratedData = symptomRemediesMap && Object.keys(symptomRemediesMap).length > 0;
  const primaryScored = [];
  const secondaryScored = [];

  for (const symptomId of symptomIds) {
    if (hasCuratedData) {
      const entries = symptomRemediesMap[symptomId];
      if (entries?.length) {
        for (const entry of entries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy) continue;
          const isPrimary = remedy.primarySymptoms?.includes(symptomId) || !remedy.secondarySymptoms?.includes(symptomId);
          const bucket = isPrimary ? primaryScored : secondaryScored;
          bucket.push({
            ...remedy,
            _matchSymptomId: symptomId,
            _evidenceScore: entry.evidenceScore,
            _priorityRank: entry.priorityRank,
            _isPrimary: isPrimary,
          });
        }
        continue;
      }
    }

    for (const remedy of remedies) {
      if (remedy.primarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        primaryScored.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: 5,
          _isPrimary: true,
        });
      } else if (remedy.secondarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        secondaryScored.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: 3,
          _isPrimary: false,
        });
      }
    }
  }

  const seen = new Map();
  const allScored = [...primaryScored, ...secondaryScored];
  for (const item of allScored) {
    const existing = seen.get(item.id);
    if (!existing) {
      seen.set(item.id, item);
    } else if (item._isPrimary && !existing._isPrimary) {
      seen.set(item.id, item);
    } else if (item._isPrimary === existing._isPrimary && item._priorityRank > existing._priorityRank) {
      seen.set(item.id, {
        ...existing,
        _evidenceScore: Math.max(existing._evidenceScore, item._evidenceScore),
        _priorityRank: item._priorityRank,
      });
    }
  }
  const deduped = Array.from(seen.values());

  deduped.sort((a, b) => {
    if (a._isPrimary !== b._isPrimary) return a._isPrimary ? -1 : 1;
    if (b._priorityRank !== a._priorityRank) return b._priorityRank - a._priorityRank;
    if (b._evidenceScore !== a._evidenceScore) return b._evidenceScore - a._evidenceScore;
    return (b.rating || 0) - (a.rating || 0);
  });

  return deduped;
}
