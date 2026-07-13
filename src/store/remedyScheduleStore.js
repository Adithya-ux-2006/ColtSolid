import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export const useRemedyScheduleStore = create((set, get) => ({
  schedules: [],
  isLoading: false,

  clear: () => set({ schedules: [] }),

  fetchSchedules: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('remedy_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      set({ schedules: data || [] });
    } catch (error) {
      console.error('Error fetching remedy schedules:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  add: async (schedule) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('remedy_schedules')
        .insert({
          user_id: user.id,
          remedy_id: schedule.remedyId,
          remedy_name: schedule.remedyName,
          scheduled_time: schedule.scheduledTime,
          recurrence: schedule.recurrence || 'daily',
          days_of_week: schedule.daysOfWeek || null,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ schedules: [...state.schedules, data] }));
      return { success: true, data };
    } catch (error) {
      console.error('Error adding remedy schedule:', error);
      return { success: false, error };
    }
  },

  update: async (id, updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('remedy_schedules')
        .update({
          scheduled_time: updates.scheduledTime,
          recurrence: updates.recurrence,
          days_of_week: updates.daysOfWeek,
          active: updates.active,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        schedules: state.schedules.map((s) => (s.id === id ? data : s)),
      }));
    } catch (error) {
      console.error('Error updating remedy schedule:', error);
    }
  },

  toggleActive: async (id) => {
    const schedule = get().schedules.find((s) => s.id === id);
    if (!schedule) return;
    await get().update(id, { active: !schedule.active });
  },

  remove: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('remedy_schedules')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting remedy schedule:', error);
    }
  },
}));
