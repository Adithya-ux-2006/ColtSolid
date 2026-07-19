import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyNotice({ message, title, className }) {
  if (!message) return null;

  return (
    <div role="alert" className={cn("rounded-2xl p-5 flex items-start gap-4 bg-warning/[0.06]", className)}>
      <div className="w-11 h-11 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-ink mb-1 text-sm">{title}</p>}
        <p className="text-sm text-ink-muted leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
