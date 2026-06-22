import { isEmergencySymptom } from '../constants/emergency';
import { resolveQuery, getRelatedSymptoms } from './symptomEngine';
import { remedyMatchesAllergies, remedyHasContraindication } from './guestProfile';

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

function computeScore(item, topSymptomId, categoryCounts) {
  const isTopMatch = item._matchSymptomId === topSymptomId;
  const isPrimary = item._matchType === 'primary';

  let score = isTopMatch ? 100 : (isPrimary ? 80 : 50);

  if (item._evidenceScore) {
    score += item._evidenceScore * 10;
  }

  if (item.rating) {
    score += Math.round(item.rating * 2);
  }

  const maxCategory = Math.max(...Object.values(categoryCounts), 1);
  const catCount = categoryCounts[item.category] || 0;
  if (catCount / maxCategory >= 1) {
    score -= 15;
  }

  return score;
}

function interleaveCategories(items, topSymptomId) {
  if (!items?.length) return [];

  const groups = {};
  for (const item of items) {
    const cat = item.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }

  const rounds = Math.max(...Object.values(groups).map(g => g.length));
  const result = [];
  const categoryCounts = {};
  for (const cat of Object.keys(groups)) categoryCounts[cat] = 0;

  const catOrder = ['Lifestyle', 'Natural', 'Ayurveda', 'TCM', 'Conventional', 'Other'];
  const sortedCats = catOrder.filter(c => groups[c]).concat(
    Object.keys(groups).filter(c => !catOrder.includes(c)).sort()
  );

  for (let i = 0; i < rounds; i++) {
    for (const cat of sortedCats) {
      if (i < groups[cat].length) {
        const item = groups[cat][i];
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        result.push({
          ...item,
          _score: computeScore(item, topSymptomId, categoryCounts),
        });
      }
    }
  }

  return result;
}

function filterUnsafeRemedies(remedies, allergies, conditions) {
  return remedies.filter(remedy => {
    if (allergies?.length && remedyMatchesAllergies(remedy, allergies)) return false;
    if (conditions?.length && remedyHasContraindication(remedy, conditions)) return false;
    return true;
  });
}

function collectRemediesForSymptoms(symptomIds, symptomRemediesMap, remedies) {
  const remedyMap = {};
  for (const r of remedies) remedyMap[r.id] = r;

  const hasCuratedData = symptomRemediesMap && Object.keys(symptomRemediesMap).length > 0;
  const results = [];

  const symptomSet = new Set(symptomIds);
  for (const symptomId of symptomIds) {
    if (hasCuratedData) {
      const entries = symptomRemediesMap[symptomId];
      if (entries?.length) {
        for (const entry of entries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy) continue;
          const isPrimaryMatch = remedy.primarySymptoms?.includes(symptomId)
            || !remedy.secondarySymptoms?.includes(symptomId);
          results.push({
            ...remedy,
            _matchSymptomId: symptomId,
            _evidenceScore: entry.evidenceScore,
            _priorityRank: symptomSet.has(symptomId) ? entry.priorityRank : Math.max(1, entry.priorityRank - 3),
            _isPrimarySymptom: symptomSet.has(symptomId) && isPrimaryMatch,
          });
        }
        continue;
      }
    }

    for (const remedy of remedies) {
      if (remedy.primarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        results.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: symptomSet.has(symptomId) ? 5 : 3,
          _isPrimarySymptom: symptomSet.has(symptomId),
        });
      } else if (remedy.secondarySymptoms?.includes(symptomId)) {
        const paperCount = remedy.researchPapers?.length || 0;
        results.push({
          ...remedy,
          _matchSymptomId: symptomId,
          _evidenceScore: Math.min(paperCount * 3 + 1, 10),
          _priorityRank: symptomSet.has(symptomId) ? 3 : 2,
          _isPrimarySymptom: false,
        });
      }
    }
  }

  return results;
}

function dedupeRemedies(items) {
  const seen = new Map();
  for (const item of items) {
    const existing = seen.get(item.id);
    if (!existing) {
      seen.set(item.id, item);
    } else if (item._isPrimarySymptom && !existing._isPrimarySymptom) {
      seen.set(item.id, item);
    } else if (item._isPrimarySymptom === existing._isPrimarySymptom
      && item._priorityRank > existing._priorityRank) {
      seen.set(item.id, {
        ...existing,
        _evidenceScore: Math.max(existing._evidenceScore, item._evidenceScore),
        _priorityRank: item._priorityRank,
      });
    }
  }
  return Array.from(seen.values());
}

export function getRankedRemediesForSymptoms(
  symptomIds,
  symptomRemediesMap,
  remedies,
  options = {},
) {
  if (!symptomIds?.length || !remedies?.length) {
    return { primary: [], related: [] };
  }

  const {
    includeRelated = false,
    symptoms = [],
    allergies = [],
    conditions = [],
  } = options;

  let primarySymptomIds = [...symptomIds];
  let relatedSymptomIds = [];

  if (includeRelated && symptoms.length > 0) {
    relatedSymptomIds = getRelatedSymptoms(symptomIds);
    relatedSymptomIds = relatedSymptomIds.filter(id => !primarySymptomIds.includes(id));
  }

  const primaryItems = collectRemediesForSymptoms(primarySymptomIds, symptomRemediesMap, remedies);
  const relatedItems = relatedSymptomIds.length > 0
    ? collectRemediesForSymptoms(relatedSymptomIds, symptomRemediesMap, remedies)
    : [];

  const allItems = [...primaryItems, ...relatedItems];
  const deduped = dedupeRemedies(allItems);

  const safe = filterUnsafeRemedies(deduped, allergies, conditions);

  const primarySet = new Set(primarySymptomIds);
  const topSymptomId = symptomIds[0];
  const primaryResults = [];
  const relatedResults = [];

  for (const item of safe) {
    const isPrimarySymptom = primarySet.has(item._matchSymptomId);
    if (isPrimarySymptom) {
      primaryResults.push({
        ...item,
        _matchType: 'primary',
        _matchTier: item._matchSymptomId === topSymptomId ? 0 : 1,
        _score: 0,
      });
    } else {
      relatedResults.push({
        ...item,
        _matchType: 'related',
        _matchTier: 2,
        _score: 0,
      });
    }
  }

  const scoredPrimary = interleaveCategories(primaryResults, topSymptomId);
  const scoredRelated = interleaveCategories(relatedResults, topSymptomId);

  scoredPrimary.sort((a, b) => {
    if (a._matchTier !== b._matchTier) return a._matchTier - b._matchTier;
    return b._score - a._score;
  });
  scoredRelated.sort((a, b) => {
    if (a._matchTier !== b._matchTier) return a._matchTier - b._matchTier;
    return b._score - a._score;
  });

  return { primary: scoredPrimary, related: scoredRelated };
}
