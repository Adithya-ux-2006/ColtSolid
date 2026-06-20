import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink, Clock, Star, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { CategoryTag, LoadingSkeleton, SafetyNotice, DoctorGuidance, AllergyBadge } from '../components/ui';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { getGuestAllergies, getGuestConditions, isRemedySafeForUser } from '../utils/guestProfile';
import { cn } from '../utils/cn';
import { trackRemedyEvent } from '../utils/analytics';

export function RemedyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);

  const userKnownAllergies = useAuthStore((state) => state.user?.known_allergies) ?? [];
  const userConditions = useAuthStore((state) => state.user?.common_conditions);
  const guestAllergies = useMemo(() => (!isAuthenticated ? getGuestAllergies() : []), [isAuthenticated]);
  const guestConditions = useMemo(() => (!isAuthenticated ? getGuestConditions() : []), [isAuthenticated]);
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

  if (!hasLoaded && isCatalogLoading) {
    return (
      <PageWrapper className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={1} />
        </div>
      </PageWrapper>
    );
  }

  if (!remedy) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <p className="text-ink-muted">Remedy not found</p>
      </div>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-bg pb-16">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
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
            "p-2 rounded-full transition-colors",
            favorite ? "text-accent-dark" : "text-ink-muted hover:text-accent-dark"
          )}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-5 h-5", favorite && "fill-accent-dark")} />
        </button>
      </div>

      {/* Title + Meta Section */}
      <div className="px-6 pb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <CategoryTag category={remedy.category} />
          <AllergyBadge isSafe={isSafe} compact />
        </div>
        <h1 className="text-3xl md:text-display font-bold text-ink mb-3">{remedy.name}</h1>
        {remedy.shortDescription && (
          <p className="text-lg text-ink-muted leading-relaxed">{remedy.shortDescription}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink-muted">
          {remedy.timeToEffect && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {remedy.timeToEffect}
            </span>
          )}
          {remedy.difficulty && (
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-primary" />
              {remedy.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-2xl mx-auto space-y-8 px-6">
        {/* Safety */}
        {!isSafe && (
          <section>
            <SafetyNotice
              title="Allergy conflict detected"
              message="This remedy may not be suitable based on your health profile. Please consult with a healthcare professional before use."
            />
          </section>
        )}

        {isSafe && (
          <section>
            <div className="section-card flex items-center gap-3 border border-accent/20">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-ink-muted">✓ Safe for you based on your health profile</p>
            </div>
          </section>
        )}

        {/* Benefits */}
        {remedy.longDescription && (
          <section className="section-card">
            <h2 className="section-title">Benefits</h2>
            <p className="text-body text-ink leading-relaxed">{remedy.longDescription}</p>
          </section>
        )}

        {/* How To Use */}
        {howToUseSteps.length > 0 && (
          <section className="section-card">
            <h2 className="section-title">How To Use</h2>
            <ol className="space-y-4">
              {howToUseSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 rounded-xl bg-surface text-primary flex items-center justify-center font-semibold text-sm shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-body text-ink pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Evidence */}
        {researchLinks.length > 0 && (
          <section className="section-card">
            <h2 className="section-title">Evidence</h2>
            <div className="space-y-3">
              {researchLinks.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackRemedyEvent({ remedyId: remedy.id, eventType: 'research_clicked', metadata: { url: source.url, label: source.journal || source.label } }).catch(() => {})}
                  className="flex items-center gap-3 p-4 -mx-2 rounded-2xl hover:bg-surface/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-0.5">
                      {source.journal || source.label || 'Clinical Research'}
                    </p>
                    {source.keyFinding && (
                      <p className="text-sm text-ink leading-relaxed">&ldquo;{source.keyFinding}&rdquo;</p>
                    )}
                    {source.label && !source.keyFinding && (
                      <p className="text-sm text-ink">{source.label}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-ink-subtle shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Safety Notes */}
        {remedy.warnings && (
          <section>
            <SafetyNotice message={remedy.warnings} title="Safety Information" />
          </section>
        )}

        {/* When To See A Doctor */}
        <section>
          <DoctorGuidance />
        </section>
      </div>
    </PageWrapper>
  );
}
