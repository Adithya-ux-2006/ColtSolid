const GUEST_PROFILE_KEY = 'clotsolid_guest_profile';

export function getGuestProfile() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(GUEST_PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveGuestProfile(profile) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
}

export function getGuestAllergies() {
  return getGuestProfile().known_allergies ?? [];
}

const INGREDIENT_ALIASES = {
  'aloe-vera': ['aloe vera'],
  'turmeric': ['turmeric', 'curcumin'],
  'ginger': ['ginger', 'ginger root', 'ginger root extract'],
  'ashwagandha': ['ashwagandha', 'ashwagandha root extract'],
  'essential-oils': ['peppermint oil', 'menthol', 'herbal oil', 'essential oil'],
  'herbal': ['herbal', 'herbal oil', 'herbal supplement', 'cellulose capsule', 'cellulose'],
  'pollen': ['pollen', 'bee pollen'],
  'nuts': ['nuts'],
  'dairy': ['dairy', 'milk'],
};

function normalizeIngredient(ingredient) {
  return ingredient.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function allergyMatchesIngredient(allergy, ingredient) {
  const normalized = normalizeIngredient(ingredient);
  if (normalized.includes(allergy)) return true;

  const aliases = INGREDIENT_ALIASES[allergy] || [];
  return aliases.some((alias) => normalized.includes(alias));
}

export function remedyMatchesAllergies(remedy, allergies = []) {
  if (!remedy || !allergies.length) return false;

  const normalizedAllergies = allergies.map((a) => a.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()).filter(Boolean);

  const tags = (remedy.allergen_tags || []).map((t) => t.toLowerCase());
  for (const allergy of normalizedAllergies) {
    if (tags.some((tag) => tag === allergy || tag.includes(allergy) || allergy.includes(tag))) {
      return true;
    }
  }

  const ingredients = (remedy.ingredients || []).map(normalizeIngredient).filter(Boolean);
  for (const allergy of normalizedAllergies) {
    for (const ingredient of ingredients) {
      if (allergyMatchesIngredient(allergy, ingredient)) return true;
    }
  }

  return false;
}

export function remedyHasContraindication(remedy, conditions = []) {
  if (!remedy || !conditions?.length) return false;

  const normalizedConditions = conditions.map((c) => c.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()).filter(Boolean);
  const contraindications = (remedy.contraindications || []).map((c) => c.toLowerCase());

  return normalizedConditions.some((condition) =>
    contraindications.some((ci) => ci.includes(condition) || condition.includes(ci))
  );
}

export function getGuestConditions() {
  return getGuestProfile().common_conditions ?? [];
}

export function isRemedySafeForUser(remedy, { allergies, conditions }) {
  if (remedyMatchesAllergies(remedy, allergies)) return false;
  if (remedyHasContraindication(remedy, conditions)) return false;
  return true;
}
