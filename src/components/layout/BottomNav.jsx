import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Heart, Clock, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

export function BottomNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home', locked: !isAuthenticated },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Saved', locked: !isAuthenticated },
    { to: '/schedules', icon: Clock, label: 'History', locked: !isAuthenticated },
    { to: '/profile', icon: User, label: 'Profile', locked: !isAuthenticated },
  ];

  const handleLockedClick = () => {
    navigate('/login');
  };

  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-50',
        'border-t border-white/10 dark:border-white/5',
        'bg-card/80 backdrop-blur-xl',
        'transition-all duration-300 ease-in-out',
        scrolled ? 'bg-card/90 backdrop-blur-2xl' : 'bg-card/80 backdrop-blur-xl'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          if (item.locked) {
            return (
              <button
                key={item.to}
                type="button"
                onClick={handleLockedClick}
                className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 text-ink-muted transition-colors duration-200 hover:text-ink active:scale-95"
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5" />
                <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5 transition-colors duration-200',
                'active:scale-95',
                isActive ? 'text-primary' : 'text-ink-muted hover:text-ink'
              )}
            >
              <item.icon className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
