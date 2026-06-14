import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowRight, Activity, Bookmark, Search as SearchIcon } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { SymptomChip, RemedyCard, EmptyState } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { SYMPTOMS } from '../data/symptoms';
import { REMEDIES } from '../data/remedies';

export function Dashboard() {
  const { user } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { appointments } = useAppointmentStore();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const featuredRemedies = REMEDIES.filter(r => r.isFeatured).slice(0, 4);
  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-8 pt-6 md:pt-10">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-extrabold text-ink mb-2">
            {greeting}, {user?.name.split(' ')[0]} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-ink-muted">Ready to feel better today?</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Bookmark} value={favorites.length} label="Saved" color="coral" />
          <StatCard icon={CalendarIcon} value={appointments.length} label="Appts" color="teal" />
          <StatCard icon={Activity} value={12} label="Searches" color="yellow" />
        </div>

        {/* Quick Search */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink">Quick Search</h2>
            <Link to="/search" className="text-sm font-medium text-coral hover:text-coral-dark flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOMS.map(symptom => (
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-coral flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
    coral: 'bg-coral/10 text-coral',
    teal: 'bg-teal/10 text-teal-dark',
    yellow: 'bg-yellow/20 text-yellow-dark'
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
