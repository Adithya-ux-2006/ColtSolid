import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { LockToast } from '../ui';

const LOCKED_MESSAGES = {
  '/dashboard': 'Sign in to see your personalized dashboard',
  '/favorites': 'Sign in to save and revisit your remedies',
  '/appointments': 'Sign in to track your appointments',
  '/profile': 'Sign in to manage your profile',
};

export function BottomNav() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timer = window.setTimeout(() => setToastMessage(''), 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  if (location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', locked: !isAuthenticated },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Favorites', locked: !isAuthenticated },
    { to: '/appointments', icon: Calendar, label: 'Appts', locked: !isAuthenticated },
    { to: '/profile', icon: User, label: 'Profile', locked: !isAuthenticated },
  ];

  return (
    <>
      <LockToast message={toastMessage} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage('')} />
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const baseClassName = cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
              location.pathname === item.to ? 'text-forest' : 'text-ink-muted hover:text-ink'
            );

            if (item.locked) {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => setToastMessage(LOCKED_MESSAGES[item.to])}
                  className={baseClassName}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return item.to === '/search' && !isAuthenticated ? (
              <Link key={item.to} to={item.to} className={baseClassName}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                  isActive ? 'text-forest' : 'text-ink-muted hover:text-ink'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
