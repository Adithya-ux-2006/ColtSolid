import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

export function Register() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [formData, setFormData] = useState({
    name: '',
    email: emailParam || '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (!emailParam) {
      emailInputRef.current?.focus();
      return;
    }

    nameInputRef.current?.focus();
  }, [emailParam]);

  const isFormValid = [formData.name, formData.email, formData.password, formData.confirmPassword]
    .every((value) => value.trim() !== '') && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      if (result.needsEmailConfirmation) {
        setSuccessMessage('Account created. Check your email to confirm your account before logging in.');
        return;
      }

      navigate(result.hasCompletedOnboarding ? '/dashboard' : '/onboarding');
      return;
    }

    setErrorMessage(result.error?.message || 'Unable to create account.');
  };

  return (
    <PageWrapper className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-14 h-14 bg-primary rounded-2xl items-center justify-center shadow-glow mb-4">
            <span className="text-2xl font-bold text-white">C</span>
          </Link>
          <h1 className="text-3xl font-bold text-ink">Create an account</h1>
          <p className="text-ink-muted mt-2">Join ClotSolid for targeted relief</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-ink/5">
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
                className="w-full px-4 py-3 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">Personal Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                ref={emailInputRef}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@example.com"
                required
              />
              {emailParam ? (
                <p className="mt-1 text-sm text-primary">✓ We'll keep your saved remedies linked to this account.</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-ink/10 focus:border-primary'
                )}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full mt-2 py-3.5 bg-primary text-white rounded-xl font-bold shadow-glow hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log In &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
