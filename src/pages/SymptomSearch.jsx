import { useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Bot } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms/SearchBar';
import { LoadingSkeleton } from '../components/ui';
import { useSearch } from '../hooks/useSearch';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { trackSearchEvent } from '../utils/analytics';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { getRankedRemediesForSymptoms, isEmergencyQuery } from '../utils/symptomSearch';
import { resolveQuery } from '../utils/symptomEngine';
import { EMERGENCY_MESSAGE, EMERGENCY_ACTION } from '../constants/emergency';

const SYMPTOM_CARDS = [
  { label: 'Headache', emoji: '🤕' },
  { label: 'Blocked Nose', emoji: '🫁' },
  { label: 'Back Pain', emoji: '💪' },
  { label: 'Anxiety', emoji: '🧘' },
  { label: 'Stress', emoji: '😤' },
  { label: 'Fatigue', emoji: '🔋' },
];

function openAiAssistant() {
  window.dispatchEvent(new CustomEvent('cs-open-ai-chat'));
}

export function SymptomSearch() {
  const { searchTerm, setSearchTerm, debouncedTerm } = useSearch('', 300);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const symptomRemedies = useCatalogStore((state) => state.symptomRemedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies);
  const userConditions = useAuthStore((state) => state.user?.common_conditions);

  const guestAllergies = useMemo(() => (!isAuthenticated ? getGuestAllergies() : []), [isAuthenticated]);
  const guestConditions = useMemo(() => (!isAuthenticated ? getGuestConditions() : []), [isAuthenticated]);
  const activeAllergies = isAuthenticated ? userKnownAllergies : guestAllergies;
  const activeConditions = isAuthenticated ? userConditions : guestConditions;

  const isSearching = searchTerm !== debouncedTerm;
  const trimmedQuery = debouncedTerm.trim();

  const symptomResolution = useMemo(
    () => (trimmedQuery.length >= 2 ? resolveQuery(trimmedQuery, symptoms) : { symptomIds: [], confidence: 0, matchInfo: null }),
    [symptoms, trimmedQuery]
  );

  const matchedSymptomIds = symptomResolution.symptomIds;

  const safeFilter = useMemo(
    () => (remedy) => isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions }),
    [activeAllergies, activeConditions]
  );

  const symptomRankedResults = useMemo(() => {
    if (matchedSymptomIds.length === 0) return [];
    const result = getRankedRemediesForSymptoms(matchedSymptomIds, symptomRemedies, remedies);
    const combined = [...(result.primary || []), ...(result.related || [])];
    return combined.filter(safeFilter);
  }, [matchedSymptomIds, remedies, safeFilter, symptomRemedies]);

  const textFallbackResults = useMemo(() => {
    if (symptomRankedResults.length > 0) return [];
    if (isEmergencyQuery(trimmedQuery)) return [];
    return [];
  }, [symptomRankedResults.length, trimmedQuery]);

  const dropdownResults = symptomRankedResults.length > 0 ? symptomRankedResults : textFallbackResults;
  const shouldShowDropdown = trimmedQuery.length >= 2;

  const goToResults = () => {
    const query = searchTerm.trim();
    if (!query) return;
    trackSearchEvent({ source: 'text', queryText: query }).catch(() => {});
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const handleCardClick = (label) => {
    trackSearchEvent({ source: 'symptom_card', queryText: label }).catch(() => {});
    navigate(`/results?q=${encodeURIComponent(label)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToResults();
    }
  };

  function evidenceDots(score) {
    if (!score) return null;
    const filled = Math.round(score / 3.4);
    return (
      <span className="ml-1.5 text-[10px] tracking-wider text-ink-subtle">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={i < filled ? 'text-primary' : 'text-ink/10'}>
            ●
          </span>
        ))}
      </span>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
        <h1 className="text-display font-bold text-ink mb-2">
          Feel Better,
          <br />
          Naturally.
        </h1>
        <p className="text-lg text-ink-muted mb-10 leading-relaxed">
          Evidence-backed remedies for common symptoms.{' '}
          <span className="text-primary font-medium">No sign-up needed.</span>
        </p>

        <div onKeyDown={handleKeyDown} className="relative mb-12">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={() => goToResults()}
            placeholder="Search backache, period cramps, sore throat..."
          />

          {shouldShowDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-xl"
            >
              <button
                type="button"
                onClick={goToResults}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-ink transition-colors hover:bg-surface/50"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Search className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate font-semibold">{searchTerm}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" />
              </button>

              <div className="border-t border-ink/5 px-4 py-3">
                {isSearching || isCatalogLoading ? (
                  <div className="space-y-2">
                    <LoadingSkeleton count={3} className="h-8" />
                  </div>
                ) : dropdownResults.length > 0 ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                      Recommended remedies
                    </p>
                    <div className="space-y-1">
                      {dropdownResults.slice(0, 5).map((remedy) => (
                        <Link
                          key={remedy.id}
                          to={`/remedy/${remedy.id}`}
                          className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface/50"
                        >
                          <span className="w-6 h-6 rounded-lg bg-surface text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                            {remedy.name.charAt(0)}
                          </span>
                          <span className="truncate">{remedy.name}</span>
                          {evidenceDots(remedy._evidenceScore)}
                        </Link>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={goToResults}
                      className="mt-3 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      See all {dropdownResults.length} results &rarr;
                    </button>
                  </>
                ) : isEmergencyQuery(trimmedQuery) ? (
                  <div className="py-3 text-sm">
                    <p className="font-semibold text-red-600">{EMERGENCY_MESSAGE}</p>
                    <p className="text-red-500 mt-1">{EMERGENCY_ACTION}</p>
                  </div>
                ) : symptomResolution.matchInfo ? (
                  <div className="py-3 text-sm text-ink-muted">
                    <p className="font-semibold text-ink">We couldn't match remedies to your symptom.</p>
                    <p className="mt-1">Try the AI assistant for personalised advice.</p>
                    <button
                      type="button"
                      onClick={openAiAssistant}
                      className="mt-2 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Try our AI Assistant <Bot className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-3 text-sm text-ink-muted">
                    <p className="font-semibold text-ink">No remedies found for this symptom.</p>
                    <button
                      type="button"
                      onClick={openAiAssistant}
                      className="mt-2 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Try our AI Assistant for personalised advice <Bot className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-ink-muted mb-4">Popular symptoms</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOM_CARDS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleCardClick(item.label)}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all text-center"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/5">
          <p className="text-xs text-ink-subtle text-center leading-relaxed">
            Always research-backed. Always free.
            <br />
            Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
