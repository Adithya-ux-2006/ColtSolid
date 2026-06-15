import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms';
import { SymptomChip, LoadingSkeleton, EmptyState, TrialGateModal } from '../components/ui';
import { useSearch } from '../hooks/useSearch';
import { useTrialGate } from '../hooks/useTrialGate';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';

export function SymptomSearch() {
  const { searchTerm, setSearchTerm, debouncedTerm } = useSearch('', 300);
  const [isSearching, setIsSearching] = useState(false);
  const symptoms = useCatalogStore((state) => state.symptoms);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { searchCount, showGate, incrementSearch } = useTrialGate();
  const navigate = useNavigate();

  const remainingSearches = Math.max(3 - searchCount, 0);

  const filteredSymptoms = symptoms.filter(s => 
    s.label.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm !== debouncedTerm) {
      setIsSearching(true);
    } else {
      const timer = setTimeout(() => setIsSearching(false), 600); // Fake delay for UX
      return () => clearTimeout(timer);
    }
  }, [searchTerm, debouncedTerm]);

  const handleSelect = (symptomId) => {
    const result = incrementSearch();
    if (result.blocked) return;
    navigate(`/results?symptom=${symptomId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredSymptoms.length > 0) {
      handleSelect(filteredSymptoms[0].id);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8">
      <div className="sticky top-0 md:top-16 z-30 bg-snow/80 backdrop-blur-md pt-6 pb-4 px-6">
        <div className="max-w-2xl mx-auto">
          <div onKeyDown={handleKeyDown}>
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="What are you feeling today? (e.g. headache)" 
            />
          </div>
          {!isAuthenticated && (remainingSearches === 1 || remainingSearches === 2) ? (
            <p className="mt-3 text-sm text-ink-subtle">{remainingSearches} free searches remaining</p>
          ) : null}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-4">
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-6">
          {searchTerm ? 'Search Results' : 'Browse by Symptom'}
        </h2>

        {isSearching || isCatalogLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton count={4} className="h-20" />
          </div>
        ) : filteredSymptoms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filteredSymptoms.map(symptom => (
              <SymptomChip 
                key={symptom.id} 
                symptom={symptom} 
                isSelected={false}
                onClick={() => handleSelect(symptom.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Frown}
            title="No symptoms found"
            description="We don't have that symptom yet. Try: headache, cold, anxiety..."
          />
        )}
      </div>

      <TrialGateModal isOpen={showGate} />
    </PageWrapper>
  );
}
