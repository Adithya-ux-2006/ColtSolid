import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyNotice({ message, className }) {
  if (!message) return null;

  return (
    <div className={cn("safety-box flex gap-4", className)}>
      <AlertTriangle className="h-5 w-5 text-yellow-dark shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-ink mb-1">Safety Information</p>
        <p className="text-ink-muted">{message}</p>
      </div>
    </div>
  );
}
