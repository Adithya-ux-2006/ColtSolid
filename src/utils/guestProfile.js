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

export function remedyMatchesAllergies(remedy, allergies = []) {
  if (!remedy || !allergies.length) return false;

  return (remedy.allergen_tags || []).some((tag) => allergies.includes(tag));
}

export function remedyHasContraindication(remedy, conditions = []) {
  if (!remedy || !conditions?.length) return false;

  return (remedy.contraindications || []).some((ci) => conditions.includes(ci));
}

export function getGuestConditions() {
  return getGuestProfile().common_conditions ?? [];
}

export function isRemedySafeForUser(remedy, { allergies, conditions }) {
  if (remedyMatchesAllergies(remedy, allergies)) return false;
  if (remedyHasContraindication(remedy, conditions)) return false;
  return true;
}
