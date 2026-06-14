import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUser } from '../data/mockUser';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (credentials) => {
        // Mock login: always succeed with mock user, but use provided name/email if any
        set({
          user: {
            ...mockUser,
            name: credentials?.name || mockUser.name,
            email: credentials?.email || mockUser.email,
            university: credentials?.university || mockUser.university,
            year: credentials?.year || mockUser.year,
            avatar: (credentials?.name || mockUser.name).split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
          },
          isAuthenticated: true
        });
      },
      register: (details) => {
        set({
          user: {
            ...mockUser,
            ...details,
            avatar: details.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
          },
          isAuthenticated: true
        });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      }))
    }),
    {
      name: 'clotsolid-auth',
    }
  )
);
