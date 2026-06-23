import { inferConcerns } from '../engine/clinicalReasoner';

export function resolveQuery(query, symptoms) {
  const result = inferConcerns(query, symptoms);

  const allConcerns = [...result.primaryConcerns, ...result.secondaryConcerns];

  return {
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
  };
}
