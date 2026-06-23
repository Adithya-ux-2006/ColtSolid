export const REMEDY_TIER = {
  DIRECT: 0,
  ASSOCIATED: 1,
  SUPPORTIVE: 2,
};

export function classifyRelationship(remedy, symptomId) {
  const isPrimary = remedy.primarySymptoms?.includes(symptomId);
  const isSecondary = remedy.secondarySymptoms?.includes(symptomId);

  if (isPrimary) return REMEDY_TIER.DIRECT;
  if (isSecondary) return REMEDY_TIER.ASSOCIATED;
  return REMEDY_TIER.SUPPORTIVE;
}

function computeEvidenceBonus(evidenceScore) {
  if (!evidenceScore) return 0;
  return evidenceScore * 8;
}

function computeRatingBonus(rating) {
  if (!rating) return 0;
  return Math.round(rating * 15);
}

function computePriorityBonus(priorityRank) {
  if (priorityRank == null) return 0;
  return Math.min(priorityRank, 10) * 3;
}

function computeSafetyPenalty(remedy, userContext) {
  let penalty = 0;
  if (!userContext) return 0;

  const { allergies, conditions } = userContext;
  if (allergies?.length) {
    const remedyAllergens = (remedy.allergen_tags || []).map(t => t.toLowerCase());
    for (const allergy of allergies.map(a => a.toLowerCase())) {
      if (remedyAllergens.some(t => t.includes(allergy) || allergy.includes(t))) {
        penalty += 30;
      }
    }
  }

  if (conditions?.length) {
    const contraindications = (remedy.contraindications || []).map(c => c.toLowerCase());
    for (const condition of conditions.map(c => c.toLowerCase())) {
      if (contraindications.some(ci => ci.includes(condition) || condition.includes(ci))) {
        penalty += 30;
      }
    }
  }

  return penalty;
}

export function rankRemedies(remedies, concerns, symptomRemediesMap, options = {}) {
  if (!remedies?.length || !concerns?.length) return [];

  const { userContext } = options;

  const primaryIds = new Set(concerns.map(c => c.id));
  const remedyMap = {};
  for (const r of remedies) remedyMap[r.id] = r;

  const scored = [];

  for (const concern of concerns) {
    const symptomId = concern.id;
    const isPrimaryConcern = primaryIds.has(symptomId);

    const curatedEntries = symptomRemediesMap?.[symptomId] || [];

    const processed = new Set();

    for (const entry of curatedEntries) {
      const remedy = remedyMap[entry.remedyId];
      if (!remedy || processed.has(remedy.id)) continue;
      processed.add(remedy.id);

      const tier = classifyRelationship(remedy, symptomId);

      const evidenceBonus = computeEvidenceBonus(entry.evidenceScore);
      const ratingBonus = computeRatingBonus(remedy.rating);
      const priorityBonus = computePriorityBonus(entry.priorityRank);
      const safetyPenalty = computeSafetyPenalty(remedy, userContext);

      const score = evidenceBonus + ratingBonus + priorityBonus - safetyPenalty;

      scored.push({
        ...remedy,
        _matchSymptomId: symptomId,
        _isPrimaryConcern: isPrimaryConcern,
        _tier: tier,
        _evidenceScore: entry.evidenceScore || 0,
        _priorityRank: entry.priorityRank || 0,
        _relevanceScore: score,
      });
    }

    const uncataloguedRemedies = remedies.filter(r => !processed.has(r.id));
    for (const remedy of uncataloguedRemedies) {
      processed.add(remedy.id);
      const tier = classifyRelationship(remedy, symptomId);
      if (tier === REMEDY_TIER.SUPPORTIVE && processed.has('supportive_' + remedy.id)) continue;
      if (tier === REMEDY_TIER.SUPPORTIVE) processed.add('supportive_' + remedy.id);

      const ratingBonus = computeRatingBonus(remedy.rating);
      const safetyPenalty = computeSafetyPenalty(remedy, userContext);
      const score = ratingBonus - safetyPenalty;

      scored.push({
        ...remedy,
        _matchSymptomId: symptomId,
        _isPrimaryConcern: isPrimaryConcern,
        _tier: tier,
        _evidenceScore: tier === REMEDY_TIER.SUPPORTIVE ? 0 : 1,
        _priorityRank: 0,
        _relevanceScore: score,
      });
    }
  }

  const deduped = dedupeRemedies(scored);

  deduped.sort((a, b) => {
    if (a._tier !== b._tier) return a._tier - b._tier;
    if (a._isPrimaryConcern !== b._isPrimaryConcern) return a._isPrimaryConcern ? -1 : 1;
    return b._relevanceScore - a._relevanceScore;
  });

  return deduped;
}

function dedupeRemedies(items) {
  const seen = new Map();
  for (const item of items) {
    const existing = seen.get(item.id);
    if (!existing) {
      seen.set(item.id, item);
    } else if (item._tier < existing._tier) {
      seen.set(item.id, item);
    } else if (item._tier === existing._tier && item._relevanceScore > existing._relevanceScore) {
      seen.set(item.id, item);
    } else if (item._tier === existing._tier && item._isPrimaryConcern && !existing._isPrimaryConcern) {
      seen.set(item.id, item);
    }
  }
  return Array.from(seen.values());
}
