import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    year: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setTimeout(() => {
      register({
        name: formData.name,
        email: formData.email,
        university: formData.university,
        year: formData.year
      });
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <PageWrapper className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-12 h-12 bg-coral rounded-xl items-center justify-center shadow-coral mb-4">
            <span className="text-2xl font-bold text-white">C</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink">Create an account</h1>
          <p className="text-ink-muted mt-2">Join ClotSolid for targeted relief</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">University Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1" htmlFor="university">University</label>
              <input
                id="university"
                name="university"
                type="text"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1" htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all bg-white"
                required
              >
                <option value="">Select</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full mt-2 py-3.5 bg-coral text-white rounded-xl font-bold shadow-coral hover:bg-coral-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-ink-muted mb-2">Demo: use any credentials</p>
          <p className="text-ink">
            Already have an account?{' '}
            <Link to="/login" className="text-coral font-semibold hover:underline">
              Log In &rarr;
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
