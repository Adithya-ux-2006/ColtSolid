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
    name: profile?.name || metadata.name || '',
    university: profile?.university || metadata.university || '',
    year: profile?.year || metadata.year || '',
    gender: profile?.gender || metadata.gender || '',
    common_conditions: profile?.common_conditions ?? [],
    known_allergies: profile?.known_allergies ?? [],
    treatment_prefs: profile?.treatment_prefs ?? [],
    has_completed_onboarding: profile?.has_completed_onboarding ?? false,
    notify_nearby_launch: profile?.notify_nearby_launch ?? false,
    preferNatural: profile?.prefer_natural ?? false,
    avoidMedication: profile?.avoid_medication ?? false,
    vegetarianRemedies: profile?.vegetarian_remedies ?? false,
    avatar: metadata.avatar || getInitials(profile?.name || metadata.name || ''),
    ...profile,
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
            university: details.university,
            year: details.year,
            gender: details.gender || '',
            avatar,
          },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error('User signup did not return a user record.');

      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: details.name,
          university: details.university,
          year: details.year,
          gender: details.gender || '',
        })
        .eq('id', data.user.id);

      if (profileError) throw profileError;

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
        university: updates.university,
        year: updates.year,
        gender: updates.gender,
        prefer_natural: updates.preferNatural,
        avoid_medication: updates.avoidMedication,
        vegetarian_remedies: updates.vegetarianRemedies,
      };

      Object.keys(dbUpdates).forEach((key) => dbUpdates[key] === undefined && delete dbUpdates[key]);

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id);
        
      if (error) throw error;
      set((state) => ({ user: { ...state.user, ...updates } }));
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
