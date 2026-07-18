import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, ArrowRight, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard } from '../components/ui/RemedyCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useGuestProfileStore } from '../store/guestProfileStore';
import { ALLERGIES, CONDITIONS } from '../constants/onboarding';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoritesStore((state) => state.favorites);
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const guestAllergies = useGuestProfileStore((state) => state.known_allergies);
  const guestConditions = useGuestProfileStore((state) => state.common_conditions);
  const navigate = useNavigate();

  const activeAllergies = useMemo(
    () => isAuthenticated ? (user?.known_allergies ?? []) : guestAllergies,
    [isAuthenticated, user?.known_allergies, guestAllergies]
  );
  const activeConditions = useMemo(
    () => isAuthenticated ? (user?.common_conditions ?? []) : guestConditions,
    [isAuthenticated, user?.common_conditions, guestConditions]
  );
  const hasOnboarding = user?.has_completed_onboarding ?? false;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const featuredRemedies = useMemo(
    () => remedies.filter(r => r.isFeatured).slice(0, 6),
    [remedies]
  );

  const favoriteRemedies = useMemo(
    () => remedies.filter(r => favorites.some(f => f.id === r.id)).slice(0, 5),
    [remedies, favorites]
  );

  const selectedConditionChips = useMemo(
    () => CONDITIONS.filter((condition) => activeConditions.includes(condition.value)),
    [activeConditions]
  );

  const selectedAllergyChips = useMemo(
    () => ALLERGIES.filter((allergy) => activeAllergies.includes(allergy.value)),
    [activeAllergies]
  );

  return (
    <PageWrapper className="min-h-screen bg-bg pb-24 md:pb-16 pt-6 md:pt-10">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <header>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-ink-muted">{greeting}</span>
          </div>
          <h1 className="text-3xl md:text-display font-bold text-ink mb-2">
            {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-ink-muted">Ready to feel better today?</p>
        </header>

        {/* Onboarding Incomplete Banner */}
        {isAuthenticated && !hasOnboarding && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900">Complete your health profile</p>
              <p className="text-sm text-amber-700 mt-0.5">Tell us about your allergies and conditions for safer, personalized remedy recommendations.</p>
            </div>
            <Link
              to="/onboarding"
              className="shrink-0 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              Complete
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Heart} value={favorites.length} label="Saved" />
          <StatCard icon={Activity} value={"—"} label="Searches" />
        </div>

        {/* Health Profile Card */}
        {(activeConditions.length > 0 || activeAllergies.length > 0) && (
          <section className="bg-card rounded-2xl shadow-soft border border-ink/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-ink">Health Profile</h2>
              </div>
              <Link
                to="/profile"
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Edit
              </Link>
            </div>
            <div className="space-y-3">
              {activeConditions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConditionChips.map((c) => (
                      <span key={c.value} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeAllergies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAllergyChips.map((a) => (
                      <span key={a.value} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-medium text-amber-800">
                        <span>{a.emoji}</span>
                        <span>{a.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Quick Search</h2>
            <Link to="/search" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {selectedConditionChips.length > 0 && (
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Your Conditions</p>
              <div className="flex flex-wrap gap-2">
                {selectedConditionChips.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => navigate('/search')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:scale-105"
                  >
                    <span>{condition.emoji}</span>
                    <span>{condition.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-6 px-6 snap-x">
            {symptoms.slice(0, 8).map((symptom) => (
              <button
                key={symptom.id}
                type="button"
                onClick={() => navigate(`/results?symptom=${symptom.id}`)}
                className="snap-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft hover:shadow-card transition-shadow text-sm font-medium text-ink border border-ink/5"
              >
                <span>{symptom.emoji}</span>
                <span>{symptom.label}</span>
              </button>
            ))}
          </div>
        </section>

        {featuredRemedies.length > 0 && (
          <section>
            <h2 className="section-title">Featured Remedies</h2>
            <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x">
              {featuredRemedies.map((remedy) => (
                <div key={remedy.id} className="snap-start min-w-[280px] w-[280px] md:w-1/3 shrink-0">
                  <RemedyCard remedy={remedy} featured />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Saved Remedies</h2>
            {favoriteRemedies.length > 0 && (
              <Link to="/favorites" className="text-sm text-primary font-medium hover:underline">
                View all
              </Link>
            )}
          </div>
          {favoriteRemedies.length > 0 ? (
            <div className="space-y-3">
              {favoriteRemedies.map((remedy) => (
                <Link
                  key={remedy.id}
                  to={`/remedy/${remedy.id}`}
                  className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                    {remedy.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink">{remedy.name}</p>
                    <p className="text-sm text-ink-muted truncate">{remedy.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No saved remedies yet"
              description="Save remedies while searching to find them here."
              ctaLabel="Search Remedies"
              ctaHref="/search"
              className="bg-card rounded-3xl shadow-soft"
            />
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-card p-4 rounded-2xl shadow-card flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-2 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-bold text-ink">{value}</span>
      <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}
