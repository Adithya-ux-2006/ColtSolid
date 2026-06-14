import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { mapRemedy } from '../utils/mappers';

export const useCatalogStore = create((set, get) => ({
  symptoms: [],
  remedies: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCatalog: async () => {
    if (get().isLoading || get().hasLoaded) return;

    set({ isLoading: true, error: null });

    try {
      const [{ data: symptoms, error: symptomsError }, { data: remedies, error: remediesError }] = await Promise.all([
        supabase.from('symptoms').select('*').order('label'),
        supabase
          .from('remedies')
          .select('*, remedy_symptoms(symptom_id), research_papers(title, journal, url, key_findings)')
          .order('name'),
      ]);

      if (symptomsError) throw symptomsError;
      if (remediesError) throw remediesError;

      set({
        symptoms: (symptoms || []).map((symptom) => ({
          id: symptom.id,
          label: symptom.label,
          emoji: symptom.emoji,
          color: symptom.color_theme,
        })),
        remedies: (remedies || []).map(mapRemedy),
        isLoading: false,
        hasLoaded: true,
      });
    } catch (error) {
      console.error('Error fetching catalog:', error);
      set({ error, isLoading: false, hasLoaded: true });
    }
  },
}));
