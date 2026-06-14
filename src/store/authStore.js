import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const buildUser = async (session) => {
  if (!session?.user) return null;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;

  return { ...session.user, ...profile };
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
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password
      });
      if (error) throw error;
      if (!data.user) throw new Error('User signup did not return a user record.');

      const avatar = details.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          name: details.name,
          university: details.university,
          year: details.year,
          avatar
        });
        
      if (profileError) throw profileError;

      set({ 
        user: { ...data.user, name: details.name, university: details.university, year: details.year, avatar },
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      });
      return { success: true };
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
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      set((state) => ({ user: { ...state.user, ...updates } }));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  }
}));
