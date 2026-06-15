import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowRight, Activity, Bookmark } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SymptomChip, RemedyCard, EmptyState } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useCatalogStore } from '../store/catalogStore';
import { CONDITIONS } from '../constants/onboarding';

const CONDITION_TO_SYMPTOM = {
  headache: 'headache',
  cold: 'cold',
  anxiety: 'anxiety',
  insomnia: 'insomnia',
  nausea: 'nausea',
};

export function Dashboard() {
  const { user } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { appointments } = useAppointmentStore();
  const symptoms = useCatalogStore((state) => state.symptoms);
  const remedies = useCatalogStore((state) => state.remedies);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const featuredRemedies = remedies.filter(r => r.isFeatured).slice(0, 4);
  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');
  const selectedConditionChips = CONDITIONS.filter((condition) => user?.common_conditions?.includes(condition.value));

  const greetingSubtitle = user?.gender
    ? 'We tailored today\'s remedy flow around the profile details you shared.'
    : 'Ready to feel better today?';

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24 md:pb-8 pt-6 md:pt-10">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-extrabold text-ink mb-2">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-ink-muted">{greetingSubtitle}</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Bookmark} value={favorites.length} label="Saved" color="forest" />
          <StatCard icon={CalendarIcon} value={appointments.length} label="Appts" color="sage" />
          <StatCard icon={Activity} value={12} label="Searches" color="amber" />
        </div>

        {/* Quick Search */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink">Quick Search</h2>
            <Link to="/search" className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {selectedConditionChips.length > 0 ? (
            <div className="mb-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">Your Conditions</p>
              <div className="flex flex-wrap gap-3">
                {selectedConditionChips.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => {
                      const symptomId = CONDITION_TO_SYMPTOM[condition.value];
                      navigate(symptomId ? `/results?symptom=${symptomId}` : '/search');
                    }}
                    className="flex items-center gap-2 rounded-full border border-forest bg-forest px-4 py-2 text-sm font-semibold text-white shadow-forest transition-transform hover:scale-[1.02]"
                  >
                    <span>{condition.emoji}</span>
                    <span>{condition.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {symptoms.map(symptom => (
              <SymptomChip 
                key={symptom.id} 
                symptom={symptom} 
                isSelected={false}
                onClick={() => navigate(`/results?symptom=${symptom.id}`)}
                className="w-full justify-center"
              />
            ))}
          </div>
        </section>

        {/* Featured Remedies */}
        <section>
          <h2 className="text-xl font-bold text-ink mb-4">Featured Remedies</h2>
          <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x -mx-6 px-6 md:mx-0 md:px-0">
            {featuredRemedies.map(remedy => (
              <div key={remedy.id} className="snap-start min-w-[280px] w-[280px] md:w-1/3 shrink-0">
                <RemedyCard remedy={remedy} />
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Appointment */}
        <section>
          <h2 className="text-xl font-bold text-ink mb-4">Next Appointment</h2>
          {upcomingAppointment ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-forest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-ink">{upcomingAppointment.title}</h3>
                <p className="text-ink-muted">{upcomingAppointment.doctor}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-ink-muted font-medium">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <CalendarIcon className="w-4 h-4" /> {upcomingAppointment.date}
                  </span>
                  <span>{upcomingAppointment.time}</span>
                </div>
              </div>
              <Link 
                to="/appointments"
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Manage
              </Link>
            </div>
          ) : (
            <EmptyState 
              icon={CalendarIcon}
              title="No upcoming appointments"
              description="Schedule a checkup or consultation if symptoms persist."
              ctaLabel="Book Appointment"
              ctaHref="/appointments"
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            />
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colorMap = {
    forest: 'bg-forest/10 text-forest',
    sage: 'bg-sage/10 text-sage-dark',
    amber: 'bg-amber/20 text-amber-dark'
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-bold text-ink">{value}</span>
      <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}
