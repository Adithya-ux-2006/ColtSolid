import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="bg-cream sticky top-0 z-40 hidden md:block">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-ink">ClotSolid</span>
          <span className="w-2 h-2 rounded-full bg-coral" />
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/search" className="text-ink-muted hover:text-ink text-sm font-medium">Search</Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-coral/10 text-coral flex items-center justify-center text-sm font-semibold">
              {(user?.name?.[0] || 'U').toUpperCase()}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-ink-muted hover:text-ink text-sm font-medium">Search</Link>
            <Link to="/login" className="text-ink-muted hover:text-ink text-sm font-medium">Log In</Link>
            <Link to="/register" className="px-4 py-2 rounded-xl bg-coral text-white text-sm font-medium hover:bg-coral-dark transition-colors">
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
