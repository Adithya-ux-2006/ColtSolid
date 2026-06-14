import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Check, GraduationCap, Leaf, ShieldAlert } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAppointmentStore } from '../store/appointmentStore';

export function Profile() {
  const { user, logout, updateUser } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { appointments } = useAppointmentStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    university: user?.university || '',
    year: user?.year || ''
  });
  
  // Health preferences (mock state for UI)
  const [prefs, setPrefs] = useState({
    natural: true,
    vegetarian: false,
    avoidMeds: false
  });

  const [expandedSection, setExpandedSection] = useState(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser({
      ...editForm,
      avatar: editForm.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
    });
    setIsEditing(false);
  };

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-8 pt-6">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-2xl bg-coral flex items-center justify-center text-3xl font-bold text-white shadow-coral shrink-0">
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
                <input 
                  type="text" 
                  value={editForm.university} 
                  onChange={e => setEditForm({...editForm, university: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="University"
                />
                <select 
                  value={editForm.year} 
                  onChange={e => setEditForm({...editForm, year: e.target.value})}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <div className="flex gap-2 justify-center md:justify-start pt-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 rounded-full text-sm font-medium border text-ink">Cancel</button>
                  <button onClick={handleSaveProfile} className="px-4 py-1.5 rounded-full text-sm font-medium bg-coral text-white">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-ink mb-1">{user.name}</h1>
                <p className="text-ink-muted mb-3">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-ink bg-gray-50 inline-flex px-3 py-1.5 rounded-lg mb-4">
                  <GraduationCap className="w-4 h-4 text-coral" />
                  <span>{user.university} • {user.year}</span>
                </div>
                <div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-coral hover:underline"
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
            <span className="text-2xl font-bold text-coral">{favorites.length}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
            <span className="text-ink-muted font-medium">Appointments</span>
            <span className="text-2xl font-bold text-teal-dark">{appointments.length}</span>
          </div>
        </div>

        {/* Health Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h2 className="font-bold text-lg text-ink">Health Preferences</h2>
            <p className="text-sm text-ink-muted">Personalize your ClotSolid experience.</p>
          </div>
          <div className="p-2">
            <ToggleOption 
              icon={Leaf} 
              label="Prefer Natural Remedies" 
              checked={prefs.natural} 
              onChange={() => setPrefs(p => ({...p, natural: !p.natural}))} 
            />
            <ToggleOption 
              icon={ShieldAlert} 
              label="Avoid Heavy Medication" 
              checked={prefs.avoidMeds} 
              onChange={() => setPrefs(p => ({...p, avoidMeds: !p.avoidMeds}))} 
            />
            <ToggleOption 
              icon={Check} 
              label="Vegetarian Friendly Only" 
              checked={prefs.vegetarian} 
              onChange={() => setPrefs(p => ({...p, vegetarian: !p.vegetarian}))} 
            />
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
              ClotSolid is a student-focused health platform designed to provide evidence-backed remedies for common ailments. 
              Built as a demo application, it relies on local storage for persistence and contains mock data. 
              Always consult a certified medical professional for serious health concerns.
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button 
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border-2 border-teal text-teal-dark font-bold flex items-center justify-center gap-2 hover:bg-teal/5 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </PageWrapper>
  );
}

function ToggleOption({ icon: Icon, label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-ink-muted">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-ink">{label}</span>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-coral' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </label>
  );
}
