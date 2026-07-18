import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronDown, User, Shield, Pencil, X, Check } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useRemedyScheduleStore } from '../store/remedyScheduleStore';
import { useGuestProfileStore } from '../store/guestProfileStore';
import { getInitials } from '../utils/mappers';
import { ALLERGIES, CONDITIONS, FAQ_ITEMS, GENDER_OPTIONS } from '../constants/onboarding';

const ONBOARDING_LABELS = new Map(
  [...CONDITIONS, ...ALLERGIES].map((option) => [option.value, option.label])
);

function formatChip(value) {
  if (!value) return value;
  if (value.startsWith('other:')) return value.slice(6).trim();
  if (ONBOARDING_LABELS.has(value)) return ONBOARDING_LABELS.get(value);
  return value.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const favorites = useFavoritesStore((state) => state.favorites);
  const schedules = useRemedyScheduleStore((state) => state.schedules);
  const guestAllergies = useGuestProfileStore((state) => state.known_allergies);
  const guestConditions = useGuestProfileStore((state) => state.common_conditions);
  const updateGuestProfile = useGuestProfileStore((state) => state.updateProfile);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthForm, setHealthForm] = useState({
    selectedConditions: [],
    selectedAllergies: [],
    otherConditionText: '',
    otherAllergyText: '',
  });

  // Guest profile editing state
  const [guestEditForm, setGuestEditForm] = useState({
    selectedConditions: guestConditions,
    selectedAllergies: guestAllergies,
    otherConditionText: '',
    otherAllergyText: '',
  });
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    selectedConditions: user?.common_conditions ?? [],
    selectedAllergies: user?.known_allergies ?? [],
  });

  // Guest profile view: not authenticated
  if (!isAuthenticated) {
    const handleGuestSave = () => {
      const conditions = guestEditForm.selectedConditions.filter(v => v !== 'none');
      const allergies = guestEditForm.selectedAllergies.filter(v => v !== 'none');
      if (guestEditForm.otherConditionText.trim() && !conditions.includes(guestEditForm.otherConditionText.trim())) {
        conditions.push(guestEditForm.otherConditionText.trim());
      }
      if (guestEditForm.otherAllergyText.trim() && !allergies.includes(guestEditForm.otherAllergyText.trim())) {
        allergies.push(guestEditForm.otherAllergyText.trim());
      }
      updateGuestProfile({
        known_allergies: allergies,
        common_conditions: conditions,
      });
    };

    const formatValue = (value) => {
      if (!value) return value;
      if (value.startsWith('other:')) return value.slice(6).trim();
      if (ONBOARDING_LABELS.has(value)) return ONBOARDING_LABELS.get(value);
      return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    };

    return (
      <PageWrapper className="min-h-screen bg-bg pb-24 md:pb-8 pt-6">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          {/* Guest Profile Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center text-primary">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">Guest Profile</h1>
              <p className="text-ink-muted text-sm">Sign in to save favorites and get a personalized dashboard.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link
                to="/register"
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-glow hover:bg-primary-dark transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 border border-ink/10 text-ink rounded-xl font-medium text-sm hover:bg-surface transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Guest Health Profile */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-bold text-lg text-ink">Health Profile</h2>
              <p className="text-xs text-ink-muted mt-1">Edit your allergies and conditions to get safer remedy recommendations.</p>
            </div>
            <div className="space-y-5 p-5">
              {/* Allergies */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-ink">Allergies & Sensitivities</p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((option) => {
                    const isSelected = guestEditForm.selectedAllergies.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          const next = option.value === 'none'
                            ? (isSelected ? [] : ['none'])
                            : isSelected
                              ? guestEditForm.selectedAllergies.filter(v => v !== option.value && v !== 'none')
                              : [...guestEditForm.selectedAllergies.filter(v => v !== 'none'), option.value];
                          setGuestEditForm({ ...guestEditForm, selectedAllergies: next });
                        }}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-3 py-1.5 text-sm font-medium text-white' : 'rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink'}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {guestEditForm.selectedAllergies.includes('other') && (
                  <input
                    type="text"
                    value={guestEditForm.otherAllergyText}
                    onChange={(e) => setGuestEditForm({ ...guestEditForm, otherAllergyText: e.target.value })}
                    placeholder="Please specify your allergy..."
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm mt-2"
                  />
                )}
              </div>
              {/* Conditions */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-ink">Health Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((option) => {
                    const isSelected = guestEditForm.selectedConditions.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          const next = option.value === 'none'
                            ? (isSelected ? [] : ['none'])
                            : isSelected
                              ? guestEditForm.selectedConditions.filter(v => v !== option.value && v !== 'none')
                              : [...guestEditForm.selectedConditions.filter(v => v !== 'none'), option.value];
                          setGuestEditForm({ ...guestEditForm, selectedConditions: next });
                        }}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-3 py-1.5 text-sm font-medium text-white' : 'rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink'}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {guestEditForm.selectedConditions.includes('other') && (
                  <input
                    type="text"
                    value={guestEditForm.otherConditionText}
                    onChange={(e) => setGuestEditForm({ ...guestEditForm, otherConditionText: e.target.value })}
                    placeholder="Please specify your condition..."
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm mt-2"
                  />
                )}
              </div>
              <button onClick={handleGuestSave} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm w-full">
                Save
              </button>

              {/* Summary */}
              {(guestEditForm.selectedAllergies.length > 0 || guestEditForm.selectedConditions.length > 0) && (
                <div className="pt-3 border-t border-border space-y-3">
                  <ProfileGroup title="Allergies" values={guestEditForm.selectedAllergies.map(formatValue)} emptyLabel="None selected" />
                  <ProfileGroup title="Conditions" values={guestEditForm.selectedConditions.map(formatValue)} emptyLabel="None selected" />
                </div>
              )}
            </div>
          </div>

          {/* About Accordion */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <button
              aria-expanded={expandedSection === 'about'}
              className="w-full p-5 flex justify-between items-center text-left"
              onClick={() => setExpandedSection(expandedSection === 'about' ? null : 'about')}
            >
              <span className="font-bold text-lg text-ink">About curA</span>
              <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${expandedSection === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {expandedSection === 'about' && (
              <div className="p-5 pt-0 text-sm text-ink-muted leading-relaxed border-t border-border">
                <p className="mb-4">
                  curA is a health platform designed to provide evidence-backed remedies for common ailments.
                  Always consult a certified medical professional for serious health concerns.
                </p>
                <FAQAccordion items={FAQ_ITEMS.slice(0, 3)} />
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Authenticated user profile

  const selectedConditions = user.common_conditions ?? [];
  const selectedAllergies = user.known_allergies ?? [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveHealth = () => {
    const conditions = healthForm.selectedConditions.filter(v => v !== 'none');
    const allergies = healthForm.selectedAllergies.filter(v => v !== 'none');
    if (healthForm.otherConditionText.trim() && !conditions.includes(healthForm.otherConditionText.trim())) {
      conditions.push(healthForm.otherConditionText.trim());
    }
    if (healthForm.otherAllergyText.trim() && !allergies.includes(healthForm.otherAllergyText.trim())) {
      allergies.push(healthForm.otherAllergyText.trim());
    }
    updateUser({
      known_allergies: allergies,
      common_conditions: conditions,
    });
    setIsEditingHealth(false);
  };

  const startEditingHealth = () => {
    const existingConditions = user?.common_conditions ?? [];
    const existingAllergies = user?.known_allergies ?? [];
    const otherConditionEntry = existingConditions.find(v => !CONDITIONS.some(c => c.value === v));
    const otherAllergyEntry = existingAllergies.find(v => !ALLERGIES.some(a => a.value === v));
    setHealthForm({
      selectedConditions: existingConditions.filter(v => CONDITIONS.some(c => c.value === v)),
      selectedAllergies: existingAllergies.filter(v => ALLERGIES.some(a => a.value === v)),
      otherConditionText: otherConditionEntry || '',
      otherAllergyText: otherAllergyEntry || '',
    });
    setIsEditingHealth(true);
  };

  const handleSaveProfile = () => {
    updateUser({
      name: editForm.name,
      gender: editForm.gender,
      avatar: getInitials(editForm.name),
      known_allergies: editForm.selectedAllergies.filter(v => v !== 'none'),
      common_conditions: editForm.selectedConditions.filter(v => v !== 'none'),
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditForm({
      name: user?.name || '',
      gender: user?.gender || '',
      selectedConditions: user?.common_conditions ?? [],
      selectedAllergies: user?.known_allergies ?? [],
    });
    setIsEditing(true);
  };

  const toggleHealthChip = (value, type) => {
    const field = type === 'conditions' ? 'selectedConditions' : 'selectedAllergies';
    const current = healthForm[field];
    const next = value === 'none'
      ? (current.includes('none') ? [] : ['none'])
      : current.includes(value)
        ? current.filter(v => v !== value && v !== 'none')
        : [...current.filter(v => v !== 'none'), value];
    setHealthForm({ ...healthForm, [field]: next });
  };

  return (
    <PageWrapper className="min-h-screen bg-bg pb-24 md:pb-8 pt-6">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
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
                        aria-pressed={isSelected}
                        onClick={() => setEditForm({ ...editForm, gender: option })}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-4 py-2 text-sm font-medium text-white' : 'rounded-full border border-border px-4 py-2 text-sm font-medium text-ink'}
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

        {/* Health Profile — Prominent Editable Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg text-ink">Health Profile</h2>
            </div>
            {isEditingHealth ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditingHealth(false)} className="p-2 rounded-lg hover:bg-surface transition-colors text-ink-muted">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSaveHealth} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            ) : (
              <button onClick={startEditingHealth} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>
          <div className="p-5 space-y-5">
            {/* Conditions */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Health Conditions</p>
              {isEditingHealth ? (
                <>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((option) => {
                    const isSelected = healthForm.selectedConditions.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleHealthChip(option.value, 'conditions')}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-3 py-1.5 text-sm font-medium text-white' : 'rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink'}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {healthForm.selectedConditions.includes('other') && (
                  <input
                    type="text"
                    value={healthForm.otherConditionText}
                    onChange={(e) => setHealthForm({ ...healthForm, otherConditionText: e.target.value })}
                    placeholder="Please specify your condition..."
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm mt-2"
                  />
                )}
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedConditions.length > 0 ? selectedConditions.map((value) => (
                    <span key={value} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                      {formatChip(value)}
                    </span>
                  )) : (
                    <p className="text-sm text-ink-muted">No conditions selected</p>
                  )}
                </div>
              )}
            </div>
            {/* Allergies */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Allergies & Sensitivities</p>
              {isEditingHealth ? (
                <>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((option) => {
                    const isSelected = healthForm.selectedAllergies.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleHealthChip(option.value, 'allergies')}
                        className={isSelected ? 'rounded-full border border-forest bg-primary px-3 py-1.5 text-sm font-medium text-white' : 'rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink'}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {healthForm.selectedAllergies.includes('other') && (
                  <input
                    type="text"
                    value={healthForm.otherAllergyText}
                    onChange={(e) => setHealthForm({ ...healthForm, otherAllergyText: e.target.value })}
                    placeholder="Please specify your allergy..."
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm mt-2"
                  />
                )}
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedAllergies.length > 0 ? selectedAllergies.map((value) => (
                    <span key={value} className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-medium text-amber-800">
                      {formatChip(value)}
                    </span>
                  )) : (
                    <p className="text-sm text-ink-muted">No allergies selected</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col items-center justify-between">
            <span className="text-ink-muted font-medium text-sm">Saved</span>
            <span className="text-2xl font-bold text-primary">{favorites.length}</span>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col items-center justify-between">
            <span className="text-ink-muted font-medium text-sm">Schedules</span>
            <span className="text-2xl font-bold text-primary-dark">{schedules.length}</span>
          </div>
        </div>

        {/* About Accordion */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <button
            aria-expanded={expandedSection === 'about'}
            className="w-full p-5 flex justify-between items-center text-left"
            onClick={() => setExpandedSection(expandedSection === 'about' ? null : 'about')}
          >
            <span className="font-bold text-lg text-ink">About curA</span>
            <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${expandedSection === 'about' ? 'rotate-180' : ''}`} />
          </button>
          {expandedSection === 'about' && (
            <div className="p-5 pt-0 text-sm text-ink-muted leading-relaxed border-t border-border">
              <p className="mb-4">
                curA is a health platform designed to provide evidence-backed remedies for common ailments.
                Your profile, favorites, and remedy schedules are synced through Supabase. Always consult a certified medical professional for serious health concerns.
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
