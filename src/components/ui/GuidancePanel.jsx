import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const SEVERITY_MESSAGES = {
  mild: (name) => `Most cases of ${name} improve quickly with simple self-care.`,
  moderate: (name) => `Most cases of ${name} improve with self-care, but monitor your symptoms closely.`,
  severe: (name) => `This may require medical attention. Monitor your ${name} symptoms closely.`,
};

const UNIVERSAL_RED_FLAGS = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Loss of consciousness',
  'Sudden confusion',
  'Severe allergic reaction',
];

export function GuidancePanel({ severity, symptom, emergencyFlags, className }) {
  const severityFn = SEVERITY_MESSAGES[severity] || SEVERITY_MESSAGES.moderate;
  const symptomName = symptom?.label || 'this condition';
  const message = severityFn(symptomName);
  const flags = [...new Set([...(emergencyFlags || []), ...UNIVERSAL_RED_FLAGS])];

  return (
    <div className={cn('guidance-panel mt-4', className)} role="region" aria-label="Important guidance about your condition">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-ink text-sm mb-1">What this means</p>
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            {message}
          </p>
          {flags.length > 0 && (
            <>
              <p className="text-sm text-ink font-medium mb-1.5">
                Seek medical attention immediately if you experience:
              </p>
              <ul className="space-y-1">
                {flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="text-danger mt-1.5 text-xs" aria-hidden="true">&#9679;</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
