import { inferConcerns } from '../engine/clinicalReasoner';

function normalizeQuery(value) {
  return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function buildStrictMatches(query, symptoms) {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery || !symptoms?.length) return [];

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return symptoms
    .map((symptom) => {
      const normalizedLabel = normalizeQuery(symptom.label);
      const labelTokens = normalizedLabel.split(/\s+/).filter(Boolean);
      const overlapCount = labelTokens.filter((token) => queryTokens.includes(token)).length;
      const coversFullLabel = labelTokens.length > 0 && overlapCount === labelTokens.length;
      const isExactLabelMatch = normalizedQuery === normalizedLabel;

      let score = 0;
      if (isExactLabelMatch) score = 10000;
      else if (normalizedQuery.includes(normalizedLabel)) score = 8000;
      else if (normalizedLabel.includes(normalizedQuery)) score = 7000;
      else if (coversFullLabel) score = 6000 + overlapCount * 100;
      else if (overlapCount > 0 && overlapCount >= Math.ceil(labelTokens.length * 0.5)) score = 3000 + overlapCount * 200;

      if (score === 0) return null;

      return {
        id: symptom.id,
        label: symptom.label,
        emoji: symptom.emoji,
        score,
        isExactMatch: isExactLabelMatch,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);
}

export function resolveQuery(query, symptoms, geminiInterpretation) {
  const result = inferConcerns(query, symptoms);
  const strictMatches = buildStrictMatches(query, symptoms);

  const concernMap = new Map();
  for (const concern of [...result.primaryConcerns, ...result.secondaryConcerns]) {
    concernMap.set(concern.id, concern);
  }
  for (const strictMatch of strictMatches) {
    if (!concernMap.has(strictMatch.id)) {
      concernMap.set(strictMatch.id, strictMatch);
    }
  }

  const strictIds = strictMatches.map((match) => match.id);
  const inferredConcerns = [...result.primaryConcerns, ...result.secondaryConcerns]
    .filter((concern) => !strictIds.includes(concern.id));
  
  const hasExactStructuralMatch = strictMatches.some(m => m.isExactMatch);
  const strictPrimaryId = hasExactStructuralMatch
    ? strictMatches.find(m => m.isExactMatch)?.id
    : (strictMatches[0]?.id || result.primaryConcerns[0]?.id || null);

  const allConcerns = [...strictMatches, ...inferredConcerns];
  const basePrimaryId = strictPrimaryId;

  const base = {
    symptomIds: allConcerns.map(c => c.id),
    relatedIds: [],
    allSymptomIds: allConcerns.map(c => c.id),
    confidence: result.confidence,
    allMatches: allConcerns.map(c => ({
      id: c.id,
      score: Math.round(c.score * 100),
    })),
    primarySymptom: basePrimaryId
      ? symptoms.find(s => s.id === basePrimaryId) || null
      : null,
    primarySymptomId: basePrimaryId,
    topSymptoms: allConcerns.map(c => ({
      id: c.id,
      label: c.label,
      emoji: c.emoji,
      score: c.score,
    })),
    hasNegation: result.hasNegation,
    matchedPhrases: result.matchedPhrases,
    queryContext: result.queryContext,
    userIntent: result.userIntent,
    severity: result.severity,
    emergencyIndicators: result.emergencyIndicators,
    hasExactStructuralMatch,
  };

  if (!geminiInterpretation) {
    return base;
  }

  const validGeminiIds = new Set(symptoms.map(s => s.id));
  const geminiPrimary = (geminiInterpretation.primarySymptoms || []).filter(id => validGeminiIds.has(id));
  const geminiSecondary = (geminiInterpretation.secondarySymptoms || []).filter(id => validGeminiIds.has(id));

  if (geminiPrimary.length === 0 && geminiSecondary.length === 0) {
    return base;
  }

  const engineIdSet = new Set(base.symptomIds);
  const geminiOnlySecondary = geminiSecondary.filter(id => !engineIdSet.has(id));

  const geminiPrimarySet = new Set(geminiPrimary);
  const baseNonGemini = base.symptomIds.filter(id => !geminiPrimarySet.has(id));

  const geminiConfidence = Math.round((geminiInterpretation.confidence || 0.5) * 100);

  let filteredBase;
  if (geminiPrimary.length > 0 && geminiConfidence >= 60) {
    filteredBase = baseNonGemini.filter(id => {
      if (geminiPrimarySet.has(id)) return false;
      if (geminiSecondary.includes(id)) return true;
      const geminiPrimarySymptom = symptoms.find(s => geminiPrimarySet.has(s.id));
      const candidateSymptom = symptoms.find(s => s.id === id);
      if (!geminiPrimarySymptom || !candidateSymptom) return false;
      const primaryLabel = geminiPrimarySymptom.label.toLowerCase();
      const candidateLabel = candidateSymptom.label.toLowerCase();
      const primaryTokens = primaryLabel.split(/\s+/);
      const candidateTokens = candidateLabel.split(/\s+/);
      const shared = primaryTokens.filter(t => candidateTokens.includes(t)).length;
      return shared > 0;
    });
  } else {
    filteredBase = baseNonGemini;
  }

  const mergedIds = [...geminiPrimary, ...geminiOnlySecondary, ...filteredBase];
  const uniqueMergedIds = [...new Set(mergedIds)];
  const mergedConfidence = Math.max(base.confidence, geminiConfidence);

  const geminiSeverity = geminiInterpretation.severity || null;
  const mergedSeverity = geminiSeverity || base.severity;

  const geminiContext = {
    ...(base.queryContext || {}),
    bodyLocations: geminiInterpretation.bodyLocations || [],
    sensations: geminiInterpretation.sensations || [],
    duration: geminiInterpretation.duration || '',
    possibleContexts: geminiInterpretation.possibleContexts || [],
  };

  const matchedGeminiSymptom = geminiPrimary.length > 0
    ? symptoms.find(s => s.id === geminiPrimary[0]) || base.primarySymptom
    : base.primarySymptom;

  return {
    ...base,
    symptomIds: uniqueMergedIds,
    allSymptomIds: uniqueMergedIds,
    confidence: mergedConfidence,
    primarySymptom: matchedGeminiSymptom,
    primarySymptomId: geminiPrimary[0] || base.primarySymptomId,
    severity: mergedSeverity,
    queryContext: geminiContext,
    geminiEnhanced: true,
  };
}
