import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getInitials } from '../utils/mappers';
import { clearQuickSaves, getQuickSaves } from '../utils/quickSave';

async function importQuickSavedFavorites(userId) {
  const quickSaves = getQuickSaves();
  const remedyIds = quickSaves?.remedyIds || [];

  if (remedyIds.length === 0) return;

  const rows = remedyIds.map((remedyId) => ({ user_id: userId, remedy_id: remedyId }));
  const { error } = await supabase.from('favorites').upsert(rows, { onConflict: 'user_id,remedy_id' });

  if (error) throw error;

  clearQuickSaves();
}

async function updateUserProfileRow(userId, updates) {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (!error) return;

  const isMissingNewColumn = /column .* does not exist/i.test(error.message || '')
    || /could not find the '.*' column of 'users' in the schema cache/i.test(error.message || '');
  if (!isMissingNewColumn) throw error;

  const fallbackUpdates = {
    name: updates.name,
    university: updates.university_name ?? updates.university,
    year: updates.current_year ?? updates.year,
    gender: updates.gender,
    prefer_natural: updates.prefer_natural,
    avoid_medication: updates.avoid_medication,
    vegetarian_remedies: updates.vegetarian_remedies,
  };

  Object.keys(fallbackUpdates).forEach((key) => fallbackUpdates[key] === undefined && delete fallbackUpdates[key]);

  const { error: fallbackError } = await supabase
    .from('users')
    .update(fallbackUpdates)
    .eq('id', userId);

  if (fallbackError) throw fallbackError;
}

const buildUser = async (session) => {
  if (!session?.user) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  const metadata = session.user.user_metadata || {};

  if (error) throw error;

  return {
    ...session.user,
    ...profile,
    name: profile?.name || metadata.name || '',
    university_email: profile?.university_email || metadata.university_email || '',
    university_name: profile?.university_name || profile?.university || metadata.university_name || metadata.university || '',
    current_year: profile?.current_year || profile?.year || metadata.current_year || metadata.year || '',
    university: profile?.university_name || profile?.university || metadata.university_name || metadata.university || '',
    year: profile?.current_year || profile?.year || metadata.current_year || metadata.year || '',
    gender: profile?.gender || metadata.gender || '',
    common_conditions: profile?.common_conditions ?? [],
    known_allergies: profile?.known_allergies ?? [],
    treatment_prefs: profile?.treatment_prefs ?? [],
    has_completed_onboarding: profile?.has_completed_onboarding ?? false,
    is_admin: profile?.is_admin ?? false,
    notify_nearby_launch: profile?.notify_nearby_launch ?? false,
    preferNatural: profile?.prefer_natural ?? false,
    avoidMedication: profile?.avoid_medication ?? false,
    vegetarianRemedies: profile?.vegetarian_remedies ?? false,
    avatar: metadata.avatar || getInitials(profile?.name || metadata.name || ''),
  };
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  authSubscription: null,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = await buildUser(session);
        set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },

  initialize: async () => {
    if (get().authSubscription) return () => {};

    await get().checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (!session) {
          set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
          return;
        }

        const user = await buildUser(session);
        set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
      } catch (error) {
        console.error('Auth state change error:', error);
        set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
      }
    });

    set({ authSubscription: subscription });

    return () => {
      subscription.unsubscribe();
      set({ authSubscription: null });
    };
  },

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = await buildUser({ user: data.user });
      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (details) => {
    set({ isLoading: true });
    try {
      const avatar = getInitials(details.name);
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: {
            name: details.name,
            university_email: details.universityEmail || '',
            university_name: details.universityName || '',
            current_year: details.currentYear || '',
            gender: details.gender || '',
            avatar,
          },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error('User signup did not return a user record.');

      await updateUserProfileRow(data.user.id, {
        name: details.name,
        university_email: details.universityEmail || '',
        university_name: details.universityName || '',
        current_year: details.currentYear || '',
        university: details.universityName || '',
        year: details.currentYear || '',
        gender: details.gender || '',
      });

      if (data.session) {
        await importQuickSavedFavorites(data.user.id);
        const user = await buildUser(data.session);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });

        const { useFavoritesStore } = await import('./favoritesStore');
        await useFavoritesStore.getState().fetchFavorites();
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }

      return {
        success: true,
        needsEmailConfirmation: !data.session,
        hasCompletedOnboarding: data.session ? (get().user?.has_completed_onboarding ?? false) : false,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: async (updates) => {
    const { user } = get();
    if (!user) return;
    
    try {
      const dbUpdates = {
        name: updates.name,
        university_email: updates.universityEmail,
        university_name: updates.universityName,
        current_year: updates.currentYear,
        university: updates.universityName,
        year: updates.currentYear,
        gender: updates.gender,
        prefer_natural: updates.preferNatural,
        avoid_medication: updates.avoidMedication,
        vegetarian_remedies: updates.vegetarianRemedies,
      };

      Object.keys(dbUpdates).forEach((key) => dbUpdates[key] === undefined && delete dbUpdates[key]);

      const metadataUpdates = {
        name: updates.name,
        university_email: updates.universityEmail,
        university_name: updates.universityName,
        current_year: updates.currentYear,
        gender: updates.gender,
      };

      Object.keys(metadataUpdates).forEach((key) => metadataUpdates[key] === undefined && delete metadataUpdates[key]);

      if (Object.keys(metadataUpdates).length > 0) {
        const { error: authUpdateError } = await supabase.auth.updateUser({ data: metadataUpdates });
        if (authUpdateError) throw authUpdateError;
      }

      await updateUserProfileRow(user.id, dbUpdates);
      set((state) => ({
        user: {
          ...state.user,
          ...updates,
          university_name: updates.universityName ?? state.user.university_name,
          current_year: updates.currentYear ?? state.user.current_year,
          university_email: updates.universityEmail ?? state.user.university_email,
          university: updates.universityName ?? state.user.university,
          year: updates.currentYear ?? state.user.year,
        },
      }));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  },

  saveOnboarding: async ({ commonConditions, knownAllergies, treatmentPrefs }) => {
    const { user } = get();
    if (!user) {
      return { success: false, error: new Error('No authenticated user found.') };
    }

    try {
      const updates = {
        common_conditions: commonConditions,
        known_allergies: knownAllergies,
        treatment_prefs: treatmentPrefs,
        has_completed_onboarding: true,
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        user: {
          ...state.user,
          ...updates,
        },
      }));

      return { success: true };
    } catch (error) {
      console.error('Save onboarding error:', error);
      return { success: false, error };
    }
  },

  enableNearbyLaunchNotification: async () => {
    const { user } = get();
    if (!user) return { success: false, error: new Error('No authenticated user found.') };

    try {
      const { error } = await supabase
        .from('users')
        .update({ notify_nearby_launch: true })
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        user: {
          ...state.user,
          notify_nearby_launch: true,
        },
      }));

      return { success: true };
    } catch (error) {
      console.error('Enable nearby launch notification error:', error);
      return { success: false, error };
    }
  }
}));
