import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Heart } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { EmptyState } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useCatalogStore } from '../store/catalogStore';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoritesStore((state) => state.favorites);
  const appointments = useAppointmentStore((state) => state.appointments);
  const remedies = useCatalogStore((state) => state.remedies);
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const favoriteRemedies = useMemo(
    () => remedies.filter(r => favorites.some(f => f.remedy_id === r.id)).slice(0, 5),
    [remedies, favorites]
  );

  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-16 pt-8">
      <div className="max-w-2xl mx-auto px-6 space-y-10">
        {/* Greeting */}
        <header>
          <h1 className="text-3xl md:text-display font-bold text-ink mb-2">
            {greeting}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-ink-muted">Ready to find relief?</p>
        </header>

        {/* Quick Action */}
        <section>
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow text-left flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-coral" />
            </div>
            <div>
              <p className="font-semibold text-ink">Search Symptoms</p>
              <p className="text-sm text-ink-muted">Find evidence-backed remedies</p>
            </div>
          </button>
        </section>

        {/* Saved Remedies */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading font-semibold text-ink">Saved Remedies</h2>
            {favoriteRemedies.length > 0 && (
              <Link to="/favorites" className="text-sm text-teal font-medium hover:underline">
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
                  className="block bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow"
                >
                  <p className="font-semibold text-ink">{remedy.name}</p>
                  <p className="text-sm text-ink-muted mt-0.5">{remedy.shortDescription}</p>
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
              className="bg-white rounded-2xl shadow-soft"
            />
          )}
        </section>

        {/* Upcoming Appointment */}
        <section>
          <h2 className="text-heading font-semibold text-ink mb-4">Next Appointment</h2>
          {upcomingAppointment ? (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-ink mb-1">{upcomingAppointment.title}</h3>
              <p className="text-sm text-ink-muted mb-2">{upcomingAppointment.doctor}</p>
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
              className="bg-white rounded-2xl shadow-soft"
            />
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
