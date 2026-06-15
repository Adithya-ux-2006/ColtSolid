import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';
import { GENDER_OPTIONS } from '../constants/onboarding';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    year: '',
    gender: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (!emailParam) {
      emailInputRef.current?.focus();
      return;
    }

    setFormData((prev) => ({ ...prev, email: emailParam }));
    nameInputRef.current?.focus();
  }, [emailParam]);

  const isFormValid = [formData.name, formData.email, formData.university, formData.year, formData.password]
    .every((value) => value.trim() !== '');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    setSuccessMessage('');
    const result = await register({
      name: formData.name,
      email: formData.email,
      university: formData.university,
      year: formData.year,
      gender: formData.gender,
      password: formData.password,
    });

    if (result.success) {
      if (result.needsEmailConfirmation) {
        setSuccessMessage('Account created. Check your email to confirm your account before logging in.');
        return;
      }

      navigate('/onboarding');
      return;
    }

    setErrorMessage(result.error?.message || 'Unable to create account.');
  };

  return (
    <PageWrapper className="min-h-screen bg-snow flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-12 h-12 bg-forest rounded-xl items-center justify-center shadow-forest mb-4">
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
              ref={nameInputRef}
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">University Email</label>
            <input
              id="email"
              name="email"
              type="email"
              ref={emailInputRef}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              required
            />
            {emailParam ? (
              <p className="mt-1 text-sm text-forest">✓ We'll keep your saved remedies linked to this account.</p>
            ) : null}
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all bg-white"
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
            <div className="mb-2">
              <p className="block text-sm font-medium text-ink">How do you identify?</p>
              <p className="mt-1 text-sm text-ink-muted">
                Helps us personalize remedy recommendations and filter contraindications.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((option) => {
                const isSelected = formData.gender === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gender: option.value }))}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                      isSelected
                        ? 'scale-105 border-forest bg-forest text-white'
                        : 'border-ink bg-white text-ink hover:border-forest hover:text-forest'
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full mt-2 py-3.5 bg-forest text-white rounded-xl font-bold shadow-forest hover:bg-forest-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
          </button>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-green-700">{successMessage}</p>
          ) : null}
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-ink">
            Already have an account?{' '}
            <Link to="/login" className="text-forest font-semibold hover:underline">
              Log In &rarr;
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
