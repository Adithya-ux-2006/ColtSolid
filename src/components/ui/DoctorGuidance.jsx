import { Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';

export function DoctorGuidance({ message, className }) {
  const defaultMessage = message || 'If symptoms persist for more than 48 hours, worsen significantly, or interfere with daily activities, consult a healthcare professional.';

  return (
    <div className={cn("bg-surface rounded-3xl p-6 flex gap-4 shadow-soft", className)}>
      <Stethoscope className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-ink mb-1">When To See A Doctor</p>
        <p className="text-ink-muted text-sm leading-relaxed">{defaultMessage}</p>
      </div>
    </div>
  );
}
