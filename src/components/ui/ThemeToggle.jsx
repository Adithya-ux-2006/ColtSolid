import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import { cn } from '../../utils/cn';

export function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const label = nextTheme === 'dark' ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'flex items-center justify-center w-11 h-11 rounded-full bg-surface border border-border text-ink-muted hover:text-ink hover:bg-accent transition-colors',
        className
      )}
    >
      {isDark ? (
        <Sun className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5" strokeWidth={2} />
      )}
    </button>
  );
}
