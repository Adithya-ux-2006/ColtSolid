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
  if (!allergies.length) return false;

  return (remedy.allergen_tags || []).some((tag) => allergies.includes(tag));
}
