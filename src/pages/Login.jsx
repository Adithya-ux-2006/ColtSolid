import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    const result = await login({ email, password });

    if (result.success) {
      navigate('/dashboard');
      return;
    }

    setErrorMessage(result.error?.message || 'Unable to sign in.');
  };

  return (
    <PageWrapper className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-12 h-12 bg-primary rounded-xl items-center justify-center shadow-glow mb-4">
            <span className="text-2xl font-bold text-white">C</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-ink-muted mt-2">Log in to your ClotSolid account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="you@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-glow hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-ink">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register &rarr;
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
