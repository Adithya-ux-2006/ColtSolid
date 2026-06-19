import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { CategoryTag, LoadingSkeleton, SafetyNotice, DoctorGuidance } from '../components/ui';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
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

  const remedy = remedies.find(r => r.id === id);
  const favorite = useFavoritesStore((state) => (remedy ? state.isFavorite(remedy.id) : false));

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
      <PageWrapper className="min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <LoadingSkeleton count={1} />
        </div>
      </PageWrapper>
    );
  }

  if (!remedy) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <p className="text-ink-muted">Remedy not found</p>
      </div>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-cream pb-16">
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
            if (!isAuthenticated) { navigate('/login'); return; }
            toggleFavorite(remedy);
          }}
          className={cn(
            "transition-colors",
            favorite ? "text-coral" : "text-ink-muted hover:text-coral"
          )}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-5 h-5", favorite && "fill-coral")} />
        </button>
      </div>

      {/* Title Section */}
      <div className="px-6 pb-8 max-w-2xl mx-auto">
        <CategoryTag category={remedy.category} className="mb-3" />
        <h1 className="text-3xl md:text-display font-bold text-ink mb-3">{remedy.name}</h1>
        {remedy.shortDescription && (
          <p className="text-lg text-ink-muted leading-relaxed">{remedy.shortDescription}</p>
        )}
      </div>

      {/* Content Sections */}
      <div className="max-w-2xl mx-auto space-y-10 px-6">
        {/* Overview */}
        {remedy.longDescription && (
          <section id="overview">
            <h2 className="section-heading">Overview</h2>
            <p className="text-body text-ink leading-relaxed">{remedy.longDescription}</p>
          </section>
        )}

        {/* How To Use */}
        {howToUseSteps.length > 0 && (
          <section id="how-to-use">
            <h2 className="section-heading">How To Use</h2>
            <ol className="space-y-4">
              {howToUseSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-teal/10 text-teal flex items-center justify-center font-semibold text-sm shrink-0 mt-0.5">
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
          <section id="evidence">
            <h2 className="section-heading">Evidence</h2>
            <div className="space-y-3">
              {researchLinks.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackRemedyEvent({ remedyId: remedy.id, eventType: 'research_clicked', metadata: { url: source.url, label: source.journal || source.label } }).catch(() => {})}
                  className="flex items-center gap-3 bg-white rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-teal uppercase tracking-wider mb-0.5">
                      {source.journal || source.label || 'Clinical Research'}
                    </p>
                    {source.keyFinding && (
                      <p className="text-sm text-ink leading-relaxed">&ldquo;{source.keyFinding}&rdquo;</p>
                    )}
                    {source.label && !source.keyFinding && (
                      <p className="text-sm text-ink">{source.label}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-ink-muted shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Safety Notes */}
        {remedy.warnings && (
          <section id="safety">
            <SafetyNotice message={remedy.warnings} />
          </section>
        )}

        {/* When To See A Doctor */}
        <section id="when-to-see-doctor">
          <DoctorGuidance />
        </section>
      </div>
    </PageWrapper>
  );
}
