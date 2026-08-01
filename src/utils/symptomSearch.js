import { rankRemedies } from '../engine/relevanceRanker';
import { filterUnsafeRemedies, adjustConfidence } from '../engine/safetyFilter';
import { groupResults } from '../engine/resultsGrouper';
import { buildKnowledgeContext } from '../engine/knowledgeGraph';
import { isEmergencySymptom } from '../constants/emergency';

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
    ageRange = '',
    queryConfidence = null,
    primarySymptomId = null,
  } = options;

  const concerns = symptomIds.map(id => {
    const s = symptoms?.find(sym => sym.id === id);
    return { id, label: s?.label || id, emoji: s?.emoji, color: s?.color, isPrimary: primarySymptomId ? id === primarySymptomId : true };
  });

  const userContext = {};
  if (allergies?.length) userContext.allergies = allergies;
  if (conditions?.length) userContext.conditions = conditions;
  if (ageRange) userContext.ageRange = ageRange;

  const knowledgeCtx = buildKnowledgeContext(symptomIds, symptoms);

  const ranked = rankRemedies(remedies, concerns, symptomRemediesMap, {
    userContext,
    symptoms,
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
