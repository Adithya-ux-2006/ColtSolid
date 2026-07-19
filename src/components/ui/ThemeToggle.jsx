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
  const activeIndex = OPTIONS.findIndex(o => o.value === theme);

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full bg-surface border border-border p-1',
        className
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      <div
        className="absolute top-1 bottom-1 w-11 rounded-full bg-primary shadow-sm transition-all duration-200 ease-in-out"
        style={{
          left: `calc(4px + ${activeIndex} * 46px)`,
        }}
      />
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            'relative z-10 flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200',
            theme === value
              ? 'text-primary-foreground'
              : 'text-ink-muted hover:text-ink'
          )}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
