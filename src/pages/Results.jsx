import { useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState, DoctorGuidance } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { getRankedRemediesForSymptoms, isEmergencyQuery } from '../utils/symptomSearch';
import { resolveQuery } from '../utils/symptomEngine';
import { EMERGENCY_MESSAGE, EMERGENCY_ACTION } from '../constants/emergency';
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

  const isFreeTextSearch = Boolean(queryParam.trim());

  const symptomResolution = useMemo(
    () => (isFreeTextSearch ? resolveQuery(queryParam, symptoms) : {
      symptomIds: symptomParam ? [symptomParam] : [],
      allSymptomIds: symptomParam ? [symptomParam] : [],
      confidence: 100,
      allMatches: [],
      primarySymptom: symptomParam ? symptoms.find(s => s.id === symptomParam) || null : null,
    }),
    [isFreeTextSearch, queryParam, symptoms, symptomParam]
  );

  const matchedSymptom = symptomResolution.primarySymptom;
  const queryConfidence = symptomResolution.confidence;
  const isLowConfidence = isFreeTextSearch && queryConfidence < 50 && symptomResolution.symptomIds.length > 0;

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

  const safeFilter = useCallback(
    (remedy) => isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions }),
    [activeAllergies, activeConditions]
  );

  const searchResult = useMemo(() => {
    const ids = symptomResolution.symptomIds;
    if (ids.length === 0) return { primary: [], related: [], grouped: null };

    const result = getRankedRemediesForSymptoms(ids, symptomRemedies, remedies, {
      symptoms,
      allergies: activeAllergies,
      conditions: activeConditions,
    });

    return result;
  }, [symptomResolution.symptomIds, symptomRemedies, remedies, symptoms, activeAllergies, activeConditions]);

  const grouped = searchResult.grouped;

  const hasResults = (grouped?.bestMatch != null) || (grouped?.bestMatches?.length > 0)
    || (grouped?.additionalOptions?.length > 0) || (grouped?.supportive?.length > 0);

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-bg pb-16">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={4} />
        </div>
      </PageWrapper>
    );
  }

  if (!isFreeTextSearch && !matchedSymptom && hasLoaded) {
    return (
      <PageWrapper className="min-h-screen bg-bg pt-16 px-6">
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
    <PageWrapper className="min-h-screen bg-bg pb-24 md:pb-16">
      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-display font-bold text-ink">
              Showing remedies for: {matchedSymptom?.label || queryParam}
            </h1>
          </div>
        </div>
      </div>

      {isLowConfidence && (
        <div className="max-w-2xl mx-auto px-6 mb-6">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Low confidence match</p>
              <p>Your search didn't strongly match a known symptom. Results may be less specific. Try using a more precise term.</p>
            </div>
          </div>
        </div>
      )}

      {isEmergencyQuery(queryParam) ? (
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">{EMERGENCY_MESSAGE}</h2>
            <p className="text-red-600 font-medium mb-4">{EMERGENCY_ACTION}</p>
            <p className="text-red-500 text-sm">curA does not provide self-treatment guidance for potentially serious symptoms.</p>
          </div>
        </div>
      ) : !hasResults && !isCatalogLoading ? (
        <div className="max-w-2xl mx-auto px-6">
          <EmptyState
            title="No remedies found"
            description={symptomResolution.symptomIds.length > 0
              ? `No evidence-backed remedies were found for "${matchedSymptom?.label || queryParam}". Try a different search term.`
              : `We couldn't confidently identify a matching symptom for "${queryParam}". Try a different search term.`}
            ctaLabel="Search Again"
            ctaHref="/search"
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8 px-6">

          {grouped?.bestMatch && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted mb-3">Best Match</h2>
              <div className="bg-white rounded-2xl shadow-soft p-5">
                <RemedyCard remedy={grouped.bestMatch} variant="carousel" isSafe={safeFilter(grouped.bestMatch)} />
              </div>
            </section>
          )}

          {grouped?.bestMatches?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted mb-3">Best Matches</h2>
              <p className="text-xs text-ink-muted mb-4">
                Top remedies that directly address your symptoms.
              </p>
              <div className="space-y-3">
                {grouped.bestMatches.map((remedy) => (
                  <div key={remedy.id} className="bg-white rounded-2xl shadow-soft p-4">
                    <RemedyCard remedy={remedy} variant="carousel" isSafe={safeFilter(remedy)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {grouped?.additionalOptions?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted mb-3">Additional Options</h2>
              <p className="text-xs text-ink-muted mb-4">
                Remedies that help manage associated symptoms.
              </p>
              <div className="space-y-3">
                {grouped.additionalOptions.map((remedy) => (
                  <div key={remedy.id} className="bg-white rounded-2xl shadow-soft p-4">
                    <RemedyCard remedy={remedy} variant="carousel" isSafe={safeFilter(remedy)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {grouped?.supportive?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted mb-3">Supportive Remedies</h2>
              <p className="text-xs text-ink-muted mb-4">
                General wellness remedies that provide supportive care.
              </p>
              <div className="space-y-3">
                {grouped.supportive.map((remedy) => (
                  <div key={remedy.id} className="bg-white rounded-2xl shadow-soft p-4">
                    <RemedyCard remedy={remedy} variant="carousel" isSafe={safeFilter(remedy)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isAuthenticated && hasResults && (
            <section className="rounded-3xl bg-gradient-card p-6 shadow-card border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-lg font-semibold text-ink">Finding what you need?</p>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Sign up free to save remedies, track appointments, and get a personalized dashboard built around your symptoms.
              </p>
              <div className="space-y-2">
                <Link
                  to="/register"
                  className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-glow hover:bg-primary-dark transition-colors"
                >
                  Sign Up Free &mdash; Always Free
                </Link>
                <Link
                  to="/login"
                  className="block w-full text-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Log In
                </Link>
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
