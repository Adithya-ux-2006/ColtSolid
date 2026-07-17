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
        'rounded-3xl p-6 border border-warning/20 bg-warning/5',
        className
      )}
      role="alert"
      aria-label="When to seek medical care"
    >
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-ink mb-2">When to seek medical care</h3>
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            Seek immediate medical attention if you experience:
          </p>
          <ul className="space-y-1.5">
            {flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="text-warning mt-1.5 text-xs" aria-hidden="true">&#9679;</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
