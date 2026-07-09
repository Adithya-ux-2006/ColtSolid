import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:px-6 hidden">
      <div />
      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className="flex items-center gap-2 justify-self-center"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-base font-bold shadow-glow">
          C
        </div>
        <span className="text-xl font-bold text-ink tracking-tight">curA</span>
      </Link>
      <div className="flex items-center justify-self-end">
        {isAuthenticated && (
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center text-sm font-semibold hover:bg-accent/30 transition-colors"
          >
            {(user?.name?.[0] || 'U').toUpperCase()}
          </Link>
        )}
      </div>
    </nav>
  );
}
