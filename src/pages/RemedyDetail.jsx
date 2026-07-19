import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, BookOpen, ChevronRight } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { RemedyHero } from '../components/ui/RemedyHero';
import { QuickStats } from '../components/ui/QuickStats';
import { SafetyBanner } from '../components/ui/SafetyBanner';
import { BenefitCard } from '../components/ui/BenefitCard';
import { TimelineStep } from '../components/ui/TimelineStep';
import { EvidenceCard } from '../components/ui/EvidenceCard';
import { AdvisoryCard } from '../components/ui/AdvisoryCard';
import { DoctorGuidance } from '../components/ui/DoctorGuidance';
import { NearbyShops } from '../components/ui/NearbyShops';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { useGuestProfileStore } from '../store/guestProfileStore';
import { isRemedySafeForUser } from '../utils/guestProfile';
import { cn } from '../utils/cn';
import { trackRemedyEvent } from '../utils/analytics';

const DEFAULT_BENEFITS = [
  { title: 'Fast acting', description: 'Many users report relief within minutes.' },
  { title: 'Low risk', description: 'Generally well tolerated with minimal side effects.' },
  { title: 'Easy to use', description: 'Simple application with no special equipment needed.' },
];

const EVIDENCE_SHOW_LIMIT = 4;

export function RemedyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies) ?? [];
  const userConditions = useAuthStore((state) => state.user?.common_conditions);
  const guestAllergies = useGuestProfileStore((state) => state.known_allergies);
  const guestConditions = useGuestProfileStore((state) => state.common_conditions);
  const activeAllergies = isAuthenticated ? userKnownAllergies : guestAllergies;
  const activeConditions = isAuthenticated ? userConditions : guestConditions;

  const remedy = remedies.find(r => r.id === id);
  const favorite = useFavoritesStore((state) => (remedy ? state.isFavorite(remedy.id) : false));

  const isSafe = useMemo(() => {
    if (!remedy) return true;
    return isRemedySafeForUser(remedy, { allergies: activeAllergies, conditions: activeConditions });
  }, [remedy, activeAllergies, activeConditions]);

  useEffect(() => {
    if (!remedy?.id) return;
    trackRemedyEvent({ remedyId: remedy.id, eventType: 'viewed' }).catch(() => {});
  }, [remedy?.id]);

  const howToUseSteps = useMemo(() => {
    if (!remedy?.howToUse) return [];
    return remedy.howToUse.split('\n').filter(Boolean).map(step => step.replace(/^\d+\.\s*/, ''));
  }, [remedy]);

  const researchLinks = useMemo(() => {
    if (!remedy) return [];
    return remedy.researchPapers || remedy.researchLinks || [];
  }, [remedy]);

  const benefits = useMemo(() => {
    if (!remedy?.longDescription) return DEFAULT_BENEFITS;
    const parts = remedy.longDescription.split(/\.\s+/).filter(Boolean);
    if (parts.length <= 1) return [{ title: 'Benefits', description: remedy.longDescription }];
    return parts.slice(0, 3).map((sentence, i) => ({
      title: sentence.trim().replace(/\.$/, ''),
      description: i === 0 ? 'First-line treatment option.' : undefined,
    }));
  }, [remedy]);

  const evidenceScore = useMemo(() => {
    if (!researchLinks.length) return 0;
    if (researchLinks.length >= 3) return 8;
    if (researchLinks.length >= 2) return 6;
    return 4;
  }, [researchLinks]);

  const safetyScore = useMemo(() => {
    if (!remedy) return 80;
    if (remedy.contraindications?.length > 2) return 40;
    if (remedy.contraindications?.length > 0) return 65;
    return 90;
  }, [remedy]);

  const visibleEvidence = showAllEvidence ? researchLinks : researchLinks.slice(0, EVIDENCE_SHOW_LIMIT);

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-bg">
        <div className="max-w-[800px] mx-auto px-5 md:px-8 pt-8">
          <LoadingSkeleton count={1} />
        </div>
      </PageWrapper>
    );
  }

  if (!remedy) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <p className="text-ink-muted text-base">Remedy not found</p>
      </div>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-bg pb-28 md:pb-24">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[800px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/search');
              }
            }}
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors duration-150 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) { navigate('/register'); return; }
              toggleFavorite(remedy);
            }}
            className={cn(
              'p-2.5 rounded-full transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center',
              favorite ? 'text-primary' : 'text-ink-muted hover:text-primary'
            )}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-5 h-5', favorite && 'fill-primary')} />
          </button>
        </div>
      </div>

      {/* ─── Hero ─── Open layout, no card, generous whitespace */}
      <div className="max-w-[800px] mx-auto px-5 md:px-8 pt-10 pb-8 md:pt-14 md:pb-10">
        <RemedyHero
          remedy={remedy}
          isSafe={isSafe}
          evidenceScore={evidenceScore}
          safetyScore={safetyScore}
        />
      </div>

      {/* ─── Quick Stats ─── Borderless strip, no card wrapper */}
      <div className="max-w-[800px] mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <div className="rounded-2xl bg-card border border-border p-4 md:p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
          <QuickStats
            remedy={remedy}
            isSafe={isSafe}
            evidenceScore={evidenceScore}
            safetyScore={safetyScore}
          />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 md:px-8">

        {/* ─── Safety ─── Banner-style, no hard borders */}
        <div className="mb-12 md:mb-16">
          {!isSafe && remedy.warnings ? (
            <AdvisoryCard
              title="Allergy conflict detected"
              message="This remedy may not be suitable based on your health profile. Please consult with a healthcare professional before use."
            />
          ) : (
            <SafetyBanner />
          )}
        </div>

        {/* ─── Benefits ─── Single card with internal grid and dividers */}
        {remedy.longDescription && (
          <section className="mb-12 md:mb-16">
            <h2 className="section-title mb-5">Benefits</h2>
            <div className="section-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">
                {benefits.map((benefit, i) => (
                  <BenefitCard
                    key={i}
                    title={benefit.title}
                    description={benefit.description}
                    delay={i * 0.05}
                    className="sm:px-5 first:sm:pl-0 last:sm:pr-0 py-4 sm:py-2"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── How To Use ─── Card with horizontal timeline */}
        {howToUseSteps.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="section-title mb-5">How To Use</h2>
            <div className="section-card">
              {howToUseSteps.map((step, i) => (
                <TimelineStep
                  key={i}
                  number={i + 1}
                  description={step}
                  isLast={i === howToUseSteps.length - 1}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Evidence ─── Dense, journal-style, no card wrapper */}
        {researchLinks.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-2">
              <h2 className="section-title mb-0">Evidence</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <BookOpen className="w-3.5 h-3.5" />
                {evidenceScore >= 7 ? 'High Quality' : evidenceScore >= 4 ? 'Moderate' : 'Some'}
              </span>
            </div>
            <p className="text-sm text-ink-muted mb-5">
              Based on {researchLinks.length} peer-reviewed {researchLinks.length === 1 ? 'study' : 'studies'}
            </p>
            <div className="divide-y divide-border-subtle">
              {visibleEvidence.map((source, idx) => (
                <EvidenceCard
                  key={idx}
                  source={source}
                  onTrackClick={() => trackRemedyEvent({ remedyId: remedy.id, eventType: 'research_clicked', metadata: { url: source.url, label: source.journal || source.label } }).catch(() => {})}
                />
              ))}
            </div>
            {!showAllEvidence && researchLinks.length > EVIDENCE_SHOW_LIMIT && (
              <button
                onClick={() => setShowAllEvidence(true)}
                className="flex items-center gap-1 text-sm font-medium text-primary mt-4 hover:opacity-80 transition-opacity"
              >
                Show {researchLinks.length - EVIDENCE_SHOW_LIMIT} more {researchLinks.length - EVIDENCE_SHOW_LIMIT === 1 ? 'study' : 'studies'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </section>
        )}

        {/* ─── Where To Buy ─── Featured + compact list */}
        {remedy.isPurchasable !== false && (
          <div className="mb-12 md:mb-16">
            <NearbyShops remedyName={remedy.name} />
          </div>
        )}

        {/* ─── Safety Information ─── Amber advisory */}
        {remedy.warnings && (
          <section className="mb-12 md:mb-16">
            <h2 className="section-title mb-5">Safety Information</h2>
            <AdvisoryCard
              title="Important"
              message={remedy.warnings}
            />
          </section>
        )}

        {/* ─── When To See A Doctor ─── Checklist */}
        <section className="mb-12 md:mb-16">
          <DoctorGuidance />
        </section>
      </div>
    </PageWrapper>
  );
}
