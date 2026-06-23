import { getSymptomGraphEntry } from '../data/symptomGraph';

export function getRelatedSymptomIds(symptomId) {
  const entry = getSymptomGraphEntry(symptomId);
  return entry?.relatedSymptoms || [];
}

export function getPossibleCauses(symptomId) {
  const entry = getSymptomGraphEntry(symptomId);
  return entry?.possibleCauses || [];
}

export function getSeverityFlags(symptomId) {
  const entry = getSymptomGraphEntry(symptomId);
  return entry?.severityFlags || ['mild'];
}

export function getEmergencyFlags(symptomId) {
  const entry = getSymptomGraphEntry(symptomId);
  return entry?.emergencyFlags || [];
}

export function expandToRelatedSymptoms(symptomIds, maxDepth = 1) {
  const result = new Set(symptomIds);

  for (let depth = 0; depth < maxDepth; depth++) {
    const current = [...result];
    for (const id of current) {
      const related = getRelatedSymptomIds(id);
      for (const r of related) {
        result.add(r);
      }
    }
  }

  return [...result];
}

export function matchEmergencyFlags(symptomId, query) {
  const flags = getEmergencyFlags(symptomId);
  if (!flags.length || !query) return [];

  const normalized = query.toLowerCase();
  return flags.filter(flag => {
    const normalizedFlag = flag.toLowerCase();
    return normalized.includes(normalizedFlag)
      || normalizedFlag.split(/\s+/).some(word =>
        word.length > 3 && normalized.includes(word)
      );
  });
}

export function buildKnowledgeContext(symptomIds, symptoms) {
  const symptomMap = {};
  for (const s of symptoms || []) {
    symptomMap[s.id] = s;
  }

  const context = [];
  const seenIds = new Set();

  for (const id of symptomIds) {
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const entry = getSymptomGraphEntry(id);
    const symptom = symptomMap[id];

    context.push({
      id,
      label: symptom?.label || id,
      emoji: symptom?.emoji,
      color: symptom?.color,
      relatedSymptoms: entry?.relatedSymptoms?.map(rid => ({
        id: rid,
        label: symptomMap[rid]?.label || rid,
      })) || [],
      possibleCauses: entry?.possibleCauses || [],
      severityFlags: entry?.severityFlags || ['mild'],
      emergencyFlags: entry?.emergencyFlags || [],
    });
  }

  return context;
}

export function hasEmergencyIndicators(symptomId) {
  const flags = getEmergencyFlags(symptomId);
  return flags.length > 0;
}
