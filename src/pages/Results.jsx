import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Heart, ChevronDown } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCarousel } from '../components/ui/RemedyCarousel';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { GuidancePanel } from '../components/ui/GuidancePanel';
import { FeaturedRemedyCard } from '../components/ui/FeaturedRemedyCard';
import { WhyRecommended } from '../components/ui/WhyRecommended';
import { AltRemedyRow } from '../components/ui/AltRemedyRow';
import { LifestyleTips } from '../components/ui/LifestyleTips';
import { MedicalGuidancePanel } from '../components/ui/MedicalGuidancePanel';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { useGuestProfileStore } from '../store/guestProfileStore';
import { isRemedySafeForUser } from '../utils/guestProfile';
import { getRankedRemediesForSymptoms, isEmergencyQuery } from '../utils/symptomSearch';
import { resolveQuery } from '../utils/symptomEngine';
import { getSymptomGraphEntry } from '../data/symptomGraph';
import { fetchGeminiInterpretation } from '../utils/geminiInterpreter';
import { EMERGENCY_MESSAGE, EMERGENCY_ACTION } from '../constants/emergency';
import { trackSearchEvent } from '../utils/analytics';

const EMPTY_ARRAY = [];

const INTENT_LABELS = {
  relief: 'Looking for Relief',
  cause: 'Understanding Causes',
  information: 'Seeking Information',
  prevention: 'Prevention',
};

function IntentBadge({ intent }) {
  const label = INTENT_LABELS[intent];
  if (!label) return null;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-mint text-primary">
      {label}
    </span>
  );
}

function MonitorBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
      <AlertTriangle className="w-3 h-3" />
      Monitor Closely
    </span>
  );
}

function LowConfidenceWarning() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800">
        <p className="font-semibold mb-1">Low confidence match</p>
        <p>Your search didn't strongly match a known symptom. Results may be less specific. Try using a more precise term.</p>
      </div>
    </div>
  );
}

function EmergencyBanner() {
  return (
    <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-6">
      <h2 className="text-xl font-bold text-red-700 mb-2">{EMERGENCY_MESSAGE}</h2>
      <p className="text-red-600 font-medium mb-4">{EMERGENCY_ACTION}</p>
      <p className="text-red-500 text-sm">curA does not provide self-treatment guidance for potentially serious symptoms.</p>
    </div>
  );
}

function MedicalDisclaimer() {
  return (
    <p className="text-xs text-ink-muted leading-relaxed text-center">
      curA provides evidence-backed information for educational purposes only.
      It is not a substitute for professional medical advice, diagnosis, or treatment.
      Always consult a qualified healthcare provider for any medical concerns.
    </p>
  );
}

