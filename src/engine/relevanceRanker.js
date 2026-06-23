import { buildKnowledgeContext } from './knowledgeGraph';

export const REMEDY_TIER = {
  DIRECT: 0,
  ASSOCIATED: 1,
  SUPPORTIVE: 2,
};

const TIER_LABELS = {
  [REMEDY_TIER.DIRECT]: 'Directly addresses this concern',
  [REMEDY_TIER.ASSOCIATED]: 'Helps manage associated symptoms',
  [REMEDY_TIER.SUPPORTIVE]: 'Provides general wellness support',
};

export function classifyRelationship(remedy, symptomId) {
  const isPrimary = remedy.primarySymptoms?.includes(symptomId);
  const isSecondary = remedy.secondarySymptoms?.includes(symptomId);

  if (isPrimary) return REMEDY_TIER.DIRECT;
  if (isSecondary) return REMEDY_TIER.ASSOCIATED;
  return REMEDY_TIER.SUPPORTIVE;
}

function getTierReason(tier, symptomLabel) {
  if (!symptomLabel) return TIER_LABELS[tier] || 'Recommended remedy';
  switch (tier) {
    case REMEDY_TIER.DIRECT:
      return `Directly addresses ${symptomLabel}`;
    case REMEDY_TIER.ASSOCIATED:
      return `Helps manage symptoms associated with ${symptomLabel}`;
    case REMEDY_TIER.SUPPORTIVE:
      return `Supports overall wellness alongside ${symptomLabel} care`;
    default:
      return `Recommended for your health needs`;
  }
}

function computeSafetyScore(remedy) {
  let score = 100;

  const allergens = (remedy.allergen_tags || []).length;
  if (allergens > 0) score -= allergens * 5;

  const contraindications = (remedy.contraindications || []).length;
  if (contraindications > 0) score -= contraindications * 10;

  const warnings = (remedy.warnings || '').length;
  if (warnings > 50) score -= 10;

  return Math.max(score, 0);
}

function getSafetyReason(remedy, userContext) {
  const reasons = [];

  if (remedy._allergyConflict) {
    reasons.push(`Hidden due to allergy conflict: ${remedy._allergyConflict}`);
  }
  if (remedy._contraindicationConflict) {
    reasons.push(`Hidden due to contraindication: ${remedy._contraindicationConflict}`);
  }

  if (!reasons.length && userContext?.allergies?.length) {
    reasons.push('No allergy conflicts detected');
  }
  if (!reasons.length && userContext?.conditions?.length) {
    reasons.push('No contraindications detected');
  }
  if (!reasons.length) {
    reasons.push('Safety check passed');
  }

  return reasons.join('. ');
}

function getConfidenceReason(queryConfidence) {
  if (!queryConfidence || queryConfidence >= 60) {
    return 'Strong match to known symptom';
  }
  if (queryConfidence >= 30) {
    return 'Partial match — results may be less specific';
  }
  return 'Weak match — consider rephrasing your search';
}

function computeDirectScore(evidenceScore, priorityRank) {
  let score = 60;
  if (evidenceScore) score += evidenceScore * 6;
  if (priorityRank != null) score += Math.min(priorityRank, 10) * 2;
  return score;
}

function computeAssociatedScore(evidenceScore, priorityRank) {
  let score = 40;
  if (evidenceScore) score += evidenceScore * 5;
  if (priorityRank != null) score += Math.min(priorityRank, 10) * 1.5;
  return score;
}

function computeSupportiveScore(rating) {
  let score = 20;
  if (rating) score += Math.round(rating * 8);
  return score;
}

function computeUserContextPenalty(remedy, userContext) {
  if (!userContext) return 0;

  let penalty = 0;
  const { allergies, conditions } = userContext;

  if (allergies?.length) {
    const remedyAllergens = (remedy.allergen_tags || []).map(t => t.toLowerCase());
    for (const allergy of allergies.map(a => a.toLowerCase())) {
      if (remedyAllergens.some(t => t.includes(allergy) || allergy.includes(t))) {
        penalty += 40;
        remedy._allergyConflict = allergy;
      }
    }

    const ingredients = (remedy.ingredients || []).map(i =>
      i.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
    );
    for (const allergy of allergies.map(a => a.toLowerCase())) {
      for (const ingredient of ingredients) {
        if (ingredient.includes(allergy) || allergy.includes(ingredient)) {
          penalty += 40;
          remedy._allergyConflict = allergy + ' (ingredient)';
        }
      }
    }
  }

  if (conditions?.length) {
    const contraindications = (remedy.contraindications || []).map(c => c.toLowerCase());
    for (const condition of conditions.map(c => c.toLowerCase())) {
      if (contraindications.some(ci => ci.includes(condition) || condition.includes(ci))) {
        penalty += 40;
        remedy._contraindicationConflict = condition;
      }
    }
  }

  return penalty;
}

