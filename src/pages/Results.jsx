import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState, DoctorGuidance } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { getRankedRemediesForSymptoms, isEmergencyQuery } from '../utils/symptomSearch';
import { resolveQuery, getRelatedSymptoms } from '../utils/symptomEngine';
import { EMERGENCY_MESSAGE, EMERGENCY_ACTION } from '../constants/emergency';
import { trackSearchEvent } from '../utils/analytics';

const EMPTY_ARRAY = [];

function CategorySection({ title, icon, items, defaultOpen, isSafe }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  if (!items?.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/30 transition-colors"
      >
        <span className="text-base font-bold text-ink">
          {icon} {title} <span className="text-ink-muted font-medium">({items.length})</span>
        </span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-ink-muted" /> : <ChevronRight className="w-4 h-4 text-ink-muted" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 space-y-3">
          {items.map((remedy) => (
            <RemedyCard key={remedy.id} remedy={remedy} variant="carousel" isSafe={isSafe(remedy)} />
          ))}
        </div>
      )}
    </div>
  );
}

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
      confidence: 0,
      allMatches: [],
      primarySymptom: symptomParam ? symptoms.find(s => s.id === symptomParam) || null : null,
    }),
    [isFreeTextSearch, queryParam, symptoms, symptomParam]
  );

  const matchedSymptom = symptomResolution.primarySymptom;

  const relatedSymptomIds = useMemo(() => {
    if (!matchedSymptom) return [];
    return getRelatedSymptoms([matchedSymptom.id]);
  }, [matchedSymptom]);

  const relatedSymptoms = useMemo(() => {
    if (!relatedSymptomIds.length) return [];
    return relatedSymptomIds.map(id => symptoms.find(s => s.id === id)).filter(Boolean);
  }, [relatedSymptomIds, symptoms]);

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

  const rankedRemedies = useMemo(() => {
    const ids = symptomResolution.symptomIds;
    if (ids.length === 0) return [];

    let result = getRankedRemediesForSymptoms(ids, symptomRemedies, remedies, {
      includeRelated: true,
      symptoms,
    });
    result = result.filter(safeFilter);

    result.sort((a, b) => (b._priorityRank || 0) - (a._priorityRank || 0) || (b.rating || 0) - (a.rating || 0));

    return result;
  }, [symptomResolution.symptomIds, symptomRemedies, remedies, safeFilter, symptoms]);

  const nonConventional = useMemo(() => rankedRemedies.filter(r => r.category !== 'Conventional'), [rankedRemedies]);
  const featuredRemedy = useMemo(() => nonConventional.length > 0 ? nonConventional[0] : null, [nonConventional]);
  const otherRemedies = useMemo(() => nonConventional.length > 1 ? nonConventional.slice(1) : [], [nonConventional]);

  const grouped = useMemo(() => {
    const groups = { Lifestyle: [], Natural: [], Ayurveda: [], TCM: [] };
    for (const r of otherRemedies) {
      if (groups[r.category]) groups[r.category].push(r);
      else groups[r.category] = [r];
    }
    return groups;
  }, [otherRemedies]);

  const categoryOrder = ['Lifestyle', 'Natural', 'Ayurveda', 'TCM'];
  const categoryIcons = { Lifestyle: '\u{1F9D8}', Natural: '\u{1F33F}', Ayurveda: '\u{1FA85}', TCM: '\u{2695}\u{FE0F}' };

  const featuredIsSafe = useMemo(() => {
    if (!featuredRemedy) return true;
    return isRemedySafeForUser(featuredRemedy, { allergies: activeAllergies, conditions: activeConditions });
  }, [featuredRemedy, activeAllergies, activeConditions]);

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
            {relatedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-xs text-ink-muted font-medium mr-1 self-center">Related:</span>
                {relatedSymptoms.map(rs => (
                  <span
                    key={rs.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent-dark font-medium"
                  >
                    {rs.emoji} {rs.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEmergencyQuery(queryParam) ? (
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">{EMERGENCY_MESSAGE}</h2>
            <p className="text-red-600 font-medium mb-4">{EMERGENCY_ACTION}</p>
            <p className="text-red-500 text-sm">ClotSolid does not provide self-treatment guidance for potentially serious symptoms.</p>
          </div>
        </div>
      ) : nonConventional.length === 0 && !isCatalogLoading ? (
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
        <div className="max-w-2xl mx-auto space-y-6 px-6">
          {featuredRemedy && (
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Top Recommendation</p>
              <RemedyCard remedy={featuredRemedy} variant="carousel" isSafe={featuredIsSafe} />
            </div>
          )}

          <div className="space-y-3">
            {categoryOrder.map((cat) => (
              <CategorySection
                key={cat}
                title={cat}
                icon={categoryIcons[cat]}
                items={grouped[cat]}
                defaultOpen={cat === 'Lifestyle'}
                isSafe={(remedy) => isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions })}
              />
            ))}
          </div>

          {!isAuthenticated && nonConventional.length > 0 && (
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
