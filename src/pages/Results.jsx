import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, LoadingSkeleton, EmptyState, DoctorGuidance, RemedyCarousel, SymptomInterpreter } from '../components/ui';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { matchQueryToSymptoms, getRankedRemediesForSymptoms, isEmergencyQuery } from '../utils/symptomSearch';
import { EMERGENCY_MESSAGE, EMERGENCY_ACTION } from '../constants/emergency';
import { trackSearchEvent } from '../utils/analytics';

const EMPTY_ARRAY = [];
const SORT_OPTIONS = ['Best Rated', 'Most Researched', 'Easiest'];

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

  const [sort, setSort] = useState('Best Rated');
  const carouselsRef = useRef(null);

  const scrollToRemedies = useCallback(() => {
    carouselsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const isFreeTextSearch = Boolean(queryParam.trim());
  const matchedSymptomIds = useMemo(
    () => (isFreeTextSearch ? matchQueryToSymptoms(queryParam, symptoms) : []),
    [isFreeTextSearch, queryParam, symptoms]
  );

  const selectedSymptomIds = useMemo(() => {
    if (symptomParam) return [symptomParam];
    if (matchedSymptomIds.length > 0) return matchedSymptomIds;
    return [];
  }, [matchedSymptomIds, symptomParam]);

  const symptom = symptoms.find(s => s.id === symptomParam);

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
    let result;
    if (selectedSymptomIds.length > 0) {
      result = getRankedRemediesForSymptoms(selectedSymptomIds, symptomRemedies, remedies);
    } else {
      return [];
    }

    result = result.filter(safeFilter);

    result.sort((a, b) => {
      if (sort === 'Best Rated') return (b._priorityRank || 0) - (a._priorityRank || 0) || (b.rating || 0) - (a.rating || 0);
      if (sort === 'Most Researched') return (b._priorityRank || 0) - (a._priorityRank || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sort === 'Easiest') {
        const diffMap = { 'Easy': 1, 'Moderate': 2, 'Requires prescription': 3 };
        return (b._priorityRank || 0) - (a._priorityRank || 0) || (diffMap[a.difficulty] || 0) - (diffMap[b.difficulty] || 0);
      }
      return 0;
    });

    return result;
  }, [selectedSymptomIds, symptomRemedies, remedies, safeFilter, sort]);

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
  const categoryIcons = { Lifestyle: '🧘', Natural: '🌿', Ayurveda: '🪷', TCM: '⚕️' };

  const researchSources = useMemo(() => {
    if (!featuredRemedy) return [];
    return featuredRemedy.researchPapers || featuredRemedy.researchLinks || [];
  }, [featuredRemedy]);

  const featuredIsSafe = useMemo(() => {
    if (!featuredRemedy) return true;
    return isRemedySafeForUser(featuredRemedy, { allergies: activeAllergies, conditions: activeConditions });
  }, [featuredRemedy, activeAllergies, activeConditions]);

  const safetyWarnings = useMemo(() => {
    if (!featuredRemedy) return null;
    return featuredRemedy.warnings || null;
  }, [featuredRemedy]);

  const matchedSymptom = useMemo(() => {
    if (symptom) return symptom;
    if (selectedSymptomIds.length > 0) {
      const id = selectedSymptomIds[0];
      return symptoms.find(s => s.id === id) || null;
    }
    return null;
  }, [symptom, selectedSymptomIds, symptoms]);

  const confidence = useMemo(() => {
    if (symptomParam) return 100;
    if (isFreeTextSearch && queryParam) {
      const normalized = queryParam.toLowerCase().trim();
      const exactLabel = symptoms.some(s => s.label.toLowerCase() === normalized);
      if (exactLabel) return 100;
      if (matchedSymptomIds.length > 0) return 95;
    }
    return 0;
  }, [symptomParam, isFreeTextSearch, queryParam, symptoms, matchedSymptomIds]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const [cat, items] of Object.entries(grouped)) {
      if (items?.length) counts[cat] = items.length;
    }
    return Object.keys(counts).length > 0 ? counts : null;
  }, [grouped]);

  const headerTitle = symptom?.label || matchedSymptom?.label || queryParam || 'Results';

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-bg pb-16">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={4} />
        </div>
      </PageWrapper>
    );
  }

  if (!isFreeTextSearch && !symptom && hasLoaded) {
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
            <h1 className="text-3xl md:text-display font-bold text-ink mb-2">
              {headerTitle}
            </h1>
            <p className="text-ink-muted">
              {rankedRemedies.length > 0 && matchedSymptom
                ? `Showing remedies for ${matchedSymptom.label} — ${nonConventional.length} evidence-backed ${nonConventional.length === 1 ? 'remedy' : 'remedies'} found`
                : rankedRemedies.length > 0
                  ? `${nonConventional.length} evidence-backed ${nonConventional.length === 1 ? 'remedy' : 'remedies'} found`
                  : 'Searching for remedies...'}
            </p>
          </div>
          {nonConventional.length > 1 && (
            <div className="flex items-center gap-2 text-sm shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-ink-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-ink-muted font-medium focus:outline-none focus:text-ink cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
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
            description={`No evidence-backed remedies were found for "${queryParam}". Try a different search term.`}
            ctaLabel="Search Again"
            ctaHref="/search"
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-10 px-6">
          <SymptomInterpreter
            symptom={matchedSymptom}
            confidence={confidence}
            topRemedy={featuredRemedy}
            evidenceScore={featuredRemedy?._evidenceScore}
            categoryCounts={categoryCounts}
            safetyNote={safetyWarnings}
            isSafe={featuredIsSafe}
            isEmergency={isEmergencyQuery(queryParam)}
            onViewRemedies={nonConventional.length > 1 ? scrollToRemedies : undefined}
          />

          <div ref={carouselsRef}>
          {categoryOrder.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <RemedyCarousel key={cat} title={`${categoryIcons[cat]} ${cat} Remedies`}>
                {items.map((remedy) => (
                  <RemedyCard key={remedy.id} remedy={remedy} variant="carousel" isSafe={isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions })} />
                ))}
              </RemedyCarousel>
            );
          })}
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

          {researchSources.length > 0 && (
            <section className="section-card">
              <h2 className="section-title">Research Sources</h2>
              <div className="space-y-3">
                {researchSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 -mx-2 rounded-2xl hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-0.5">
                        {source.journal || source.label || 'Research'}
                      </p>
                      <p className="text-sm text-ink truncate">
                        {source.keyFinding || source.label}
                      </p>
                    </div>
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
