import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useQuickScheduleStore } from '../../store/quickScheduleStore';
import { cn } from '../../utils/cn';

export function ScheduleQuickAdd({ remedy, className }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openQuickSchedule = useQuickScheduleStore((s) => s.openQuickSchedule);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/register'); return; }
    openQuickSchedule(remedy);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "p-1.5 rounded-full transition-colors text-ink-muted hover:text-primary",
        className
      )}
      aria-label="Quick add to schedule"
    >
      <Clock className="w-4 h-4" />
    </button>
  );
}
