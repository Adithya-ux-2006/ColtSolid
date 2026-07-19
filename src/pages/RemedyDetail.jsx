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
import { Reveal } from '../components/ui/Reveal';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { useGuestProfileStore } from '../store/guestProfileStore';
import { isRemedySafeForUser } from '../utils/guestProfile';
import { cn } from '../utils/cn';
import { trackRemedyEvent } from '../utils/analytics';

const CATEGORY_BENEFITS = {
  Natural: [
    { title: 'Gentle & plant-based', description: 'Derived from natural sources with minimal processing.' },
    { title: 'Holistic relief', description: 'Addresses root causes, not just surface symptoms.' },
    { title: 'Low side-effect profile', description: 'Well tolerated by most people when used as directed.' },
  ],
  TCM: [
    { title: 'Ancient clinical wisdom', description: 'Rooted in centuries of traditional Chinese medicine.' },
    { title: 'Whole-body balance', description: 'Restores harmony across multiple body systems.' },
    { title: 'Non-invasive approach', description: 'Drug-free method using natural pressure points.' },
  ],
  Conventional: [
    { title: 'Clinically validated', description: 'Backed by rigorous trials and peer-reviewed research.' },
    { title: 'Fast-acting relief', description: 'Rapid onset of symptom relief when needed most.' },
    { title: 'Precise, standardised dosing', description: 'Consistent formulation for predictable results.' },
  ],
  Lifestyle: [
    { title: 'No medication required', description: 'Drug-free habit built from everyday routines.' },
    { title: 'Long-term health gains', description: 'Builds sustainable improvements over time.' },
    { title: 'Combines with any treatment', description: 'Zero drug interactions or contraindications.' },
  ],
};

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
    const raw = remedy.howToUse.split('\n').filter(Boolean);
    const steps = raw.map(step => step.replace(/^\d+\.\s*/, ''));
    if (steps.length >= 3) return steps.slice(0, 3);
    if (steps.length === 1) {
      const text = steps[0];
      const parts = text
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(Boolean);
      if (parts.length >= 3) return parts.slice(0, 3);
      if (parts.length === 2) {
        const merged = parts[0];
        const tail = parts[1];
        const sub = tail.split(/\s+and\s+|\s+then\s+|\s+while\s+|\s+to\s+/i).map(s => s.trim()).filter(Boolean);
        if (sub.length >= 2) return [merged, sub[0], sub.slice(1).join(' ')];
        return [merged, tail];
      }
      return steps;
    }
    return steps;
  }, [remedy]);

  const benefits = useMemo(() => {
    if (remedy?.benefits) return remedy.benefits;
    const category = remedy?.category;
    const defaults = CATEGORY_BENEFITS[category] || CATEGORY_BENEFITS.Natural;
    if (!remedy?.longDescription) return defaults;
    const parts = remedy.longDescription.split(/\.\s+/).filter(Boolean);
    if (parts.length <= 1) return defaults;
    return parts.slice(0, 3).map((sentence, i) => {
      const clean = sentence.trim().replace(/\.$/, '');
      return {
        title: clean.length > 60 ? clean.slice(0, 57) + '…' : clean,
        description: defaults[i]?.description || undefined,
      };
    });
  }, [remedy]);

  const researchLinks = useMemo(() => {
    if (!remedy) return [];
    return remedy.researchPapers || remedy.researchLinks || [];
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
            className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors duration-200 min-h-[44px] hover:text-ink active:text-ink/70"
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
              'p-2.5 rounded-full transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center',
              'active:scale-90',
              favorite ? 'text-primary' : 'text-ink-muted hover:text-primary'
            )}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-5 h-5', favorite && 'fill-primary')} />
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 md:px-8 pt-10 pb-8 md:pt-14 md:pb-10">
        <RemedyHero
          remedy={remedy}
          isSafe={isSafe}
          evidenceScore={evidenceScore}
          safetyScore={safetyScore}
        />
      </div>

      <div className="max-w-[800px] mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <Reveal>
          <div className="rounded-2xl bg-card border border-border p-4 md:p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
            <QuickStats
              remedy={remedy}
              isSafe={isSafe}
              evidenceScore={evidenceScore}
              safetyScore={safetyScore}
            />
          </div>
        </Reveal>
      </div>

      <div className="max-w-[800px] mx-auto px-5 md:px-8">

        <div className="mb-12 md:mb-16">
          {!isSafe && remedy.warnings ? (
            <Reveal>
              <AdvisoryCard
                title="Allergy conflict detected"
                message="This remedy may not be suitable based on your health profile. Please consult with a healthcare professional before use."
              />
            </Reveal>
          ) : (
            <SafetyBanner />
          )}
        </div>

        {benefits.length > 0 && (
          <section className="mb-12 md:mb-16">
            <Reveal>
              <h2 className="section-title mb-5">Benefits</h2>
            </Reveal>
            <div className="rounded-[20px] bg-card border border-border p-6 md:p-8 shadow-card hover:shadow-card-lg transition-shadow duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0">
                {benefits.map((benefit, i) => (
                  <div key={i} className={cn(
                    'relative',
                    i < benefits.length - 1 && 'lg:border-r lg:border-border-subtle lg:pr-6',
                    i > 0 && 'lg:border-l-0',
                    'lg:first:pl-0'
                  )}>
                    <BenefitCard
                      title={benefit.title}
                      description={benefit.description}
                      delay={i * 0.07}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {howToUseSteps.length > 0 && (
          <section className="mb-12 md:mb-16">
            <Reveal>
              <h2 className="section-title mb-5">How To Use</h2>
            </Reveal>
            <div className="rounded-[20px] bg-card border border-border p-6 md:p-8 shadow-card hover:shadow-card-lg transition-shadow duration-200">
              {howToUseSteps.map((step, i) => (
                <TimelineStep
                  key={i}
                  number={i + 1}
                  description={step}
                  isLast={i === howToUseSteps.length - 1}
                  delay={i * 0.15}
                  arrowDelay={(i + 1) * 0.15 + 0.05}
                />
              ))}
            </div>
          </section>
        )}

        {researchLinks.length > 0 && (
          <section className="mb-12 md:mb-16">
            <Reveal>
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
            </Reveal>
            <div className="divide-y divide-border-subtle">
              {visibleEvidence.map((source, idx) => (
                <EvidenceCard
                  key={idx}
                  source={source}
                  delay={idx * 0.06}
                  onTrackClick={() => trackRemedyEvent({ remedyId: remedy.id, eventType: 'research_clicked', metadata: { url: source.url, label: source.journal || source.label } }).catch(() => {})}
                />
              ))}
            </div>
            {!showAllEvidence && researchLinks.length > EVIDENCE_SHOW_LIMIT && (
              <button
                onClick={() => setShowAllEvidence(true)}
                className="flex items-center gap-1 text-sm font-medium text-primary mt-4 transition-all duration-200 hover:opacity-80 active:opacity-60"
              >
                Show {researchLinks.length - EVIDENCE_SHOW_LIMIT} more {researchLinks.length - EVIDENCE_SHOW_LIMIT === 1 ? 'study' : 'studies'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </section>
        )}

        {remedy.isPurchasable !== false && (
          <div className="mb-12 md:mb-16">
            <NearbyShops remedyName={remedy.name} />
          </div>
        )}

        {remedy.warnings && (
          <section className="mb-12 md:mb-16">
            <Reveal>
              <h2 className="section-title mb-5">Safety Information</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <AdvisoryCard
                title="Important"
                message={remedy.warnings}
              />
            </Reveal>
          </section>
        )}

        <section className="mb-12 md:mb-16">
          <DoctorGuidance />
        </section>
      </div>
    </PageWrapper>
  );
}
