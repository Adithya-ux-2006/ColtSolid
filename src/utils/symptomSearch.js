import { isEmergencySymptom } from '../constants/emergency';
import { resolveQuery, getRelatedSymptoms } from './symptomEngine';

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

export function getRankedRemediesForSymptoms(symptomIds, symptomRemediesMap, remedies, options = {}) {
  if (!symptomIds?.length || !remedies?.length) return [];

  const { includeRelated = false, symptoms = [] } = options;

  // Build the full set of symptom IDs: primary + related expansion
  let allSymptomIds = [...symptomIds];
  if (includeRelated && symptoms.length > 0) {
    const relatedIds = getRelatedSymptoms(symptomIds);
    const seen = new Set(symptomIds);
    for (const rId of relatedIds) {
      if (!seen.has(rId)) {
        seen.add(rId);
        allSymptomIds.push(rId);
      }
    }
  }

  const remedyMap = {};
  for (const r of remedies) {
    remedyMap[r.id] = r;
  }

  const hasCuratedData = symptomRemediesMap && Object.keys(symptomRemediesMap).length > 0;
  const primarySymptomIds = new Set(symptomIds);
  const primaryScored = [];
  const relatedScored = [];

  for (const symptomId of allSymptomIds) {
    const isPrimarySymptom = primarySymptomIds.has(symptomId);

    if (hasCuratedData) {
      const entries = symptomRemediesMap[symptomId];
      if (entries?.length) {
        for (const entry of entries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy) continue;
          const isPrimaryMatch = remedy.primarySymptoms?.includes(symptomId) || !remedy.secondarySymptoms?.includes(symptomId);
          const remedyEntry = {
            ...remedy,
            _matchSymptomId: symptomId,
            _evidenceScore: entry.evidenceScore,
            _priorityRank: isPrimarySymptom ? entry.priorityRank : Math.max(1, entry.priorityRank - 3),
            _isPrimary: isPrimarySymptom && isPrimaryMatch,
            _matchType: isPrimarySymptom ? 'primary' : 'related_expanded',
          };
          const bucket = isPrimaryMatch && isPrimarySymptom ? primaryScored : relatedScored;
          bucket.push(remedyEntry);
        }
        continue;
      }
    }

    for (const remedy of remedies) {
      if (remedy.primarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        const entry = {
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: isPrimarySymptom ? 5 : 3,
          _isPrimary: isPrimarySymptom,
          _matchType: isPrimarySymptom ? 'primary' : 'related_expanded',
        };
        primaryScored.push(entry);
      } else if (remedy.secondarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        const entry = {
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: isPrimarySymptom ? 3 : 2,
          _isPrimary: false,
          _matchType: isPrimarySymptom ? 'secondary' : 'related_expanded',
        };
        relatedScored.push(entry);
      }
    }
  }

  const seen = new Map();
  const allScored = [...primaryScored, ...relatedScored];
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
