import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate some mock appointments for initial state
const initialAppointments = [
  {
    id: 'apt_1',
    title: 'General Checkup',
    doctor: 'Dr. Sarah Jenkins',
    location: 'University Health Center',
    date: '2026-06-20',
    time: '10:00 AM',
    notes: 'Follow up on recent headaches.',
    type: 'General',
    status: 'Upcoming'
  },
  {
    id: 'apt_2',
    title: 'Dermatology Consult',
    doctor: 'Dr. Marcus Wong',
    location: 'Downtown Skin Clinic',
    date: '2026-05-15',
    time: '02:30 PM',
    notes: 'Acne prescription renewal.',
    type: 'Specialist',
    status: 'Completed'
  }
];

export const useAppointmentStore = create(
  persist(
    (set) => ({
      appointments: initialAppointments,
      add: (appointment) => set((state) => ({
        appointments: [...state.appointments, { ...appointment, id: `apt_${Date.now()}` }]
      })),
      update: (id, updates) => set((state) => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? { ...apt, ...updates } : apt
        )
      })),
      delete: (id) => set((state) => ({
        appointments: state.appointments.filter(apt => apt.id !== id)
      })),
    }),
    {
      name: 'clotsolid-appointments',
    }
  )
);
