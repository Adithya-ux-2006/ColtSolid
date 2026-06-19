import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { mapRemedy } from '../utils/mappers';

function buildSymptomRemediesMap(rows) {
  const map = {};
  for (const row of rows || []) {
    const sid = row.symptom_id;
    if (!map[sid]) map[sid] = [];
    map[sid].push({
      remedyId: row.remedy_id,
      evidenceScore: row.evidence_score,
      priorityRank: row.priority_rank,
    });
  }
  return map;
}

export const useCatalogStore = create((set, get) => ({
  symptoms: [],
  remedies: [],
  symptomRemedies: {},
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCatalog: async () => {
    if (get().isLoading || get().hasLoaded) return;

    set({ isLoading: true, error: null });

    try {
      const [
        { data: symptoms, error: symptomsError },
        { data: remedies, error: remediesError },
      ] = await Promise.all([
        supabase.from('symptoms').select('*').order('label'),
        supabase
          .from('remedies')
          .select('*, remedy_symptoms(symptom_id, match_strength), research_papers(title, journal, url, key_findings)')
          .order('name'),
      ]);

      if (symptomsError) throw symptomsError;
      if (remediesError) throw remediesError;

      let symptomRemediesData = {};
      try {
        const { data: srRows, error: srError } = await supabase.from('symptom_remedies').select('*');
        if (!srError && srRows) {
          symptomRemediesData = buildSymptomRemediesMap(srRows);
        }
      } catch (srError) {
        console.warn('symptom_remedies table not available, using default ranking:', srError);
      }

      set({
        symptoms: (symptoms || []).map((s) => ({
          id: s.id,
          label: s.label,
          emoji: s.emoji,
          color: s.color_theme,
        })),
        remedies: (remedies || []).map(mapRemedy),
        symptomRemedies: symptomRemediesData,
        isLoading: false,
        hasLoaded: true,
      });
    } catch (error) {
      console.error('Error fetching catalog:', error);
      set({ error, isLoading: false, hasLoaded: true });
    }
  },
}));
