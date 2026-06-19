import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState, SafetyNotice, DoctorGuidance } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { searchRemedies, getClosestSymptomCategory } from '../hooks/useSearch';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { matchQueryToSymptoms, getRankedRemediesForSymptoms } from '../utils/symptomSearch';
import { trackSearchEvent } from '../utils/analytics';

const EMPTY_ARRAY = [];

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const symptomParam = queryParams.get('symptom');
  const queryParam = queryParams.get('q') || '';

  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies ?? EMPTY_ARRAY);
  const userConditions = useAuthStore((state) => state.user?.common_conditions);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const guestAllergies = useMemo(() => (!isAuthenticated ? getGuestAllergies() : EMPTY_ARRAY), [isAuthenticated]);
  const guestConditions = useMemo(() => (!isAuthenticated ? getGuestConditions() : EMPTY_ARRAY), [isAuthenticated]);
  const activeAllergies = isAuthenticated ? userKnownAllergies : guestAllergies;
  const activeConditions = isAuthenticated ? userConditions : guestConditions;

  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const symptomRemedies = useCatalogStore((state) => state.symptomRemedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);

  const [fallbackMatch, setFallbackMatch] = useState({ query: '', category: null });

  const isFreeTextSearch = Boolean(queryParam.trim());
  const matchedSymptomIds = useMemo(
    () => (isFreeTextSearch ? matchQueryToSymptoms(queryParam, symptoms) : []),
    [isFreeTextSearch, queryParam, symptoms]
  );

  const selectedSymptomIds = useMemo(() => {
    if (symptomParam) return [symptomParam];
    if (matchedSymptomIds.length > 0) return matchedSymptomIds;
    if (fallbackMatch.category && fallbackMatch.category !== 'none') return [fallbackMatch.category];
    return [];
  }, [fallbackMatch.category, matchedSymptomIds, symptomParam]);

  const symptom = symptoms.find(s => s.id === symptomParam);

  useEffect(() => {
    if (!isFreeTextSearch || isCatalogLoading || matchedSymptomIds.length > 0 || searchRemedies(queryParam, remedies).length > 0) return;

    let isCurrent = true;
    getClosestSymptomCategory(queryParam)
      .then((category) => { if (isCurrent) setFallbackMatch({ query: queryParam, category }); })
      .catch(() => { if (isCurrent) setFallbackMatch({ query: queryParam, category: 'none' }); });

    return () => { isCurrent = false; };
  }, [isCatalogLoading, isFreeTextSearch, matchedSymptomIds, queryParam, remedies]);

  useEffect(() => {
    if (isFreeTextSearch && queryParam) {
      trackSearchEvent({
        source: symptomParam ? 'symptom_page' : 'text_direct',
        queryText: queryParam,
        symptomIds: symptomParam ? [symptomParam] : [],
      }).catch(() => {});
    } else if (symptomParam) {
      trackSearchEvent({
        source: 'symptom_page',
        symptomIds: [symptomParam],
      }).catch(() => {});
    }
  }, [isFreeTextSearch, queryParam, symptomParam]);

  const safeFilter = useMemo(
    () => (remedy) => isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions }),
    [activeAllergies, activeConditions]
  );

  const rankedRemedies = useMemo(() => {
    if (selectedSymptomIds.length > 0) {
      return getRankedRemediesForSymptoms(selectedSymptomIds, symptomRemedies, remedies).filter(safeFilter);
    }
    if (isFreeTextSearch) {
      return searchRemedies(queryParam, remedies).filter(safeFilter);
    }
    return [];
  }, [selectedSymptomIds, symptomRemedies, remedies, safeFilter, isFreeTextSearch, queryParam]);

  const featuredRemedy = rankedRemedies.length > 0 ? rankedRemedies[0] : null;
  const otherRemedies = rankedRemedies.length > 1 ? rankedRemedies.slice(1) : [];

  const researchSources = useMemo(() => {
    if (!featuredRemedy) return [];
    return featuredRemedy.researchPapers || featuredRemedy.researchLinks || [];
  }, [featuredRemedy]);

  const safetyWarnings = useMemo(() => {
    if (!featuredRemedy) return null;
    const warnings = [];
    if (featuredRemedy.warnings) warnings.push(featuredRemedy.warnings);
    if (!isRemedySafeForUser(featuredRemedy, { allergies: activeAllergies, conditions: activeConditions })) {
      warnings.push('This remedy may not be suitable based on your health profile.');
    }
    return warnings.length > 0 ? warnings.join(' ') : null;
  }, [featuredRemedy, activeAllergies, activeConditions]);

  const headerTitle = symptom?.label || queryParam || 'Results';

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-cream pb-16">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={4} />
        </div>
      </PageWrapper>
    );
  }

  if (!isFreeTextSearch && !symptom && hasLoaded) {
    return (
      <PageWrapper className="min-h-screen bg-cream pt-16 px-6">
        <EmptyState
          title="Symptom not found"
          description="Please select a valid symptom from the search page."
          ctaLabel="Go to Search"
          ctaHref="/search"
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-16">
      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>
      </div>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-display font-bold text-ink mb-2">
          {headerTitle}
        </h1>
        <p className="text-ink-muted">
          {rankedRemedies.length > 0
            ? `${rankedRemedies.length} evidence-backed ${rankedRemedies.length === 1 ? 'remedy' : 'remedies'}`
            : 'Searching for remedies...'}
        </p>
      </div>

      {rankedRemedies.length === 0 && !isCatalogLoading ? (
        <div className="max-w-2xl mx-auto px-6">
          <EmptyState
            title="No remedies found"
            description={`We couldn't find evidence-backed remedies for "${queryParam}". Try a different search term.`}
            ctaLabel="Search Again"
            ctaHref="/search"
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-10 px-6">
          {featuredRemedy && (
            <section>
              <h2 className="section-heading">Featured Remedy</h2>
              <RemedyCard remedy={featuredRemedy} featured />
              {safetyWarnings && (
                <div className="mt-4">
                  <SafetyNotice message={safetyWarnings} />
                </div>
              )}
            </section>
          )}

          {otherRemedies.length > 0 && (
            <section>
              <h2 className="section-heading">Other Remedies</h2>
              <div className="space-y-4">
                {otherRemedies.map((remedy) => (
                  <RemedyCard key={remedy.id} remedy={remedy} />
                ))}
              </div>
            </section>
          )}

          {researchSources.length > 0 && (
            <section>
              <h2 className="section-heading">Research Sources</h2>
              <div className="space-y-3">
                {researchSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-teal uppercase tracking-wider mb-0.5">
                        {source.journal || source.label || 'Research'}
                      </p>
                      <p className="text-sm text-ink truncate">
                        {source.keyFinding || source.label}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-ink-muted shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section>
            <DoctorGuidance />
          </section>
        </div>
      )}
    </PageWrapper>
  );
}
