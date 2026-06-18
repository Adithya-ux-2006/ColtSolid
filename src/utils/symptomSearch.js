const SYMPTOM_ALIASES = {
  'back pain': 'back_pain',
  'backache': 'back_pain',
  'lower back': 'back_pain',
  'back hurt': 'back_pain',
  'back ache': 'back_pain',
  'leg pain': 'leg_pain',
  'leg hurt': 'leg_pain',
  'knee pain': 'knee_pain',
  'knee hurt': 'knee_pain',
  'neck pain': 'neck_pain',
  'neck hurt': 'neck_pain',
  'stiff neck': 'neck_pain',
  'shoulder pain': 'shoulder_pain',
  'shoulder hurt': 'shoulder_pain',
  'sore throat': 'sore_throat',
  'scratchy throat': 'sore_throat',
  'throat pain': 'sore_throat',
  'eye strain': 'eye_strain',
  'tired eyes': 'eye_strain',
  'screen fatigue': 'eye_strain',
  'dry eyes': 'eye_strain',
  'period cramps': 'period_cramps',
  'menstrual pain': 'period_cramps',
  'period pain': 'period_cramps',
  'cramps': 'period_cramps',
  'fever': 'fever',
  'high temperature': 'fever',
  'skin rash': 'skin_rash',
  'rash': 'skin_rash',
  'itchy skin': 'skin_rash',
  'ear pain': 'ear_pain',
  'earache': 'ear_pain',
  'ear hurt': 'ear_pain',
  'bloating': 'bloating',
  'bloated': 'bloating',
  'gas': 'bloating',
  'hangover': 'hangover',
  'headache': 'headache',
  'head ache': 'headache',
  'migraine': 'headache',
  'cold': 'cold',
  'flu': 'cold',
  'runny nose': 'cold',
  'congestion': 'cold',
  'stuffy nose': 'cold',
  'anxiety': 'anxiety',
  'anxious': 'anxiety',
  'panic': 'anxiety',
  'nervous': 'anxiety',
  'insomnia': 'insomnia',
  "can't sleep": 'insomnia',
  'cant sleep': 'insomnia',
  'sleepless': 'insomnia',
  'trouble sleeping': 'insomnia',
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
  'low energy': 'fatigue',
  'exhausted': 'fatigue',
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
    if (normalized.includes(alias) || alias.includes(normalized)) {
      matchedIds.add(symptomId);
    }
  }

  for (const s of symptoms) {
    const lowerLabel = s.label.toLowerCase();
    const lowerId = s.id.toLowerCase();
    if (lowerLabel.includes(normalized) || lowerId.includes(normalized) || normalized.includes(lowerLabel) || normalized.includes(lowerId)) {
      matchedIds.add(s.id);
    }
  }

  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 1) {
    for (const s of symptoms) {
      const lowerLabel = s.label.toLowerCase();
      const matchCount = words.filter(w => lowerLabel.includes(w)).length;
      if (matchCount >= Math.min(2, words.length)) {
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
  const scored = [];

  for (const symptomId of symptomIds) {
    if (hasCuratedData) {
      const entries = symptomRemediesMap[symptomId];
      if (entries?.length) {
        for (const entry of entries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy) continue;
          scored.push({
            ...remedy,
            _matchSymptomId: symptomId,
            _evidenceScore: entry.evidenceScore,
            _priorityRank: entry.priorityRank,
          });
        }
        continue;
      }
    }

    // Fallback: use remedy.symptoms array matching
    for (const remedy of remedies) {
      if (remedy.symptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        scored.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: 5,
        });
      }
    }
  }

  const seen = new Map();
  for (const item of scored) {
    const existing = seen.get(item.id);
    if (!existing) {
      seen.set(item.id, item);
    } else if (item._priorityRank > existing._priorityRank) {
      seen.set(item.id, {
        ...existing,
        _evidenceScore: Math.max(existing._evidenceScore, item._evidenceScore),
        _priorityRank: item._priorityRank,
      });
    }
  }
  const deduped = Array.from(seen.values());

  deduped.sort((a, b) => {
    if (b._priorityRank !== a._priorityRank) return b._priorityRank - a._priorityRank;
    if (b._evidenceScore !== a._evidenceScore) return b._evidenceScore - a._evidenceScore;
    return (b.rating || 0) - (a.rating || 0);
  });

  return deduped;
}
