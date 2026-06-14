import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (remedy) => {
        const { favorites } = get();
        if (!favorites.some(f => f.id === remedy.id)) {
          set({ favorites: [...favorites, remedy] });
        }
      },
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter(f => f.id !== id)
        }));
      },
      isFavorite: (id) => {
        return get().favorites.some(f => f.id === id);
      },
      toggleFavorite: (remedy) => {
        if (get().isFavorite(remedy.id)) {
          get().removeFavorite(remedy.id);
        } else {
          get().addFavorite(remedy);
        }
      }
    }),
    {
      name: 'clotsolid-favorites',
    }
  )
);
