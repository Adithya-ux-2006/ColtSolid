import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { mapTreatmentPrefsToFilters } from '../constants/onboarding';
import { cn } from '../utils/cn';

const FILTER_OPTIONS = ['All', 'Natural', 'TCM', 'Conventional', 'Lifestyle'];
const VIEWED_SYMPTOMS_KEY = 'clotsolid_viewed_symptoms';
const HISTORY_DISMISSED_KEY = 'clotsolid_history_dismissed';
const EMPTY_ARRAY = [];
const HISTORY_LABELS = {
  headache: 'Headache',
  cold: 'Cold & Flu',
  anxiety: 'Anxiety & Stress',
  insomnia: 'Sleep Issues',
  nausea: 'Nausea',
  stress: 'Stress',
};

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const symptomId = queryParams.get('symptom');
  const aiQuery = queryParams.get('query') || '';
  const searchSource = queryParams.get('source');
  const aiSymptomIds = useMemo(
    () => (queryParams.get('symptoms') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    [location.search]
  );
  const userTreatmentPrefs = useAuthStore((state) => state.user?.treatment_prefs ?? EMPTY_ARRAY);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const defaultFilters = useMemo(() => {
    const mappedPrefs = mapTreatmentPrefsToFilters(userTreatmentPrefs);
    return mappedPrefs.length > 0 ? mappedPrefs : ['All'];
  }, [userTreatmentPrefs]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('Best Rated');
  const [viewedSymptoms, setViewedSymptoms] = useState([]);
  const [hideHistoryTeaser, setHideHistoryTeaser] = useState(false);
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);
  const isAiSearch = searchSource === 'ai' && aiSymptomIds.length > 0;
  const selectedSymptomIds = useMemo(
    () => (isAiSearch ? Array.from(new Set(aiSymptomIds)) : symptomId ? [symptomId] : []),
    [aiSymptomIds, isAiSearch, symptomId]
  );

  const symptom = symptoms.find(s => s.id === symptomId);
  const detectedSymptoms = useMemo(
    () => symptoms.filter((item) => selectedSymptomIds.includes(item.id)),
    [selectedSymptomIds, symptoms]
  );

  useEffect(() => {
    setIsLoading(isCatalogLoading);
  }, [isCatalogLoading]);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters, symptomId]);

  useEffect(() => {
    const isDismissed = window.localStorage.getItem(HISTORY_DISMISSED_KEY) === 'true';
    setHideHistoryTeaser(isDismissed);

    if (isAuthenticated || selectedSymptomIds.length === 0) return;

    const raw = window.localStorage.getItem(VIEWED_SYMPTOMS_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const next = selectedSymptomIds.reduce((accumulator, currentSymptomId) => {
      const withoutCurrent = accumulator.filter((item) => item !== currentSymptomId);
      return [...withoutCurrent, currentSymptomId].slice(-6);
    }, current);

    window.localStorage.setItem(VIEWED_SYMPTOMS_KEY, JSON.stringify(next));
    setViewedSymptoms(next);
  }, [isAuthenticated, selectedSymptomIds]);

  const filteredAndSortedRemedies = useMemo(() => {
    if (selectedSymptomIds.length === 0) return [];

    let result = remedies
      .map((remedy) => ({
        ...remedy,
        matchCount: selectedSymptomIds.filter((selectedSymptomId) => remedy.symptoms.includes(selectedSymptomId)).length,
      }))
      .filter((remedy) => remedy.matchCount > 0);

    const activeFilters = filters.includes('All') ? [] : filters;
    
    if (activeFilters.length > 0) {
      result = result.filter(r => activeFilters.includes(r.category));
    }

    result.sort((a, b) => {
      if (sort === 'Best Rated') return b.matchCount - a.matchCount || b.rating - a.rating;
      if (sort === 'Most Researched') return b.matchCount - a.matchCount || b.reviewCount - a.reviewCount;
      if (sort === 'Easiest') {
        const diffMap = { 'Easy': 1, 'Moderate': 2, 'Requires prescription': 3 };
        return b.matchCount - a.matchCount || diffMap[a.difficulty] - diffMap[b.difficulty];
      }
      return 0;
    });

    return result;
  }, [filters, remedies, selectedSymptomIds, sort]);

  if (!hasLoaded && isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8 pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton count={6} />
        </div>
      </PageWrapper>
    );
  }

  if (!isAiSearch && !symptom) {
    return (
      <PageWrapper className="min-h-screen bg-snow pt-20 px-6">
        <EmptyState 
          icon={AlertCircle}
          title="Symptom not found"
          description="Please select a valid symptom from the search page."
          ctaLabel="Go to Search"
          ctaHref="/search"
        />
      </PageWrapper>
    );
  }

  const toggleFilter = (value) => {
    if (value === 'All') {
      setFilters(['All']);
      return;
    }

    setFilters((current) => {
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current.filter((item) => item !== 'All'), value];

      return next.length > 0 ? next : ['All'];
    });
  };

  const viewedLabels = viewedSymptoms.slice(0, 2).map((item) => HISTORY_LABELS[item] || item);
  const shouldShowHistoryTeaser = !isAuthenticated && !hideHistoryTeaser && viewedSymptoms.length >= 2;
  const historyHeadline = viewedLabels.length > 1
    ? `${viewedLabels[0]} and ${viewedLabels[1]}${viewedSymptoms.length > 2 ? ' and more' : ''}`
    : viewedLabels[0];
  const emptyStateContext = isAiSearch
    ? detectedSymptoms.map((detectedSymptom) => detectedSymptom.label).join(', ')
    : symptom?.label || 'your selected symptoms';

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-6 pb-4 px-6 sticky top-0 md:top-16 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-ink-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                {isAiSearch ? (
                  <>
                    <span>AI Matched Remedies</span>
                  </>
                ) : (
                  <>
                    <span>{symptom.emoji}</span> {symptom.label}
                  </>
                )}
              </h1>
              <p className="text-sm text-ink-muted">
                {isLoading ? 'Finding remedies...' : `${filteredAndSortedRemedies.length} remedies found`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    filters.includes(f)
                      ? "bg-ink text-white" 
                      : "bg-gray-100 text-ink hover:bg-gray-200"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-ink-muted" />
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-ink-muted font-medium focus:outline-none focus:text-ink cursor-pointer"
              >
                <option value="Best Rated">Best Rated</option>
                <option value="Most Researched">Most Researched</option>
                <option value="Easiest">Easiest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        {isAiSearch ? (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-forest">Detected symptoms</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detectedSymptoms.map((detectedSymptom) => (
                <span
                  key={detectedSymptom.id}
                  className="rounded-full bg-sage/20 px-3 py-1.5 text-sm font-medium text-forest"
                >
                  {detectedSymptom.emoji} {detectedSymptom.label}
                </span>
              ))}
            </div>
            {aiQuery ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Based on: "{aiQuery}"
              </p>
            ) : null}
          </div>
        ) : null}

        {shouldShowHistoryTeaser ? (
          <div className="mb-4 rounded-2xl border-l-4 border-forest bg-sage/20 p-4 text-sm text-forest">
            <p className="font-semibold">🧠 We noticed you've looked at {historyHeadline} remedies</p>
            <p className="mt-2 leading-relaxed">
              Sign up to track your symptom history and spot patterns over time.
            </p>
            <div className="mt-3 flex gap-3">
              <Link to="/register" className="font-semibold text-forest underline-offset-4 hover:underline">Sign Up Free</Link>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem(HISTORY_DISMISSED_KEY, 'true');
                  setHideHistoryTeaser(true);
                }}
                className="text-forest/80"
              >
                Not now
              </button>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton count={6} />
          </div>
        ) : filteredAndSortedRemedies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedRemedies.map(remedy => (
                <RemedyCard key={remedy.id} remedy={remedy} />
              ))}
            </div>

            {!isAuthenticated ? (
              <div className="mx-4 mt-6 rounded-2xl border border-forest bg-forest/5 p-5">
                <p className="text-lg font-semibold text-forest">🌿 Finding what you need?</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Sign up free to save remedies, track appointments, and get a personalized dashboard built around your symptoms.
                </p>
                <div className="mt-4 space-y-2">
                  <Link to="/register" className="block rounded-xl bg-forest px-4 py-3 text-center text-sm font-semibold text-white">
                    Sign Up Free - Always Free
                  </Link>
                  <Link to="/login" className="block text-center text-sm font-semibold text-forest">
                    Log In
                  </Link>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState 
            icon={AlertCircle}
            title="No remedies match"
            description={`We couldn't find any ${filters.join(', ')} remedies for ${emptyStateContext}.`}
            ctaLabel="Back to Search"
            ctaHref="/search"
          />
        )}
        
        {!isLoading && filteredAndSortedRemedies.length === 0 && (
         <div className="text-center mt-[-20px]">
             <button onClick={() => setFilters(['All'])} className="text-forest font-medium hover:underline">
               Clear Filters
              </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
