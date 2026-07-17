import { cn } from '../../utils/cn';

const SEVERITY_CONFIG = {
  mild: { label: 'Mild', dot: 'bg-success', text: 'text-success', bg: 'bg-success/10' },
  moderate: { label: 'Moderate', dot: 'bg-warning', text: 'text-warning', bg: 'bg-warning/10' },
  severe: { label: 'Severe', dot: 'bg-danger', text: 'text-danger', bg: 'bg-danger/10' },
};

export function SeverityBadge({ severity, className }) {
  const config = SEVERITY_CONFIG[severity];
  if (!config) return null;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', config.bg, config.text, className)}
      role="status"
      aria-label={`Severity: ${config.label}`}
    >
      <span className={cn('w-2 h-2 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}
