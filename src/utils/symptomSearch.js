import { rankRemedies } from '../engine/relevanceRanker';
import { filterUnsafeRemedies, adjustConfidence } from '../engine/safetyFilter';
import { groupResults } from '../engine/resultsGrouper';
import { buildKnowledgeContext } from '../engine/knowledgeGraph';
import { isEmergencySymptom } from '../constants/emergency';
import { findBestSemanticMatch } from '../engine/semanticFallback';

export function isEmergencyQuery(query) {
  return isEmergencySymptom(query);
}

export function getRankedRemediesForSymptoms(
  symptomIds,
  symptomRemediesMap,
  remedies,
  options = {},
) {
  if (!symptomIds?.length || !remedies?.length) {
    return { primary: [], related: [], all: [], grouped: null };
  }

  const {
    symptoms = [],
    allergies = [],
    conditions = [],
    isChildSafe = false,
    treatmentPrefs = [],
    queryConfidence = null,
    primarySymptomId = null,
    popularityMap = {},
  } = options;

  const concerns = symptomIds.map(id => {
    const s = symptoms?.find(sym => sym.id === id);
    return { id, label: s?.label || id, emoji: s?.emoji, color: s?.color, isPrimary: primarySymptomId ? id === primarySymptomId : true };
  });

  const userContext = {};
  if (allergies?.length) userContext.allergies = allergies;
  if (conditions?.length) userContext.conditions = conditions;
  if (isChildSafe) userContext.isChildSafe = isChildSafe;
  if (treatmentPrefs?.length) userContext.treatmentPrefs = treatmentPrefs;

  const knowledgeCtx = buildKnowledgeContext(symptomIds, symptoms);

  const ranked = rankRemedies(remedies, concerns, symptomRemediesMap, {
    userContext,
    symptoms,
    popularityMap,
  });

  const safe = filterUnsafeRemedies(ranked, userContext);
  const adjusted = adjustConfidence(safe, queryConfidence);

  const grouped = groupResults(adjusted);

  const primary = [];
  const related = [];

  if (grouped.bestMatch) primary.push(grouped.bestMatch);
  primary.push(...grouped.bestMatches);

  related.push(...grouped.additionalOptions);
  related.push(...grouped.supportive);

  return {
    primary,
    related,
    all: [grouped.bestMatch, ...grouped.bestMatches, ...grouped.additionalOptions, ...grouped.supportive].filter(Boolean),
    grouped,
    knowledgeCtx,
  };
}

/**
 * Attempt semantic fallback when deterministic + NLU resolution both fail.
 * Returns the matched symptom ID if a confident match is found, else null.
 */
export async function resolveWithSemanticFallback(query) {
  if (!query || query.trim().length < 3) return null;

  try {
    const match = await findBestSemanticMatch(query);
    return match?.symptomId || null;
  } catch {
    return null;
  }
}
