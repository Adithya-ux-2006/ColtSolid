import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const mapRemedy = (remedy) => ({
  id: remedy.id,
  name: remedy.name,
  category: remedy.category,
  symptoms: remedy.remedy_symptoms?.map((item) => item.symptom_id) || [],
  rating: remedy.rating,
  reviewCount: remedy.review_count,
  shortDescription: remedy.short_description,
  longDescription: remedy.long_description,
  howToUse: remedy.how_to_use,
  warnings: remedy.warnings,
  timeToEffect: remedy.time_to_effect,
  difficulty: remedy.difficulty,
  cost: remedy.cost,
  isFeatured: remedy.is_featured,
  researchPapers: remedy.research_papers?.map((paper) => ({
    title: paper.title,
    journal: paper.journal,
    url: paper.url,
    keyFinding: paper.key_finding,
  })) || [],
});

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
          .select('*, remedy_symptoms(symptom_id), research_papers(title, journal, url, key_finding)')
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
