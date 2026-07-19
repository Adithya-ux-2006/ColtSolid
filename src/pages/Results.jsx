import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Heart, ChevronDown, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCarousel } from '../components/ui/RemedyCarousel';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { GuidancePanel } from '../components/ui/GuidancePanel';
import { FeaturedRemedyCard } from '../components/ui/FeaturedRemedyCard';
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
    <div className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-4">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <div className="text-sm text-warning">
        <p className="font-semibold mb-1">Low confidence match</p>
        <p>Your search didn't strongly match a known symptom. Results may be less specific. Try using a more precise term.</p>
      </div>
    </div>
  );
}

function EmergencyBanner() {
  return (
    <div className="rounded-3xl border-2 border-danger/30 bg-danger/10 p-6">
      <h2 className="text-xl font-bold text-danger mb-2">{EMERGENCY_MESSAGE}</h2>
      <p className="text-danger font-medium mb-4">{EMERGENCY_ACTION}</p>
      <p className="text-danger/80 text-sm">curA does not provide self-treatment guidance for potentially serious symptoms.</p>
    </div>
  );
}

function EvidenceBanner() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <ShieldCheck className="w-4 h-4 text-success" />
      <p className="text-sm text-ink-muted">All remedies are evidence-backed and safety-checked</p>
    </div>
  );
}

function MedicalDisclaimer() {
  return (
    <p className="text-xs text-ink-muted leading-relaxed text-center">
      curA provides general information and is not a substitute for professional medical advice.
      Always consult a healthcare professional for personalised care.
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
  const incrementSearchCount = useAuthStore((state) => state.incrementSearchCount);
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
      .catch((err) => {
        console.error('[GEMINI-RESULTS] Fallback fetch failed:', err?.message || err);
      });

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

    if (isAuthenticated) {
      incrementSearchCount();
    }
  }, [isFreeTextSearch, queryParam, symptomParam, isAuthenticated, incrementSearchCount]);

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
      primarySymptomId: symptomResolution.primarySymptomId,
    });
  }, [symptomResolution.symptomIds, symptomResolution.confidence, symptomResolution.primarySymptomId, symptomRemedies, remedies, symptoms, activeAllergies, activeConditions]);

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

  const visibleAlternatives = showAllAlternatives ? allAlternatives : allAlternatives.slice(0, 5);

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-bg pb-16">
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={2} />
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
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </button>

        <h1 className="text-hero font-extrabold text-ink mt-8 mb-4">
          {matchedSymptom?.label || queryParam}
        </h1>

        {matchedSymptom && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <SeverityBadge severity={symptomResolution.severity} />
            <IntentBadge intent={symptomResolution.userIntent} />
            {symptomResolution.emergencyIndicators?.length > 0 && <MonitorBadge />}
          </div>
        )}

        {matchedSymptom && (
          <p className="text-ink-muted text-lg mb-8">
            Based on your input, here&apos;s the best next step.
          </p>
        )}
      </div>

      {isLowConfidence && (
        <div className="max-w-4xl mx-auto px-6 mb-4">
          <LowConfidenceWarning />
        </div>
      )}

      {isEmergencyQuery(queryParam) ? (
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <EmergencyBanner />
        </div>
      ) : !hasResults && !isCatalogLoading ? (
        <div className="max-w-4xl mx-auto px-6 mb-8">
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
          {grouped?.bestMatch && (
            <div className="max-w-4xl mx-auto px-6 mb-2">
              <FeaturedRemedyCard
                remedy={grouped.bestMatch}
                isSafe={safeFilter(grouped.bestMatch)}
                evidenceScore={grouped.bestMatch._evidenceScore}
                safetyScore={grouped.bestMatch._safetyScore}
              />
            </div>
          )}

          {grouped?.bestMatch && <EvidenceBanner />}

          {allAlternatives.length > 0 && (
            <div className="max-w-4xl mx-auto px-6 mt-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-section-heading font-bold text-ink mb-1">Other Remedies</h2>
                  <p className="text-sm text-ink-muted">Excellent alternatives if you need another option.</p>
                </div>
                {allAlternatives.length > 5 && !showAllAlternatives && (
                  <button
                    onClick={() => setShowAllAlternatives(true)}
                    className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
                  >
                    Show all
                  </button>
                )}
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="hidden md:block">
                  {visibleAlternatives.map((remedy, i) => (
                    <AltRemedyRow
                      key={remedy.id}
                      remedy={remedy}
                      isSafe={safeFilter(remedy)}
                      evidenceScore={remedy._evidenceScore}
                      safetyScore={remedy._safetyScore}
                      showDivider={i < visibleAlternatives.length - 1}
                    />
                  ))}
                </div>

                <div className="md:hidden">
                  <RemedyCarousel>
                    {allAlternatives.map((remedy) => (
                      <div key={remedy.id} className="w-72 shrink-0 snap-start">
                        <AltRemedyRow
                          remedy={remedy}
                          isSafe={safeFilter(remedy)}
                          evidenceScore={remedy._evidenceScore}
                          safetyScore={remedy._safetyScore}
                          showDivider={false}
                        />
                      </div>
                    ))}
                  </RemedyCarousel>
                </div>
              </div>

              {!showAllAlternatives && allAlternatives.length > 5 && (
                <button
                  onClick={() => setShowAllAlternatives(true)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors mx-auto md:hidden"
                >
                  Show all {allAlternatives.length} alternatives
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {primarySymptomId && (
            <div className="max-w-4xl mx-auto px-6 mt-16">
              <LifestyleTips symptomId={primarySymptomId} />
            </div>
          )}

          {primarySymptomId && (
            <div className="max-w-4xl mx-auto px-6 mt-16">
              <MedicalGuidancePanel
                symptomId={primarySymptomId}
                severity={symptomResolution.severity}
              />
            </div>
          )}

          <div className="max-w-4xl mx-auto px-6 mt-8">
            <MedicalDisclaimer />
          </div>

          {!isAuthenticated && hasResults && (
            <div className="max-w-4xl mx-auto px-6 mt-8">
              <section className="rounded-3xl bg-gradient-card p-6 shadow-soft border border-primary/10">
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
