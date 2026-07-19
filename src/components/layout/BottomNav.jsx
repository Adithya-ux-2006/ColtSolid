import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

export function BottomNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navItems = [
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Saved', locked: !isAuthenticated },
    { to: '/profile', icon: User, label: 'Profile', locked: !isAuthenticated },
  ];

  const handleLockedClick = () => {
    navigate('/login');
  };

  return (
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-glass"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          if (item.locked) {
            return (
              <button
                key={item.to}
                type="button"
                onClick={handleLockedClick}
                className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 text-ink-muted hover:text-ink transition-colors duration-150"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 transition-colors duration-150',
                isActive ? 'text-primary' : 'text-ink-muted hover:text-ink'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
