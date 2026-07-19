import { Stethoscope, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Checklist } from './Checklist';

const DEFAULT_FLAGS = [
  'Symptoms last over 48 hours',
  'Symptoms worsen',
  'Difficulty breathing',
  'High fever',
  "Symptoms aren't improving",
];

export function DoctorGuidance({ message, flags, ctaLabel, onCtaClick, className }) {
  const items = flags || DEFAULT_FLAGS;

  return (
    <div className={cn("bg-card rounded-3xl p-6 shadow-card border border-border", className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-ink">When To See A Doctor</p>
          {message && (
            <p className="text-xs text-ink-muted">{message}</p>
          )}
        </div>
      </div>

      {!message && (
        <p className="text-sm text-ink-muted mb-4">
          Seek medical attention if you experience any of the following:
        </p>
      )}

      <Checklist items={items} delay={0.1} className="mb-5" />

      <button
        onClick={onCtaClick}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl border border-border text-ink font-medium text-sm hover:bg-surface transition-colors"
      >
        <MapPin className="w-4 h-4" />
        {ctaLabel || 'Find Nearby Medical Centres'}
      </button>
    </div>
  );
}
