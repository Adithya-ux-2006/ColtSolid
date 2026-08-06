import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Heart, Bell, User, ShieldCheck } from 'lucide-react';
import { Dock, DockItem, DockLabel, DockIcon } from '../ui/Dock';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

export function AppDock() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenOn = ['/', '/onboarding', '/login', '/register'];
  if (hiddenOn.includes(location.pathname)) {
    return null;
  }

  const items = [
    isAuthenticated && { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Saved', locked: !isAuthenticated },
    { to: '/reminders', icon: Bell, label: 'Reminders', locked: !isAuthenticated },
    { to: '/profile', icon: User, label: 'Profile', locked: !isAuthenticated },
    user?.is_admin && { to: '/admin', icon: ShieldCheck, label: 'Admin' },
  ].filter(Boolean);

  const go = (item) => {
    navigate(item.locked ? '/login' : item.to);
  };

  return (
    <div className="hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <Dock>
        {items.map((item) => (
          <DockItem
            key={item.to}
            isActive={location.pathname === item.to}
            className="aspect-square"
          >
            <button
              type="button"
              onClick={() => go(item)}
              className="flex h-full w-full items-center justify-center"
              aria-label={item.label}
            >
              <DockLabel>{item.label}</DockLabel>
              <DockIcon>
                <item.icon
                  className={cn(
                    'h-full w-full',
                    location.pathname === item.to ? 'text-primary' : 'text-ink-muted'
                  )}
                  strokeWidth={1.75}
                />
              </DockIcon>
            </button>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