export function rankRemedies(remedies, concerns, symptomRemediesMap, options = {}) {
  if (!remedies?.length || !concerns?.length) return [];

  const { userContext, symptoms, queryConfidence } = options;

  const primaryIds = new Set(concerns.map(c => c.id));
  const remedyMap = {};
  for (const r of remedies) remedyMap[r.id] = r;

  const knowledgeCtx = buildKnowledgeContext(
    concerns.map(c => c.id),
    symptoms || []
  );

  const scored = [];

  for (const concern of concerns) {
    const symptomId = concern.id;
    const isPrimaryConcern = primaryIds.has(symptomId);
    const knowledge = knowledgeCtx.find(k => k.id === symptomId);

    const curatedEntries = symptomRemediesMap?.[symptomId] || [];
    const processed = new Set();

    // Phase 1: Process catalogued entries (from symptom_remedies table)
    for (const entry of curatedEntries) {
      const remedy = remedyMap[entry.remedyId];
      if (!remedy || processed.has(remedy.id)) continue;
      processed.add(remedy.id);

      const tier = classifyRelationship(remedy, symptomId);
      const safetyScore = computeSafetyScore(remedy);
      const penalty = computeUserContextPenalty(remedy, userContext);

      let baseScore;
      if (tier === REMEDY_TIER.DIRECT) {
        baseScore = computeDirectScore(entry.evidenceScore, entry.priorityRank);
      } else if (tier === REMEDY_TIER.ASSOCIATED) {
        baseScore = computeAssociatedScore(entry.evidenceScore, entry.priorityRank);
      } else {
        baseScore = computeSupportiveScore(remedy.rating);
      }

      const score = Math.max(0, baseScore - penalty);

      scored.push({
        ...remedy,
        _matchSymptomId: symptomId,
        _matchSymptomLabel: concern.label,
        _isPrimaryConcern: isPrimaryConcern,
        _tier: tier,
        _tierLabel: TIER_LABELS[tier],
        _evidenceScore: entry.evidenceScore || 0,
        _priorityRank: entry.priorityRank || 0,
        _safetyScore: safetyScore,
        _relevanceScore: Math.round(score),
        _relevanceReason: getTierReason(tier, concern.label),
        _safetyReason: getSafetyReason(remedy, userContext),
        _confidenceReason: getConfidenceReason(queryConfidence),
        _primaryFor: remedy.primarySymptoms || [],
        _secondaryFor: remedy.secondarySymptoms || [],
        _supportiveFor: [],
      });
    }

    // Phase 2: Process remedies linked via primary/secondary arrays (local fallback)
    for (const remedy of remedies) {
      if (processed.has(remedy.id)) continue;

      const tier = classifyRelationship(remedy, symptomId);
      if (tier === REMEDY_TIER.SUPPORTIVE) continue;

      processed.add(remedy.id);

      const safetyScore = computeSafetyScore(remedy);
      const penalty = computeUserContextPenalty(remedy, userContext);

      let baseScore;
      if (tier === REMEDY_TIER.DIRECT) {
        const paperCount = remedy.researchPapers?.length || 0;
        const evidenceScore = Math.min(paperCount * 3, 10);
        baseScore = computeDirectScore(evidenceScore, 5);
      } else {
        const paperCount = remedy.researchPapers?.length || 0;
        const evidenceScore = Math.min(paperCount * 3, 10);
        baseScore = computeAssociatedScore(evidenceScore, 3);
      }

      const score = Math.max(0, baseScore - penalty);

      scored.push({
        ...remedy,
        _matchSymptomId: symptomId,
        _matchSymptomLabel: concern.label,
        _isPrimaryConcern: isPrimaryConcern,
        _tier: tier,
        _tierLabel: TIER_LABELS[tier],
        _evidenceScore: 0,
        _priorityRank: 0,
        _safetyScore: safetyScore,
        _relevanceScore: Math.round(score),
        _relevanceReason: getTierReason(tier, concern.label),
        _safetyReason: getSafetyReason(remedy, userContext),
        _confidenceReason: getConfidenceReason(queryConfidence),
        _primaryFor: remedy.primarySymptoms || [],
        _secondaryFor: remedy.secondarySymptoms || [],
        _supportiveFor: [],
      });
    }

    // Phase 3: Supportive remedies from related symptoms
    if (knowledge) {
      for (const related of knowledge.relatedSymptoms) {
        const relatedEntries = symptomRemediesMap?.[related.id] || [];
        for (const entry of relatedEntries) {
          const remedy = remedyMap[entry.remedyId];
          if (!remedy || processed.has(remedy.id)) continue;
          processed.add(remedy.id);

          const safetyScore = computeSafetyScore(remedy);
          const penalty = computeUserContextPenalty(remedy, userContext);
          const baseScore = computeSupportiveScore(remedy.rating);
          const score = Math.max(0, baseScore - penalty);

          scored.push({
            ...remedy,
            _matchSymptomId: symptomId,
            _matchSymptomLabel: concern.label,
            _isPrimaryConcern: false,
            _tier: REMEDY_TIER.SUPPORTIVE,
            _tierLabel: TIER_LABELS[REMEDY_TIER.SUPPORTIVE],
            _evidenceScore: entry.evidenceScore || 0,
            _priorityRank: entry.priorityRank || 0,
            _safetyScore: safetyScore,
            _relevanceScore: Math.round(score),
            _relevanceReason: `Supports overall wellness alongside ${concern.label} care`,
            _safetyReason: getSafetyReason(remedy, userContext),
            _confidenceReason: getConfidenceReason(queryConfidence),
            _primaryFor: remedy.primarySymptoms || [],
            _secondaryFor: remedy.secondarySymptoms || [],
            _supportiveFor: [related.id],
          });
        }
      }
    }
  }

  const deduped = dedupeRemedies(scored);

  deduped.sort((a, b) => {
    if (a._tier !== b._tier) return a._tier - b._tier;
    if (a._isPrimaryConcern !== b._isPrimaryConcern) {
      return a._isPrimaryConcern ? -1 : 1;
    }
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
