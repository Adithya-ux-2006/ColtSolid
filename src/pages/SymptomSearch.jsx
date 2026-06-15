import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Frown, Loader2, Sparkles, X } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms';
import { SymptomChip, LoadingSkeleton, EmptyState } from '../components/ui';
import { useSearch } from '../hooks/useSearch';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { detectSymptomsFromText } from '../utils/aiSymptomSearch';

const SEARCH_NUDGE_DISMISSED_KEY = 'clotsolid_nudge_dismissed';
const AI_EXAMPLES = [
  'My throat hurts and I have a fever',
  'I feel stressed and cannot sleep',
  'I have nausea after eating',
];

export function SymptomSearch() {
  const { searchTerm, setSearchTerm, debouncedTerm } = useSearch('', 300);
  const [isSearching, setIsSearching] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiError, setAiError] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
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

  const handleAiSearch = async () => {
    const trimmedQuery = aiQuery.trim();
    if (!trimmedQuery) return;

    setAiError('');
    setIsAiSearching(true);

    try {
      const result = await detectSymptomsFromText(
        trimmedQuery,
        symptoms.map(({ id, label }) => ({ id, label }))
      );

      if (!result.detectedSymptoms?.length) {
        setAiError('We could not confidently match that description to symptoms in the catalog. Try adding clearer symptom words like headache, fever, nausea, or stress.');
        return;
      }

      const params = new URLSearchParams({
        source: 'ai',
        query: trimmedQuery,
        symptoms: result.detectedSymptoms.join(','),
      });

      navigate(`/results?${params.toString()}`);
    } catch (error) {
      setAiError(error.message || 'Unable to analyze your symptoms right now.');
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8">
      <div className="sticky top-0 md:top-16 z-30 bg-snow/80 backdrop-blur-md pt-6 pb-4 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-5">
            <h1 className="text-3xl font-extrabold text-ink">Find relief for your symptoms</h1>
            <p className="mt-2 text-base text-ink-muted">Choose a symptom below or type how you're feeling</p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-forest">
              <Sparkles className="h-4 w-4" />
              AI Symptom Search
            </div>
            <textarea
              value={aiQuery}
              onChange={(event) => setAiQuery(event.target.value)}
              placeholder="Describe how you feel..."
              className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {AI_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setAiQuery(example)}
                  className="rounded-full bg-snow px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-sage/20 hover:text-forest"
                >
                  {example}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAiSearch}
              disabled={isAiSearching || !aiQuery.trim() || isCatalogLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isAiSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isAiSearching ? 'Analyzing symptoms...' : 'Analyze Symptoms'}
            </button>
            {aiError ? (
              <div className="mt-3 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber-dark">
                {aiError}
              </div>
            ) : null}
          </div>

          <div onKeyDown={handleKeyDown} className="mt-4">
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
                  ✨ Personalize your results - Sign up free to match remedies to your allergy profile.
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filteredSymptoms.map(symptom => (
              <SymptomChip 
                key={symptom.id} 
                symptom={symptom} 
                isSelected={false}
                onClick={() => handleSelect(symptom.id)}
                className="min-h-[88px] w-full justify-center rounded-2xl px-4 py-4 text-base font-semibold"
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
