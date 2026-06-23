import { resolveAnatomy } from '../data/anatomyMap';
import { resolveSensation } from '../data/sensationMap';
import { findContextModifiers } from '../data/contextMap';

export function composeSymptomScores(queryTokens, normalizedQuery) {
  const bodyParts = [];
  const sensations = [];
  const seenBodyTerms = new Set();
  const seenSensationTerms = new Set();

  for (const token of queryTokens) {
    const anatomy = resolveAnatomy(token);
    if (anatomy && !seenBodyTerms.has(anatomy.key)) {
      bodyParts.push(anatomy);
      seenBodyTerms.add(anatomy.key);
    }

    const sensation = resolveSensation(token);
    if (sensation && !seenSensationTerms.has(sensation.key)) {
      sensations.push(sensation);
      seenSensationTerms.add(sensation.key);
    }
  }

  const bodyPartKeys = new Set(bodyParts.map(bp => bp.key));
  const { boosts: contextBoosts } = findContextModifiers(normalizedQuery);

  const symptomScores = {};

  function addScore(symptomId, delta) {
    symptomScores[symptomId] = (symptomScores[symptomId] || 0) + delta;
  }

  for (const bp of bodyParts) {
    for (const entry of bp.entries) {
      addScore(entry.symptomId, entry.weight * 0.5);
    }
  }

  for (const sn of sensations) {
    for (const entry of sn.entries) {
      const sensationMatchScore = entry.weight * 0.35;

      const hasAffinity = entry.contextAffinity
        ? entry.contextAffinity.some(aff => bodyPartKeys.has(aff))
        : false;

      const affinityBonus = hasAffinity ? 0.2 : 0;

      addScore(entry.symptomId, sensationMatchScore + affinityBonus);
    }
  }

  for (const [symptomId, boost] of Object.entries(contextBoosts)) {
    addScore(symptomId, boost * 0.2);
  }

  const scores = Object.entries(symptomScores).map(([symptomId, raw]) => ({
    symptomId,
    score: Math.min(raw, 1.0),
  }));

  scores.sort((a, b) => b.score - a.score);

  return {
    scores,
    metadata: {
      matchedBodyParts: [...seenBodyTerms],
      matchedSensations: [...seenSensationTerms],
      contextTags: findContextModifiers(normalizedQuery).tags,
      hasAnyMatch: bodyParts.length > 0 || sensations.length > 0,
    },
    hasComposition: bodyParts.length > 0 || sensations.length > 0,
  };
}
