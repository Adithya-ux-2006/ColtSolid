import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Frown, X } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms';
import { SymptomChip, LoadingSkeleton, EmptyState } from '../components/ui';
import { useSearch } from '../hooks/useSearch';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';

const SEARCH_NUDGE_DISMISSED_KEY = 'clotsolid_nudge_dismissed';

export function SymptomSearch() {
  const { searchTerm, setSearchTerm, debouncedTerm } = useSearch('', 300);
  const [isSearching, setIsSearching] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const symptoms = useCatalogStore((state) => state.symptoms);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const filteredSymptoms = symptoms.filter(s => 
    s.label.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  useEffect(() => {
    setIsBannerDismissed(window.localStorage.getItem(SEARCH_NUDGE_DISMISSED_KEY) === 'true');
  }, []);

  useEffect(() => {
    if (searchTerm !== debouncedTerm) {
      setIsSearching(true);
    } else {
      const timer = setTimeout(() => setIsSearching(false), 600); // Fake delay for UX
      return () => clearTimeout(timer);
    }
  }, [searchTerm, debouncedTerm]);

  const handleSelect = (symptomId) => {
    navigate(`/results?symptom=${symptomId}`);
  };

  const dismissBanner = () => {
    window.localStorage.setItem(SEARCH_NUDGE_DISMISSED_KEY, 'true');
    setIsBannerDismissed(true);
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
          {!isAuthenticated && !isBannerDismissed ? (
            <div className="mt-4 rounded-xl bg-sage/20 px-4 py-3 text-sm text-forest">
              <div className="flex items-start justify-between gap-3">
                <p className="leading-relaxed">
                  ✨ Get personalized results - Sign up free to match remedies to your symptoms and allergies.
                </p>
                <button type="button" onClick={dismissBanner} className="text-forest/70 transition-colors hover:text-forest">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link to="/register" className="rounded-full bg-forest px-3 py-1.5 font-semibold text-white">Sign Up</Link>
                <Link to="/login" className="rounded-full border border-forest px-3 py-1.5 font-semibold text-forest">Log In</Link>
              </div>
            </div>
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

    </PageWrapper>
  );
}
