import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyNotice({ message, title, className }) {
  if (!message) return null;

  return (
    <div className={cn("safety-box bg-yellow-50 border border-yellow-100 flex gap-4", className)}>
      <ShieldAlert className="h-5 w-5 text-yellow-700 shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-semibold text-yellow-800 mb-1">{title}</p>}
        <p className="text-yellow-700">{message}</p>
      </div>
    </div>
  );
}
