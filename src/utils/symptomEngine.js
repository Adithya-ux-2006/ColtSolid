import { inferConcerns } from '../engine/clinicalReasoner';

export function resolveQuery(query, symptoms, geminiInterpretation) {
  const result = inferConcerns(query, symptoms);

  const allConcerns = [...result.primaryConcerns, ...result.secondaryConcerns];

  const base = {
    symptomIds: allConcerns.map(c => c.id),
    relatedIds: [],
    allSymptomIds: allConcerns.map(c => c.id),
    confidence: result.confidence,
    allMatches: allConcerns.map(c => ({
      id: c.id,
      score: Math.round(c.score * 100),
    })),
    primarySymptom: result.primaryConcerns.length > 0
      ? symptoms.find(s => s.id === result.primaryConcerns[0].id) || null
      : null,
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
  };

  if (!geminiInterpretation) {
    console.log('[RESOLVE] No Gemini interpretation — using deterministic engine only');
    return base;
  }

  console.log('[RESOLVE] Gemini interpretation received:', JSON.stringify(geminiInterpretation).slice(0, 300));

  const validGeminiIds = new Set(symptoms.map(s => s.id));
  const geminiPrimary = (geminiInterpretation.primarySymptoms || []).filter(id => validGeminiIds.has(id));
  const geminiSecondary = (geminiInterpretation.secondarySymptoms || []).filter(id => validGeminiIds.has(id));

  if (geminiPrimary.length === 0 && geminiSecondary.length === 0) {
    console.log('[RESOLVE] Gemini returned no valid symptom IDs — falling back to base');
    return base;
  }

  const engineIdSet = new Set(base.symptomIds);
  const geminiOnlySecondary = geminiSecondary.filter(id => !engineIdSet.has(id));

  const mergedIds = [...geminiPrimary, ...geminiOnlySecondary, ...base.symptomIds.filter(id => !geminiPrimary.includes(id))];
  const uniqueMergedIds = [...new Set(mergedIds)];

  const geminiConfidence = Math.round((geminiInterpretation.confidence || 0.5) * 100);
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

  console.log('[RESOLVE] Merged IDs:', uniqueMergedIds, 'gemini primary:', geminiPrimary, 'confidence:', mergedConfidence);

  return {
    ...base,
    symptomIds: uniqueMergedIds,
    allSymptomIds: uniqueMergedIds,
    confidence: mergedConfidence,
    primarySymptom: matchedGeminiSymptom,
    severity: mergedSeverity,
    queryContext: geminiContext,
    geminiEnhanced: true,
  };
}
