import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

function getSafetyLevel(score, hasConflicts) {
  if (hasConflicts) return { text: 'Not Recommended', color: 'bg-danger/10 text-danger', Icon: ShieldAlert };
  if (score >= 85) return { text: 'Very Safe', color: 'bg-success/10 text-success', Icon: ShieldCheck };
  if (score >= 60) return { text: 'Generally Safe', color: 'bg-success/10 text-success', Icon: ShieldCheck };
  if (score >= 30) return { text: 'Use With Caution', color: 'bg-warning/10 text-warning', Icon: AlertTriangle };
  return { text: 'Not Recommended', color: 'bg-danger/10 text-danger', Icon: ShieldAlert };
}

export function SafetyLabel({ safetyScore, hasConflicts, compact, className }) {
  const level = getSafetyLevel(safetyScore, hasConflicts);
  const { text, color, Icon } = level;

  if (compact) {
    return (
      <span
        className={cn('inline-flex items-center gap-1 text-[10px] font-medium', color, className)}
        aria-label={`Safety: ${text}`}
      >
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold', color, className)}
      aria-label={`Safety: ${text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  );
}
