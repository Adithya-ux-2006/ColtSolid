import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl bg-surface border border-border p-0.5 gap-0.5',
        className
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            'relative flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-all duration-200',
            theme === value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-ink-muted hover:text-ink hover:bg-accent'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
