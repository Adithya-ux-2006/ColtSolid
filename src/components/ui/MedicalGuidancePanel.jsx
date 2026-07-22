import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SYMPTOM_EMERGENCY_FLAGS, UNIVERSAL_EMERGENCY_FLAGS } from '../../constants/emergency';

export function MedicalGuidancePanel({ symptomId, severity, className }) {
  const symptomFlags = SYMPTOM_EMERGENCY_FLAGS[symptomId] || [];
  const flags = [...new Set([...symptomFlags, ...UNIVERSAL_EMERGENCY_FLAGS])];

  if (severity === 'mild' && flags.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-danger/15 bg-danger-light overflow-hidden',
        className
      )}
      role="region"
      aria-label="When to seek medical care"
    >
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
        <span className="text-sm font-semibold text-ink">When to seek medical care</span>
      </div>

      <div className="px-5 pb-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {flags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
              <span className="text-danger mt-1.5 text-[8px]" aria-hidden="true">&#9679;</span>
              {flag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
