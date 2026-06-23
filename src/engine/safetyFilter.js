export function filterUnsafeRemedies(remedies, userContext) {
  if (!remedies?.length) return [];
  if (!userContext) return [...remedies];

  const { allergies, conditions } = userContext || {};

  return remedies.filter(remedy => {
    if (allergies?.length && remedyMatchesAllergies(remedy, allergies)) return false;
    if (conditions?.length && remedyHasContraindication(remedy, conditions)) return false;
    return true;
  });
}

function remedyMatchesAllergies(remedy, allergies) {
  if (!allergies?.length) return false;

  const normalizedAllergies = allergies.map(a =>
    a.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  const tags = (remedy.allergen_tags || []).map(t => t.toLowerCase());
  for (const allergy of normalizedAllergies) {
    if (tags.some(tag => tag === allergy || tag.includes(allergy) || allergy.includes(tag))) {
      return true;
    }
  }

  const ingredients = (remedy.ingredients || []).map(i =>
    i.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  for (const allergy of normalizedAllergies) {
    for (const ingredient of ingredients) {
      if (ingredient.includes(allergy) || allergy.includes(ingredient)) {
        return true;
      }
    }
  }

  return false;
}

function remedyHasContraindication(remedy, conditions) {
  if (!conditions?.length) return false;

  const normalizedConditions = conditions.map(c =>
    c.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
  ).filter(Boolean);

  const contraindications = (remedy.contraindications || []).map(c => c.toLowerCase());

  return normalizedConditions.some(condition =>
    contraindications.some(ci => ci.includes(condition) || condition.includes(ci))
  );
}

export function adjustConfidence(remedies, queryConfidence) {
  if (!remedies?.length) return [];
  if (queryConfidence == null || queryConfidence >= 60) return remedies;

  const confidenceRatio = queryConfidence / 60;

  return remedies.map(remedy => ({
    ...remedy,
    _relevanceScore: Math.round(remedy._relevanceScore * confidenceRatio),
    _partialMatch: true,
    _originalQueryConfidence: queryConfidence,
  }));
}
