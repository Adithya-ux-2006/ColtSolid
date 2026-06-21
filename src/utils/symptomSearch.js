import { isEmergencySymptom } from '../constants/emergency';
import { resolveQuery } from './symptomEngine';

export function isEmergencyQuery(query) {
  return isEmergencySymptom(query);
}

export function matchQueryToSymptoms(query, symptoms) {
  if (!query || !symptoms?.length) return [];

  const normalized = query.toLowerCase().trim();
  if (isEmergencyQuery(normalized)) return [];

  const { symptomIds } = resolveQuery(query, symptoms);
  return symptomIds;
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
