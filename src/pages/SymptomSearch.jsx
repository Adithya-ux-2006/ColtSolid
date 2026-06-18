import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Frown, Search, X } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms';
import { SymptomChip, LoadingSkeleton } from '../components/ui';
import { searchRemedies, useSearch } from '../hooks/useSearch';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { trackSearchEvent } from '../utils/analytics';
import { getGuestAllergies, remedyMatchesAllergies } from '../utils/guestProfile';

const SEARCH_NUDGE_DISMISSED_KEY = 'clotsolid_nudge_dismissed';
const QUICK_SYMPTOMS = ['headache', 'cold', 'anxiety', 'insomnia', 'nausea', 'stress'];

function openAiAssistant() {
  window.dispatchEvent(new CustomEvent('cs-open-ai-chat'));
}

export function SymptomSearch() {
  const { searchTerm, setSearchTerm, debouncedTerm } = useSearch('', 300);
  const [isBannerDismissed, setIsBannerDismissed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(SEARCH_NUDGE_DISMISSED_KEY) === 'true'
  );
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies ?? []);
  const navigate = useNavigate();
  const isSearching = searchTerm !== debouncedTerm;
  const trimmedQuery = debouncedTerm.trim();
  const guestAllergies = useMemo(() => (!isAuthenticated ? getGuestAllergies() : []), [isAuthenticated]);
  const activeAllergies = isAuthenticated ? userKnownAllergies : guestAllergies;

  const quickSymptoms = useMemo(
    () => QUICK_SYMPTOMS.map((id) => symptoms.find((symptom) => symptom.id === id)).filter(Boolean),
    [symptoms]
  );
  const localResults = useMemo(
    () => searchRemedies(trimmedQuery, remedies).filter((remedy) => !remedyMatchesAllergies(remedy, activeAllergies)),
    [activeAllergies, remedies, trimmedQuery]
  );
  const shouldShowDropdown = searchTerm.trim().length >= 2;

  const handleSelect = (symptomId) => {
    trackSearchEvent({ source: 'chip', symptomIds: [symptomId] }).catch(() => {});
    navigate(`/results?symptom=${symptomId}`);
  };

  const goToResults = () => {
    const query = searchTerm.trim();
    if (!query) return;

    trackSearchEvent({ source: 'text', queryText: query }).catch(() => {});
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const dismissBanner = () => {
    window.localStorage.setItem(SEARCH_NUDGE_DISMISSED_KEY, 'true');
    setIsBannerDismissed(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      goToResults();
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8">
      <div className="sticky top-0 md:top-16 z-30 bg-snow/80 backdrop-blur-md pt-6 pb-4 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-5">
            <h1 className="text-3xl font-extrabold text-ink">Find relief for any symptom</h1>
            <p className="mt-2 text-base text-ink-muted">Type what you feel. Common symptoms below are quick picks only.</p>
          </div>

          <div onKeyDown={handleKeyDown} className="relative">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search backache, period cramps, sore throat..."
            />

            {shouldShowDropdown ? (
              <div className="absolute left-0 right-0 top-full z-40 mt-3 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
                <button
                  type="button"
                  onClick={goToResults}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-ink transition-colors hover:bg-snow"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Search className="h-4 w-4 shrink-0 text-forest" />
                    <span className="truncate font-semibold">{searchTerm}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" />
                </button>

                <div className="border-t border-gray-100 px-4 py-3">
                  {isSearching || isCatalogLoading ? (
                    <div className="space-y-2">
                      <LoadingSkeleton count={3} className="h-8" />
                    </div>
                  ) : localResults.length > 0 ? (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Remedies found</p>
                      <div className="mt-2 space-y-1">
                        {localResults.slice(0, 4).map((remedy) => (
                          <Link
                            key={remedy.id}
                            to={`/remedy/${remedy.id}`}
                            className="block rounded-2xl px-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sage/10"
                          >
                            <span className="mr-2">{remedy.category === 'TCM' ? '☯️' : remedy.category === 'Lifestyle' ? '💪' : '🌿'}</span>
                            {remedy.name}
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={goToResults}
                        className="mt-3 text-sm font-semibold text-forest hover:underline"
                      >
                        See all {localResults.length} results →
                      </button>
                    </>
                  ) : (
                    <div className="py-2 text-sm text-ink-muted">
                      <p className="font-semibold text-ink">No exact matches found</p>
                      <button
                        type="button"
                        onClick={openAiAssistant}
                        className="mt-2 inline-flex items-center gap-2 font-semibold text-forest hover:underline"
                      >
                        Try our AI Assistant for personalised advice <Bot className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {!isAuthenticated && !isBannerDismissed ? (
            <div className="mt-4 rounded-xl bg-sage/20 px-4 py-3 text-sm text-forest">
              <div className="flex items-start justify-between gap-3">
                <p className="leading-relaxed">Personalize your results - Sign up free to match remedies to your allergy profile.</p>
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
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-ink-muted">Common symptoms</h2>

        {isCatalogLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton count={6} className="h-20" />
          </div>
        ) : quickSymptoms.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {quickSymptoms.map((symptom) => (
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
          <div className="rounded-3xl bg-white p-6 text-center text-ink-muted shadow-card">
            <Frown className="mx-auto h-8 w-8" />
            <p className="mt-3 font-semibold">Common symptoms are unavailable right now.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
