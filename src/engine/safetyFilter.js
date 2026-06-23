export function filterUnsafeRemedies(remedies, userContext) {
  if (!remedies?.length) return [];
  if (!userContext) {
    return remedies.map(r => ({
      ...r,
      _safetyReason: r._safetyReason || 'Safety check passed',
      _safe: true,
    }));
  }

  const { allergies, conditions } = userContext;

  const result = [];

  for (const remedy of remedies) {
    const allergyConflict = allergies?.length ? findAllergyConflict(remedy, allergies) : null;
    const contraindicationConflict = conditions?.length ? findContraindicationConflict(remedy, conditions) : null;

    const isUnsafe = allergyConflict || contraindicationConflict;

    const reasons = [];
    if (allergyConflict) reasons.push(`Hidden due to allergy conflict: ${allergyConflict}`);
    if (contraindicationConflict) reasons.push(`Hidden due to contraindication: ${contraindicationConflict}`);
    if (!reasons.length && userContext) {
      if (allergies?.length) reasons.push('No allergy conflicts detected');
      if (conditions?.length) reasons.push('No contraindications detected');
      if (!reasons.length) reasons.push('Safety check passed');
    }

    if (!isUnsafe) {
      result.push({
        ...remedy,
        _safe: true,
        _safetyReason: reasons.join('. '),
      });
    }
  }

  return result;
}

function findAllergyConflict(remedy, allergies) {
  const normalizedAllergies = allergies.map(a =>
    a.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  const tags = (remedy.allergen_tags || []).map(t => t.toLowerCase());
  for (const allergy of normalizedAllergies) {
    if (tags.some(tag => tag === allergy || tag.includes(allergy) || allergy.includes(tag))) {
      return allergy;
    }
  }

  const ingredients = (remedy.ingredients || []).map(i =>
    i.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  for (const allergy of normalizedAllergies) {
    for (const ingredient of ingredients) {
      if (ingredient.includes(allergy) || allergy.includes(ingredient)) {
        return allergy + ' (ingredient match)';
      }
    }
  }

  const title = (remedy.name || '').toLowerCase();
  for (const allergy of normalizedAllergies) {
    if (title.includes(allergy)) {
      return allergy + ' (name match)';
    }
  }

  return null;
}

function findContraindicationConflict(remedy, conditions) {
  const normalizedConditions = conditions.map(c =>
    c.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  const contraindications = (remedy.contraindications || []).map(c => c.toLowerCase());

  for (const condition of normalizedConditions) {
    for (const ci of contraindications) {
      if (ci.includes(condition) || condition.includes(ci)) {
        return condition;
      }
    }
  }

  return null;
}

export function adjustConfidence(remedies, queryConfidence) {
  if (!remedies?.length) return [];
  if (queryConfidence == null || queryConfidence >= 60) {
    return remedies.map(r => ({
      ...r,
      _confidenceReason: r._confidenceReason || 'Strong match to known symptom',
    }));
  }

  const confidenceRatio = Math.max(queryConfidence / 60, 0.15);

  return remedies.map(remedy => ({
    ...remedy,
    _relevanceScore: Math.round(remedy._relevanceScore * confidenceRatio),
    _partialMatch: true,
    _originalQueryConfidence: queryConfidence,
    _confidenceReason: queryConfidence >= 30
      ? 'Partial match — results may be less specific'
      : 'Weak match — consider rephrasing your search',
  }));
}

export { findAllergyConflict, findContraindicationConflict };
