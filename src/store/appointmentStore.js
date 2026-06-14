import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { mapAppointment } from '../utils/mappers';

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  isLoading: false,

  clear: () => set({ appointments: [] }),

  fetchAppointments: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('apt_date', { ascending: true });
        
      if (error) throw error;
      set({ appointments: (data || []).map(mapAppointment) });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  add: async (appointment) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({ 
          user_id: user.id,
          title: appointment.title,
          doctor: appointment.doctor,
          location: appointment.location,
          apt_date: appointment.date,
          apt_time: appointment.time,
          notes: appointment.notes,
          type: appointment.type,
          status: appointment.status || 'Upcoming'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      set((state) => ({ appointments: [...state.appointments, mapAppointment(data)] }));
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  },

  update: async (id, updates) => {
    try {
      // Map frontend keys to DB columns if necessary
      const dbUpdates = {
        title: updates.title,
        doctor: updates.doctor,
        location: updates.location,
        apt_date: updates.date || updates.apt_date,
        apt_time: updates.time || updates.apt_time,
        notes: updates.notes,
        type: updates.type,
        status: updates.status
      };

      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

      const { data, error } = await supabase
        .from('appointments')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      set((state) => ({
        appointments: state.appointments.map(apt => apt.id === id ? mapAppointment(data) : apt)
      }));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        appointments: state.appointments.filter(apt => apt.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  },
}));
