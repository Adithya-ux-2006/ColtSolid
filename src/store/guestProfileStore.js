import { create } from 'zustand';
import { getGuestProfile, saveGuestProfile } from '../utils/guestProfile';

const GUEST_ALLERGIES_KEY = 'clotsolid_guest_allergies';
const GUEST_CONDITIONS_KEY = 'clotsolid_guest_conditions';

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

    updateProfile: (updates) => {
      const state = get();
      const allergies = updates.known_allergies ?? state.known_allergies;
      const conditions = updates.common_conditions ?? state.common_conditions;
      const gender = updates.gender ?? state.gender;

      writeArr(GUEST_ALLERGIES_KEY, allergies);
      writeArr(GUEST_CONDITIONS_KEY, conditions);
      saveGuestProfile({ known_allergies: allergies, common_conditions: conditions, gender });
      set({ known_allergies: allergies, common_conditions: conditions, gender });
    },

    clearProfile: () => {
      writeArr(GUEST_ALLERGIES_KEY, []);
      writeArr(GUEST_CONDITIONS_KEY, []);
      saveGuestProfile({ known_allergies: [], common_conditions: [], gender: '' });
      set({ known_allergies: [], common_conditions: [], gender: '' });
    },
  };
});
