import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 hidden md:block border-b border-surface/50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <span className="text-xl font-bold text-ink">ClotSolid</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/search" className="text-ink-muted hover:text-ink text-sm font-medium transition-colors">Search</Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center text-sm font-semibold hover:bg-accent/30 transition-colors">
              {(user?.name?.[0] || 'U').toUpperCase()}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-ink-muted hover:text-ink text-sm font-medium transition-colors">Search</Link>
            <Link to="/login" className="text-ink-muted hover:text-ink text-sm font-medium transition-colors">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-glow">
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
