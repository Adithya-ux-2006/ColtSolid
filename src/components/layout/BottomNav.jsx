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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-surface/50 pb-safe z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const baseClassName = cn(
            'flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors',
            location.pathname === item.to ? 'text-primary' : 'text-ink-muted hover:text-ink'
          );

          if (item.locked) {
            return (
              <button
                key={item.to}
                type="button"
                onClick={handleLockedClick}
                className={baseClassName}
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
                'flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors',
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
