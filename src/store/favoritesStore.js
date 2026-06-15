import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { mapRemedy } from '../utils/mappers';
import { trackRemedyEvent } from '../utils/analytics';

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoading: false,

  fetchFavorites: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    try {
      // We fetch favorite records and join with remedies
      const { data, error } = await supabase
        .from('favorites')
        .select('*, remedies(*)')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const remedies = data.map((favorite) => mapRemedy(favorite.remedies));
      set({ favorites: remedies });
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: async (remedy) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Optimistic update
    const { favorites } = get();
    if (!favorites.some(f => f.id === remedy.id)) {
      set({ favorites: [...favorites, remedy] });
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, remedy_id: remedy.id });
         
      if (error) throw error;

      trackRemedyEvent({
        remedyId: remedy.id,
        eventType: 'saved',
        metadata: { method: 'favorites' },
      }).catch(() => {});
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Revert optimistic update
      set({ favorites: favorites.filter(f => f.id !== remedy.id) });
    }
  },

  removeFavorite: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Optimistic update
    const { favorites } = get();
    set({ favorites: favorites.filter(f => f.id !== id) });

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: user.id, remedy_id: id });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Revert optimistic update by re-fetching
      get().fetchFavorites();
    }
  },

  isFavorite: (id) => {
    return get().favorites.some(f => f.id === id);
  },

  clear: () => set({ favorites: [] }),

  toggleFavorite: (remedy) => {
    if (get().isFavorite(remedy.id)) {
      get().removeFavorite(remedy.id);
    } else {
      get().addFavorite(remedy);
    }
  }
}));
