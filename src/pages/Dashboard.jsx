import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Heart, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, EmptyState } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useCatalogStore } from '../store/catalogStore';
import { CONDITIONS } from '../constants/onboarding';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoritesStore((state) => state.favorites);
  const appointments = useAppointmentStore((state) => state.appointments);
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const navigate = useNavigate();

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
    () => remedies.filter(r => favorites.some(f => f.remedy_id === r.id)).slice(0, 5),
    [remedies, favorites]
  );

  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');

  const selectedConditionChips = useMemo(
    () => CONDITIONS.filter((condition) => user?.common_conditions?.includes(condition.value)),
    [user?.common_conditions]
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

        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Heart} value={favorites.length} label="Saved" />
          <StatCard icon={Calendar} value={appointments.length} label="Appts" />
          <StatCard icon={Activity} value={12} label="Searches" />
        </div>

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
                className="snap-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft hover:shadow-card transition-shadow text-sm font-medium text-ink border border-ink/5"
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
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow"
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
              className="bg-white rounded-3xl shadow-soft"
            />
          )}
        </section>

        <section>
          <h2 className="section-title">Next Appointment</h2>
          {upcomingAppointment ? (
            <div className="bg-white rounded-3xl p-6 shadow-card border-l-4 border-primary">
              <h3 className="font-semibold text-ink mb-1">{upcomingAppointment.title}</h3>
              <p className="text-sm text-ink-muted mb-3">{upcomingAppointment.doctor}</p>
              <div className="flex items-center gap-4 text-sm text-ink-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {upcomingAppointment.date}
                </span>
                <span>{upcomingAppointment.time}</span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming appointments"
              description="Schedule a checkup if symptoms persist."
              ctaLabel="Book Appointment"
              ctaHref="/appointments"
              className="bg-white rounded-3xl shadow-soft"
            />
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-2 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-bold text-ink">{value}</span>
      <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}
