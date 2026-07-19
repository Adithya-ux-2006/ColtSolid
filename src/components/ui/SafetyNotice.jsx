import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyNotice({ message, title, className }) {
  if (!message) return null;

  return (
    <div role="alert" className={cn("rounded-3xl p-6 flex items-start gap-4 bg-warning/5 border border-warning/15", className)}>
      <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-ink mb-1">{title}</p>}
        <p className="text-sm text-ink-muted leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
