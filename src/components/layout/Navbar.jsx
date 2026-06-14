import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Don't show navbar on landing page
  if (location.pathname === '/') return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 hidden md:block">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-white font-bold">
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
            <Link to="/profile" className="w-9 h-9 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold">
              {user?.avatar || 'U'}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-ink font-medium">Log In</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-coral text-white font-medium hover:bg-coral-dark transition-colors">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
