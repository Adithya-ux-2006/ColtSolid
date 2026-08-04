import { create } from 'zustand';
import { getGuestProfile, saveGuestProfile } from '../utils/guestProfile';

const GUEST_ALLERGIES_KEY = 'clotsolid_guest_allergies';
const GUEST_CONDITIONS_KEY = 'clotsolid_guest_conditions';
const GUEST_CHILD_SAFE_KEY = 'clotsolid_guest_child_safe';

function readArr(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeArr(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const useGuestProfileStore = create((set, get) => {
  // Initialise from localStorage (legacy guestProfile + dedicated keys)
  const legacy = getGuestProfile();
  const initialAllergies = readArr(GUEST_ALLERGIES_KEY);
  const initialConditions = readArr(GUEST_CONDITIONS_KEY);
  const initialChildSafe = typeof window === 'undefined' ? false : window.localStorage.getItem(GUEST_CHILD_SAFE_KEY) === 'true' || legacy.is_child_safe || false;

  // Migrate from legacy guestProfile if dedicated keys are empty
  if (initialAllergies.length === 0 && legacy.known_allergies?.length) {
    writeArr(GUEST_ALLERGIES_KEY, legacy.known_allergies);
  }
  if (initialConditions.length === 0 && legacy.common_conditions?.length) {
    writeArr(GUEST_CONDITIONS_KEY, legacy.common_conditions);
  }

  return {
    known_allergies: initialAllergies.length > 0 ? initialAllergies : (legacy.known_allergies ?? []),
    common_conditions: initialConditions.length > 0 ? initialConditions : (legacy.common_conditions ?? []),
    gender: legacy.gender ?? '',
    is_child_safe: initialChildSafe,

    setAllergies: (allergies) => {
      writeArr(GUEST_ALLERGIES_KEY, allergies);
      // Also sync to legacy guestProfile for backward compat
      const existing = getGuestProfile();
      saveGuestProfile({ ...existing, known_allergies: allergies });
      set({ known_allergies: allergies });
    },

    setConditions: (conditions) => {
      writeArr(GUEST_CONDITIONS_KEY, conditions);
      const existing = getGuestProfile();
      saveGuestProfile({ ...existing, common_conditions: conditions });
      set({ common_conditions: conditions });
    },

    setGender: (gender) => {
      const existing = getGuestProfile();
      saveGuestProfile({ ...existing, gender });
      set({ gender });
    },

    setIsChildSafe: (isChildSafe) => {
      if (typeof window !== 'undefined') window.localStorage.setItem(GUEST_CHILD_SAFE_KEY, String(isChildSafe));
      const existing = getGuestProfile();
      saveGuestProfile({ ...existing, is_child_safe: isChildSafe });
      set({ is_child_safe: isChildSafe });
    },

    updateProfile: (updates) => {
      const state = get();
      const allergies = updates.known_allergies ?? state.known_allergies;
      const conditions = updates.common_conditions ?? state.common_conditions;
      const gender = updates.gender ?? state.gender;
      const isChildSafe = updates.is_child_safe ?? state.is_child_safe;

      writeArr(GUEST_ALLERGIES_KEY, allergies);
      writeArr(GUEST_CONDITIONS_KEY, conditions);
      if (typeof window !== 'undefined') window.localStorage.setItem(GUEST_CHILD_SAFE_KEY, String(isChildSafe));
      saveGuestProfile({ known_allergies: allergies, common_conditions: conditions, gender, is_child_safe: isChildSafe });
      set({ known_allergies: allergies, common_conditions: conditions, gender, is_child_safe: isChildSafe });
    },

    clearProfile: () => {
      writeArr(GUEST_ALLERGIES_KEY, []);
      writeArr(GUEST_CONDITIONS_KEY, []);
      if (typeof window !== 'undefined') window.localStorage.removeItem(GUEST_CHILD_SAFE_KEY);
      saveGuestProfile({ known_allergies: [], common_conditions: [], gender: '', is_child_safe: false });
      set({ known_allergies: [], common_conditions: [], gender: '', is_child_safe: false });
    },
  };
});
