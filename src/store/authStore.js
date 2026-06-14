import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        set({ user: { ...session.user, ...profile }, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      set({ user: { ...data.user, ...profile }, isAuthenticated: true });
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
      // 1. Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password
      });
      if (error) throw error;

      // 2. Create profile
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
        isAuthenticated: true 
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
