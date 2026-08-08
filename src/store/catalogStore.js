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

function buildLocalSymptomRemedies(remedies = []) {
  const map = {};

  remedies.forEach((remedy, remedyIndex) => {
    for (const symptomId of remedy.primarySymptoms || remedy.symptoms || []) {
      if (!map[symptomId]) map[symptomId] = [];
      map[symptomId].push({
        remedyId: remedy.id,
        evidenceScore: 8,
        priorityRank: Math.max(1, 1000 - remedyIndex),
      });
    }

    for (const symptomId of remedy.secondarySymptoms || []) {
      if (!map[symptomId]) map[symptomId] = [];
      map[symptomId].push({
        remedyId: remedy.id,
        evidenceScore: 4,
        priorityRank: Math.max(1, 500 - remedyIndex),
      });
    }
  });

  return map;
}

async function loadLocalCatalog() {
  const [{ SYMPTOMS }, { REMEDIES }] = await Promise.all([
    import('../data/symptoms'),
    import('../data/remedies'),
  ]);

  return {
    symptoms: SYMPTOMS.map((s) => ({
      id: s.id,
      label: s.label,
      emoji: s.emoji,
      color: s.color,
    })),
    remedies: REMEDIES.map(mapRemedy),
    symptomRemedies: buildLocalSymptomRemedies(REMEDIES),
  };
}

function mergeById(primary = [], fallback = []) {
  const seen = new Set(primary.map((item) => item.id));
  return [
    ...primary,
    ...fallback.filter((item) => item?.id && !seen.has(item.id)),
  ];
}

function mergeSymptomRemedies(primary = {}, fallback = {}) {
  const merged = { ...primary };

  for (const [symptomId, localItems] of Object.entries(fallback || {})) {
    const existing = merged[symptomId] || [];
    const seenRemedies = new Set(existing.map((item) => item.remedyId));
    const additions = (localItems || []).filter((item) => item?.remedyId && !seenRemedies.has(item.remedyId));
    merged[symptomId] = [...existing, ...additions];
  }

  return merged;
}

function buildPopularityMap(rows) {
  const map = {};
  for (const row of rows || []) {
    const sid = row.symptom_id;
    if (!map[sid]) map[sid] = {};
    map[sid][row.remedy_id] = row.popularity_score || 0;
  }
  return map;
}

async function enrichWithLocalCatalog(catalog) {
  const local = await loadLocalCatalog();
  return {
    symptoms: mergeById(catalog.symptoms, local.symptoms),
    remedies: mergeById(catalog.remedies, local.remedies),
    symptomRemedies: mergeSymptomRemedies(catalog.symptomRemedies, local.symptomRemedies),
  };
}

export const useCatalogStore = create((set, get) => ({
  symptoms: [],
  remedies: [],
  symptomRemedies: {},
  popularityMap: {},
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
        const { data: srRows, error: srError } = await supabase.from('remedy_symptoms').select('*');
        if (srError) {
          console.warn('[CATALOG] remedy_symptoms query failed:', srError.message || srError);
        } else if (srRows) {
          symptomRemediesData = buildSymptomRemediesMap(srRows);
        }
      } catch (srError) {
        console.warn('[CATALOG] remedy_symptoms table not available, using default ranking:', srError.message || srError);
      }

      // Load popularity data (non-blocking — failure doesn't prevent catalog load)
      let popularityMap = {};
      try {
        const { data: popRows, error: popError } = await supabase.from('remedy_popularity').select('*');
        if (!popError && popRows) {
          popularityMap = buildPopularityMap(popRows);
        }
      } catch {
        // Popularity table may not exist yet — that's fine
      }

      const hasData = (symptoms?.length > 0 || remedies?.length > 0);
      if (!hasData) throw new Error('No data returned from Supabase');

      const enriched = await enrichWithLocalCatalog({
        symptoms: (symptoms || []).map((s) => ({
          id: s.id,
          label: s.label,
          emoji: s.emoji,
          color: s.color_theme,
        })),
        remedies: (remedies || []).map(mapRemedy),
        symptomRemedies: symptomRemediesData,
      });

      set({
        ...enriched,
        popularityMap,
        isLoading: false,
        hasLoaded: true,
      });
    } catch (error) {
      console.warn('[CATALOG] Supabase catalog unavailable, falling back to local data:', error.message || error);
      const local = await loadLocalCatalog();
      set({
        ...local,
        popularityMap: {},
        error,
        isLoading: false,
        hasLoaded: true,
      });
    }
  },
}));

if (import.meta.env.DEV) {
  window.__ZUSTAND_STORE__ = useCatalogStore;
}
