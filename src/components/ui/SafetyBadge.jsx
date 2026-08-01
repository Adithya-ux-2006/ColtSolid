import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getChildSafetyStatus } from '../../utils/guestProfile';

function getSafetyBadgeState(remedy, ageRange) {
  const childSafety = getChildSafetyStatus(remedy, ageRange);

  if (remedy?._allergyConflict || remedy?._childSafetyBlock || childSafety.isHardBlock) {
    return {
      label: 'Not Recommended',
      note: remedy?._allergyConflict
        ? `Allergy conflict: ${remedy._allergyConflict}`
        : remedy?._childSafetyNote || childSafety.note,
      Icon: ShieldAlert,
      className: 'border-danger/25 bg-danger/10 text-danger',
    };
  }

  if (remedy?._contraindicationConflict || remedy?._childSafetyConcern || childSafety.hasConcern) {
    return {
      label: 'Check Before Use',
      note: remedy?._contraindicationConflict
        ? `May conflict with: ${remedy._contraindicationConflict}`
        : remedy?._childSafetyNote || childSafety.note,
      Icon: AlertTriangle,
      className: 'border-warning/25 bg-warning/10 text-warning',
    };
  }

  return {
    label: 'Generally Safe for You',
    note: '',
    Icon: ShieldCheck,
    className: 'border-success/25 bg-success/10 text-success',
  };
}

export function SafetyBadge({ remedy, ageRange, compact = false, className }) {
  if (!remedy) return null;

  const state = getSafetyBadgeState(remedy, ageRange);
  const { Icon } = state;

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border font-semibold',
        compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        state.className,
        className
      )}
      title={state.note || state.label}
      aria-label={state.note ? `${state.label}: ${state.note}` : state.label}
    >
      <Icon className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      <span className="truncate">{state.label}</span>
    </span>
  );
}
