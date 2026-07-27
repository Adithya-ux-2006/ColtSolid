import { create } from 'zustand';

export const useQuickScheduleStore = create((set) => ({
  remedy: null,
  openQuickSchedule: (remedy) => set({ remedy }),
  closeQuickSchedule: () => set({ remedy: null }),
}));
