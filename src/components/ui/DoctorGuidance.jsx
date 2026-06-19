import { Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';

export function DoctorGuidance({ message, className }) {
  const defaultMessage = message || 'If symptoms persist for more than 48 hours, worsen significantly, or interfere with daily activities, consult a healthcare professional.';

  return (
    <div className={cn("guidance-box flex gap-4", className)}>
      <Stethoscope className="h-5 w-5 text-teal shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-ink mb-1">When To See A Doctor</p>
        <p className="text-ink-muted">{defaultMessage}</p>
      </div>
    </div>
  );
}