export function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const symptomParam = searchParams.get('symptom');
  const queryParam = searchParams.get('q') || '';

  const [showAllAlternatives, setShowAllAlternatives] = useState(false);
  const [geminiInterpretation, setGeminiInterpretation] = useState(
    location.state?.geminiInterpretation || null
  );

  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies ?? EMPTY_ARRAY);
  const userConditions = useAuthStore((state) => state.user?.common_conditions);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const guestAllergies = useGuestProfileStore((state) => state.known_allergies);
  const guestConditions = useGuestProfileStore((state) => state.common_conditions);
  const activeAllergies = isAuthenticated ? userKnownAllergies : guestAllergies;
  const activeConditions = isAuthenticated ? userConditions : guestConditions;

  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const symptomRemedies = useCatalogStore((state) => state.symptomRemedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);

  const isFreeTextSearch = Boolean(queryParam.trim());

  useEffect(() => {
    if (!isFreeTextSearch || !queryParam || geminiInterpretation) return;

    let cancelled = false;

    fetchGeminiInterpretation(queryParam, symptoms)
      .then((interp) => {
        if (!cancelled && interp) {
          setGeminiInterpretation(interp);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [isFreeTextSearch, queryParam, symptoms, geminiInterpretation]);

  const symptomResolution = useMemo(
    () => (isFreeTextSearch ? resolveQuery(queryParam, symptoms, geminiInterpretation) : {
      symptomIds: symptomParam ? [symptomParam] : [],
      allSymptomIds: symptomParam ? [symptomParam] : [],
      confidence: 100,
      allMatches: [],
      primarySymptom: symptomParam ? symptoms.find(s => s.id === symptomParam) || null : null,
    }),
    [isFreeTextSearch, queryParam, symptoms, symptomParam, geminiInterpretation]
  );

  const matchedSymptom = symptomResolution.primarySymptom;
  const queryConfidence = symptomResolution.confidence;
  const isLowConfidence = isFreeTextSearch && queryConfidence < 50 && symptomResolution.symptomIds.length > 0;
  const primarySymptomId = symptomResolution.symptomIds[0];
  const symptomGraph = primarySymptomId ? getSymptomGraphEntry(primarySymptomId) : null;

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

  const searchResult = useMemo(() => {
    const ids = symptomResolution.symptomIds;
    if (ids.length === 0) return { primary: [], related: [], grouped: null };

    return getRankedRemediesForSymptoms(ids, symptomRemedies, remedies, {
      symptoms,
      allergies: activeAllergies,
      conditions: activeConditions,
      queryConfidence: symptomResolution.confidence,
    });
  }, [symptomResolution.symptomIds, symptomResolution.confidence, symptomRemedies, remedies, symptoms, activeAllergies, activeConditions]);

  const grouped = searchResult.grouped;

  const hasResults = (grouped?.bestMatch != null) || (grouped?.bestMatches?.length > 0)
    || (grouped?.additionalOptions?.length > 0) || (grouped?.supportive?.length > 0);

  const allAlternatives = useMemo(() => {
    if (!grouped) return [];
    return [
      ...(grouped.bestMatches || []),
      ...(grouped.additionalOptions || []),
      ...(grouped.supportive || []),
    ];
  }, [grouped]);

  const visibleAlternatives = showAllAlternatives ? allAlternatives : allAlternatives.slice(0, 3);

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
      {/* Header Section */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>

        <h1 className="text-display md:text-hero font-extrabold text-ink mt-6 mb-3">
          {matchedSymptom?.label || queryParam}
        </h1>

        {matchedSymptom && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SeverityBadge severity={symptomResolution.severity} />
            <IntentBadge intent={symptomResolution.userIntent} />
            {symptomResolution.emergencyIndicators?.length > 0 && <MonitorBadge />}
          </div>
        )}

        {matchedSymptom && (
          <p className="text-ink-muted text-sm mb-2">
            Based on your symptoms, here&apos;s the best next step.
          </p>
        )}

        {matchedSymptom && (
          <GuidancePanel
            severity={symptomResolution.severity}
            symptom={matchedSymptom}
            emergencyFlags={symptomGraph?.emergencyFlags}
          />
        )}
      </div>

      {/* Low Confidence Warning */}
      {isLowConfidence && (
        <div className="max-w-2xl mx-auto px-6 mt-4">
          <LowConfidenceWarning />
        </div>
      )}

      {/* Emergency Banner */}
      {isEmergencyQuery(queryParam) ? (
        <div className="max-w-2xl mx-auto px-6 mt-6">
          <EmergencyBanner />
        </div>
      ) : !hasResults && !isCatalogLoading ? (
        <div className="max-w-2xl mx-auto px-6 mt-6">
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
        <>
          {/* Featured Remedy + Why Recommended */}
          {grouped?.bestMatch && (
            <div className="max-w-4xl mx-auto px-6 mt-8">
              <h2 className="text-section-heading font-bold text-ink mb-4">Recommended for You</h2>
              <div className="md:flex md:gap-6 md:items-start">
                <div className="md:flex-1">
                  <FeaturedRemedyCard
                    remedy={grouped.bestMatch}
                    isSafe={safeFilter(grouped.bestMatch)}
                    evidenceScore={grouped.bestMatch._evidenceScore}
                    safetyScore={grouped.bestMatch._safetyScore}
                  />
                </div>
                <div className="md:w-72 mt-6 md:mt-0 shrink-0">
                  <WhyRecommended
                    remedy={grouped.bestMatch}
                    evidenceScore={grouped.bestMatch._evidenceScore}
                    safetyScore={grouped.bestMatch._safetyScore}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alternative Remedies */}
          {allAlternatives.length > 0 && (
            <div className="max-w-2xl mx-auto px-6 mt-10">
              <h2 className="text-section-heading font-bold text-ink mb-1">Other Remedies</h2>
              <p className="text-sm text-ink-muted mb-5">Excellent alternatives if you need another option.</p>

              {/* Desktop: stacked rows */}
              <div className="hidden md:block space-y-3">
                {visibleAlternatives.map((remedy) => (
                  <AltRemedyRow
                    key={remedy.id}
                    remedy={remedy}
                    isSafe={safeFilter(remedy)}
                    evidenceScore={remedy._evidenceScore}
                    safetyScore={remedy._safetyScore}
                  />
                ))}
              </div>

              {/* Mobile: carousel */}
              <div className="md:hidden">
                <RemedyCarousel>
                  {allAlternatives.map((remedy) => (
                    <div key={remedy.id} className="w-72 shrink-0 snap-start">
                      <AltRemedyRow
                        remedy={remedy}
                        isSafe={safeFilter(remedy)}
                        evidenceScore={remedy._evidenceScore}
                        safetyScore={remedy._safetyScore}
                      />
                    </div>
                  ))}
                </RemedyCarousel>
              </div>

              {/* Show all button */}
              {!showAllAlternatives && allAlternatives.length > 3 && (
                <button
                  onClick={() => setShowAllAlternatives(true)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors mx-auto"
                >
                  Show all {allAlternatives.length} alternatives
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Lifestyle Tips */}
          {primarySymptomId && (
            <div className="max-w-2xl mx-auto px-6 mt-10">
              <LifestyleTips symptomId={primarySymptomId} />
            </div>
          )}

          {/* Medical Guidance */}
          {primarySymptomId && (
            <div className="max-w-2xl mx-auto px-6 mt-10">
              <MedicalGuidancePanel
                symptomId={primarySymptomId}
                severity={symptomResolution.severity}
              />
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="max-w-2xl mx-auto px-6 mt-10">
            <MedicalDisclaimer />
          </div>

          {/* Sign-Up CTA (after all guidance) */}
          {!isAuthenticated && hasResults && (
            <div className="max-w-2xl mx-auto px-6 mt-10">
              <section className="rounded-3xl bg-gradient-card p-6 shadow-card border border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <p className="text-lg font-semibold text-ink">Save this remedy</p>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">
                  Create a free account to track your recovery and build your personal remedy library.
                </p>
                <div className="space-y-2">
                  <Link
                    to="/register"
                    className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-glow hover:bg-primary-dark transition-colors"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full text-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
