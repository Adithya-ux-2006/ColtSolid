import { inferConcerns } from '../engine/clinicalReasoner';
import { rankRemedies } from '../engine/relevanceRanker';
import { filterUnsafeRemedies, adjustConfidence } from '../engine/safetyFilter';
import { groupResults } from '../engine/resultsGrouper';
import { isEmergencySymptom } from '../constants/emergency';

export function isEmergencyQuery(query) {
  return isEmergencySymptom(query);
}

export function matchQueryToSymptoms(query, symptoms) {
  if (!query || !symptoms?.length) return [];

  const normalized = query.toLowerCase().trim();
  if (isEmergencyQuery(normalized)) return [];

  const result = inferConcerns(query, symptoms);
  const allConcerns = [...result.primaryConcerns, ...result.secondaryConcerns];
  return allConcerns.map(c => c.id);
}

export function getRankedRemediesForSymptoms(
  symptomIds,
  symptomRemediesMap,
  remedies,
  options = {},
) {
  if (!symptomIds?.length || !remedies?.length) {
    return { primary: [], related: [], all: [] };
  }

  const {
    symptoms = [],
    allergies = [],
    conditions = [],
  } = options;

  const concerns = symptomIds.map(id => {
    const s = symptoms?.find(sym => sym.id === id);
    return { id, label: s?.label || id, emoji: s?.emoji, color: s?.color };
  });

  const userContext = {};
  if (allergies?.length) userContext.allergies = allergies;
  if (conditions?.length) userContext.conditions = conditions;

  const ranked = rankRemedies(remedies, concerns, symptomRemediesMap, { userContext });
  const safe = filterUnsafeRemedies(ranked, userContext);
  const adjusted = adjustConfidence(safe, null);

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
  };
}
