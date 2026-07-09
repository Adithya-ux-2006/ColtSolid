import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200">
      {isAuthenticated ? (
        <div className="h-full px-4 md:px-6 grid grid-cols-[1fr_auto_1fr] items-center">
          <div />
          <Link to="/dashboard" className="flex items-center gap-2 justify-self-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-base font-bold shadow-glow">
              C
            </div>
            <span className="text-xl font-bold text-ink tracking-tight">curA</span>
          </Link>
          <div className="flex items-center justify-self-end">
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center text-sm font-semibold hover:bg-accent/30 transition-colors"
            >
              {(user?.name?.[0] || 'U').toUpperCase()}
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-full max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-glow">
              C
            </div>
            <span className="font-bold text-xl text-ink">curA</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search" className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm font-medium transition-colors">
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link to="/login" className="rounded-full border border-ink/10 px-4 py-2 text-ink text-sm font-medium hover:bg-surface/50 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-glow">
              Sign Up Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
