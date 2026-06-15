import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 hidden md:block">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-xl text-ink">ClotSolid</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-ink-muted hover:text-ink font-medium">Dashboard</Link>
            <Link to="/search" className="text-ink-muted hover:text-ink font-medium">Search</Link>
            <Link to="/favorites" className="text-ink-muted hover:text-ink font-medium">Favorites</Link>
            <Link to="/appointments" className="text-ink-muted hover:text-ink font-medium">Appointments</Link>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
              {user?.avatar || 'U'}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-ink-muted hover:text-ink font-medium">Search Remedies</Link>
            <Link to="/login" className="rounded-full border border-gray-200 px-4 py-2 text-ink font-medium hover:bg-snow transition-colors">Log In</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-forest text-white font-medium hover:bg-forest-dark transition-colors">
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
