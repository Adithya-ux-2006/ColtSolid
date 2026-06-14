import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState } from '../components/ui';
import { SYMPTOMS } from '../data/symptoms';
import { REMEDIES } from '../data/remedies';
import { cn } from '../utils/cn';

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const symptomId = queryParams.get('symptom');

  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Best Rated');

  const symptom = SYMPTOMS.find(s => s.id === symptomId);

  useEffect(() => {
    // Fake loading delay
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [symptomId]);

  const filteredAndSortedRemedies = useMemo(() => {
    if (!symptomId) return [];
    
    let result = REMEDIES.filter(r => r.symptoms.includes(symptomId));
    
    if (filter !== 'All') {
      result = result.filter(r => r.category === filter);
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
  }, [symptomId, filter, sort]);

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

  const filters = ['All', 'Natural', 'TCM', 'Conventional', 'Lifestyle'];

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
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    filter === f 
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
            description={`We couldn't find any ${filter} remedies for ${symptom.label}.`}
            ctaLabel="Clear Filters"
            ctaHref="#" // Use an inline handler instead, handled in onClick below, but the component expects href. We can modify or just reset state.
          />
        )}
        
        {!isLoading && filteredAndSortedRemedies.length === 0 && (
          <div className="text-center mt-[-20px]">
             <button onClick={() => setFilter('All')} className="text-forest font-medium hover:underline">
               Clear Filters
             </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
