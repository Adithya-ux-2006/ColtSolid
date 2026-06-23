export { inferConcerns, buildSymptomIndex } from './clinicalReasoner';
export { rankRemedies, classifyRelationship, REMEDY_TIER } from './relevanceRanker';
export { filterUnsafeRemedies, adjustConfidence } from './safetyFilter';
export { groupResults, SECTION } from './resultsGrouper';
export {
  getRelatedSymptomIds,
  getPossibleCauses,
  getSeverityFlags,
  getEmergencyFlags,
  expandToRelatedSymptoms,
  matchEmergencyFlags,
  buildKnowledgeContext,
  hasEmergencyIndicators,
} from './knowledgeGraph';
