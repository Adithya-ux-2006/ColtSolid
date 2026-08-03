import { Stethoscope, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Checklist } from './Checklist';
import { Reveal } from './Reveal';

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
    <Reveal className={cn("bg-card border border-danger/30 border-l-4 border-l-danger rounded-r-3xl rounded-l-none p-5 md:p-8", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-danger" />
        </div>
        <div>
          <p className="font-semibold text-ink">When to see a doctor</p>
          {message && (
            <p className="text-xs text-ink-muted">{message}</p>
          )}
        </div>
      </div>

      {!message && (
        <p className="text-sm text-ink-muted mb-5">
          Seek medical attention if you experience any of the following:
        </p>
      )}

      <Checklist items={items} delay={0.1} tone="danger" className="mb-6 space-y-3" />

      <button
        onClick={onCtaClick}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-ink text-card font-medium text-sm transition-colors duration-200 hover:bg-ink/90 active:scale-[0.98]"
      >
        <MapPin className="w-4 h-4" />
        {ctaLabel || 'Find Nearby Medical Centres'}
      </button>
    </Reveal>
  );
}
