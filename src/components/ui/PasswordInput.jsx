import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PasswordInput({ className, wrapperClassName, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn('relative', wrapperClassName)}>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn(className, 'pr-14')}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2',
          'flex items-center justify-center w-11 h-11 rounded-full',
          'text-ink-muted hover:text-ink active:text-ink',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
        )}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}
