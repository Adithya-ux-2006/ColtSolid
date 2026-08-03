import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

function getSafetyLevel(score, hasConflicts) {
  if (hasConflicts) return { text: 'Not Recommended', color: 'bg-danger/10 text-danger', Icon: ShieldAlert };
  if (score >= 85) return { text: 'Generally Well Tolerated', color: 'bg-success/10 text-success', Icon: ShieldCheck };
  if (score >= 60) return { text: 'Usually Safe', color: 'bg-success/10 text-success', Icon: ShieldCheck };
  if (score >= 30) return { text: 'Check With a Professional', color: 'bg-warning/10 text-warning', Icon: AlertTriangle };
  return { text: 'Not Recommended', color: 'bg-danger/10 text-danger', Icon: ShieldAlert };
}

export function SafetyLabel({ safetyScore, hasConflicts, compact, className }) {
  const level = getSafetyLevel(safetyScore, hasConflicts);
  const { text, color, Icon } = level;

  if (compact) {
    return (
      <span
        className={cn('inline-flex items-center gap-1 text-[10px] font-medium whitespace-nowrap', color, className)}
        aria-label={`Safety: ${text}`}
      >
        <Icon className="w-3 h-3 shrink-0" />
        {text}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap justify-center', color, className)}
      aria-label={`Safety: ${text}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {text}
    </span>
  );
}
