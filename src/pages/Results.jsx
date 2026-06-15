import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { mapTreatmentPrefsToFilters } from '../constants/onboarding';
import { cn } from '../utils/cn';

const FILTER_OPTIONS = ['All', 'Natural', 'TCM', 'Conventional', 'Lifestyle'];

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const symptomId = queryParams.get('symptom');
  const userTreatmentPrefs = useAuthStore((state) => state.user?.treatment_prefs ?? []);
  const defaultFilters = useMemo(() => {
    const mappedPrefs = mapTreatmentPrefsToFilters(userTreatmentPrefs);
    return mappedPrefs.length > 0 ? mappedPrefs : ['All'];
  }, [userTreatmentPrefs]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('Best Rated');
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);

  const symptom = symptoms.find(s => s.id === symptomId);

  useEffect(() => {
    setIsLoading(isCatalogLoading);
  }, [isCatalogLoading]);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters, symptomId]);

  const filteredAndSortedRemedies = useMemo(() => {
    if (!symptomId) return [];
    
    let result = remedies.filter(r => r.symptoms.includes(symptomId));
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
  }, [filters, remedies, sort, symptomId]);

  if (!hasLoaded && isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8 pt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton count={6} />
        </div>
      </PageWrapper>
    );
  }

  if (!symptom) {
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
                <span>{symptom.emoji}</span> {symptom.label}
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton count={6} />
          </div>
        ) : filteredAndSortedRemedies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRemedies.map(remedy => (
              <RemedyCard key={remedy.id} remedy={remedy} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={AlertCircle}
            title="No remedies match"
            description={`We couldn't find any ${filters.join(', ')} remedies for ${symptom.label}.`}
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
