import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { FAQAccordion } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { getInitials } from '../utils/mappers';
import { ALLERGIES, CONDITIONS, FAQ_ITEMS, GENDER_OPTIONS } from '../constants/onboarding';

const ONBOARDING_LABELS = new Map(
  [...CONDITIONS, ...ALLERGIES].map((option) => [option.value, option.label])
);

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const favorites = useFavoritesStore((state) => state.favorites);
  const appointments = useAppointmentStore((state) => state.appointments);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    gender: user?.gender || ''
  });

  const [expandedSection, setExpandedSection] = useState(null);

  if (!user) return null;

  const selectedConditions = user.common_conditions ?? [];
  const selectedAllergies = user.known_allergies ?? [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser({
      ...editForm,
      avatar: getInitials(editForm.name)
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditForm({
      name: user?.name || '',
      gender: user?.gender || '',
    });
    setIsEditing(true);
  };

  const formatValue = (value) => {
    if (!value) return value;
    if (value.startsWith('other:')) return value.slice(6).trim();
    if (ONBOARDING_LABELS.has(value)) return ONBOARDING_LABELS.get(value);

    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  return (
    <PageWrapper className="min-h-screen bg-bg pb-24 md:pb-8 pt-6">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-glow shrink-0">
            {user.avatar}
          </div>
          
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Name"
                />
                <div className="flex flex-wrap gap-2">
                  {['male', 'female', 'non-binary-other', 'prefer-not-to-say'].map((option) => {
                    const labels = {
                      male: 'Male',
                      female: 'Female',
                      'non-binary-other': 'Non-binary / Other',
                      'prefer-not-to-say': 'Prefer not to say',
                    };

                    const isSelected = editForm.gender === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, gender: option })}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-4 py-2 text-sm font-medium text-white' : 'rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-ink'}
                      >
                        {labels[option]}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 justify-center md:justify-start pt-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 rounded-full text-sm font-medium border text-ink">Cancel</button>
                  <button onClick={handleSaveProfile} className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-ink mb-1">{user.name}</h1>
                <p className="text-ink-muted mb-3">{user.email}</p>
                <p className="text-sm text-ink-muted mb-4">Sex / Gender: {user.gender ? GENDER_OPTIONS.find((option) => option.value === user.gender)?.label || user.gender : 'Not provided'}</p>
                <div>
                  <button 
                    onClick={startEditing}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
            <span className="text-ink-muted font-medium">Saved Remedies</span>
            <span className="text-2xl font-bold text-primary">{favorites.length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
            <span className="text-ink-muted font-medium">Appointments</span>
            <span className="text-2xl font-bold text-primary-dark">{appointments.length}</span>
          </div>
        </div>

        {/* Health Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h2 className="font-bold text-lg text-ink">Health Profile</h2>
          </div>
          <div className="space-y-5 p-5">
            <ProfileGroup title="Health Conditions" values={selectedConditions.map(formatValue)} emptyLabel="None selected" />
            <ProfileGroup title="Allergies & Sensitivities" values={selectedAllergies.map(formatValue)} emptyLabel="None selected" />
          </div>
        </div>

        {/* About Accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <button 
            className="w-full p-5 flex justify-between items-center text-left"
            onClick={() => setExpandedSection(expandedSection === 'about' ? null : 'about')}
          >
            <span className="font-bold text-lg text-ink">About ClotSolid</span>
            <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${expandedSection === 'about' ? 'rotate-180' : ''}`} />
          </button>
          {expandedSection === 'about' && (
            <div className="p-5 pt-0 text-sm text-ink-muted leading-relaxed border-t border-gray-50">
              <p className="mb-4">
                ClotSolid is a student-focused health platform designed to provide evidence-backed remedies for common ailments.
                Your profile, favorites, and appointments are synced through Supabase. Always consult a certified medical professional for serious health concerns.
              </p>
              <FAQAccordion items={FAQ_ITEMS.slice(0, 3)} />
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button 
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border-2 border-primary text-primary-dark font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </PageWrapper>
  );
}

function ProfileGroup({ title, values, emptyLabel }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{title}</h3>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="rounded-full bg-bg px-3 py-1.5 text-sm font-medium text-ink">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">{emptyLabel}</p>
      )}
    </div>
  );
}
