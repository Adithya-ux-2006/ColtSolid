import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

export function BottomNav() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || location.pathname === '/' || location.pathname === '/onboarding') return null;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/appointments', icon: Calendar, label: 'Appts' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-forest" : "text-ink-muted hover:text-ink"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
