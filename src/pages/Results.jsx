import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { getClosestSymptomCategory, searchRemedies } from '../hooks/useSearch';
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
  const symptomParam = queryParams.get('symptom');
  const queryParam = queryParams.get('q') || '';
  const userTreatmentPrefs = useAuthStore((state) => state.user?.treatment_prefs ?? EMPTY_ARRAY);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const defaultFilters = useMemo(() => {
    const mappedPrefs = mapTreatmentPrefsToFilters(userTreatmentPrefs);
    return mappedPrefs.length > 0 ? mappedPrefs : ['All'];
  }, [userTreatmentPrefs]);

  const [filterState, setFilterState] = useState(null);
  const [sort, setSort] = useState('Best Rated');
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);
  const [fallbackMatch, setFallbackMatch] = useState({ query: '', category: null });
  const isFreeTextSearch = Boolean(queryParam.trim());
  const closestCategory = fallbackMatch.query === queryParam ? fallbackMatch.category : null;
  const isLoading = isCatalogLoading;
  const selectedSymptomIds = useMemo(
    () => (symptomParam ? [symptomParam] : closestCategory && closestCategory !== 'none' ? [closestCategory] : []),
    [closestCategory, symptomParam]
  );
  const filterContextKey = useMemo(
    () => `${selectedSymptomIds.join(',')}|${defaultFilters.join(',')}`,
    [defaultFilters, selectedSymptomIds]
  );

  const symptom = symptoms.find(s => s.id === symptomParam);
  const filters = filterState?.key === filterContextKey ? filterState.values : defaultFilters;
  const [hideHistoryTeaser, setHideHistoryTeaser] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(HISTORY_DISMISSED_KEY) === 'true'
  );

  useEffect(() => {
    if (!isFreeTextSearch || isCatalogLoading || searchRemedies(queryParam, remedies).length > 0) {
      return;
    }

    let isCurrent = true;

    getClosestSymptomCategory(queryParam)
      .then((category) => {
        if (isCurrent) setFallbackMatch({ query: queryParam, category });
      })
      .catch(() => {
        if (isCurrent) setFallbackMatch({ query: queryParam, category: 'none' });
      });

    return () => {
      isCurrent = false;
    };
  }, [isCatalogLoading, isFreeTextSearch, queryParam, remedies]);

  useEffect(() => {
    if (isAuthenticated || selectedSymptomIds.length === 0 || isFreeTextSearch) return;

    const raw = window.localStorage.getItem(VIEWED_SYMPTOMS_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const next = selectedSymptomIds.reduce((accumulator, currentSymptomId) => {
      const withoutCurrent = accumulator.filter((item) => item !== currentSymptomId);
      return [...withoutCurrent, currentSymptomId].slice(-6);
    }, current);

    window.localStorage.setItem(VIEWED_SYMPTOMS_KEY, JSON.stringify(next));
  }, [isAuthenticated, isFreeTextSearch, selectedSymptomIds]);

  const viewedSymptoms = typeof window === 'undefined'
    ? []
    : (() => {
        const raw = window.localStorage.getItem(VIEWED_SYMPTOMS_KEY);
        return raw ? JSON.parse(raw) : [];
      })();

  const filteredAndSortedRemedies = useMemo(() => {
    const localQueryResults = isFreeTextSearch ? searchRemedies(queryParam, remedies) : [];
    if (isFreeTextSearch && localQueryResults.length > 0) {
      let result = localQueryResults.map((remedy) => ({ ...remedy, matchCount: 1 }));
      const activeFilters = filters.includes('All') ? [] : filters;

      if (activeFilters.length > 0) {
        result = result.filter(r => activeFilters.includes(r.category));
      }

      result.sort((a, b) => {
        if (sort === 'Best Rated') return b.rating - a.rating;
        if (sort === 'Most Researched') return b.reviewCount - a.reviewCount;
        if (sort === 'Easiest') {
          const diffMap = { 'Easy': 1, 'Moderate': 2, 'Requires prescription': 3 };
          return diffMap[a.difficulty] - diffMap[b.difficulty];
        }
        return 0;
      });

      return result;
    }

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
  }, [filters, isFreeTextSearch, queryParam, remedies, selectedSymptomIds, sort]);

  if (!hasLoaded && isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8 pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton count={6} />
        </div>
      </PageWrapper>
    );
  }

  if (!isFreeTextSearch && !symptom) {
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
      setFilterState({ key: filterContextKey, values: ['All'] });
      return;
    }

    setFilterState((currentState) => {
      const currentFilters = currentState?.key === filterContextKey ? currentState.values : filters;
      const next = currentFilters.includes(value)
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters.filter((item) => item !== 'All'), value];

      return {
        key: filterContextKey,
        values: next.length > 0 ? next : ['All'],
      };
    });
  };

  const viewedLabels = viewedSymptoms.slice(0, 2).map((item) => HISTORY_LABELS[item] || item);
  const shouldShowHistoryTeaser = !isAuthenticated && !hideHistoryTeaser && viewedSymptoms.length >= 2;
  const historyHeadline = viewedLabels.length > 1
    ? `${viewedLabels[0]} and ${viewedLabels[1]}${viewedSymptoms.length > 2 ? ' and more' : ''}`
    : viewedLabels[0];
  const isClosestMatch = isFreeTextSearch && searchRemedies(queryParam, remedies).length === 0 && closestCategory && closestCategory !== 'none';
  const emptyStateContext = isFreeTextSearch ? `"${queryParam}"` : symptom?.label || 'your selected symptoms';
  const headerTitle = isFreeTextSearch ? `Results for '${queryParam}'` : `Remedies for ${symptom?.label || ''}`;

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
                {!isFreeTextSearch && symptom?.emoji ? <span>{symptom.emoji}</span> : null}
                {headerTitle}
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
        {isClosestMatch ? (
          <div className="mb-4 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-forest shadow-sm">
            Showing closest results for "{queryParam}"
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
            description={isFreeTextSearch ? `We couldn't find exact or close matches for ${emptyStateContext}. Try the AI Health Assistant from the side icon for personalised advice.` : `We couldn't find any ${filters.join(', ')} remedies for ${emptyStateContext}.`}
            ctaLabel="Back to Search"
            ctaHref="/search"
          />
        )}
        
        {!isLoading && filteredAndSortedRemedies.length === 0 && (
         <div className="text-center mt-[-20px]">
             <button onClick={() => setFilterState({ key: filterContextKey, values: ['All'] })} className="text-forest font-medium hover:underline">
                Clear Filters
               </button>
           </div>
        )}
      </div>
    </PageWrapper>
  );
}
