import { motion } from 'framer-motion';
import { Clock, ShieldCheck, BarChart3, Gauge } from 'lucide-react';
import { cn } from '../../utils/cn';

function getSafetyText(score, hasConflicts) {
  if (hasConflicts) return 'Not Safe';
  if (score >= 85) return 'Very Safe';
  if (score >= 60) return 'Safe';
  if (score >= 30) return 'Caution';
  return 'Not Safe';
}

function getSafetyColor(score, hasConflicts) {
  if (hasConflicts) return 'text-danger';
  if (score >= 60) return 'text-success';
  if (score >= 30) return 'text-warning';
  return 'text-danger';
}

function getEvidenceText(score) {
  if (score >= 7) return 'High';
  if (score >= 4) return 'Moderate';
  if (score > 0) return 'Limited';
  return '—';
}

function StatColumn({ icon: Icon, iconBg, iconColor, value, label, ariaLabel, delay, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 text-center min-w-0',
        'py-3 px-1 sm:py-4 sm:px-2 md:py-5 md:px-3',
        !isLast && 'border-r border-border-subtle'
      )}
    >
      <div className={cn(
        'rounded-full flex items-center justify-center shrink-0',
        'w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11',
        iconBg
      )}>
        <Icon className={cn(
          'w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5',
          iconColor
        )} />
      </div>
      <span className={cn(
        'font-semibold text-ink leading-tight truncate w-full',
        'text-[13px] sm:text-sm md:text-[17px]'
      )}>
        {value}
      </span>
      <span className={cn(
        'text-ink-muted leading-tight truncate w-full',
        'text-[10px] sm:text-[11px] md:text-xs'
      )}>
        {label}
      </span>
    </motion.div>
  );
}

export function QuickStats({ remedy, isSafe, evidenceScore, safetyScore, className }) {
  const safetyText = getSafetyText(safetyScore, !isSafe);
  const safetyColor = getSafetyColor(safetyScore, !isSafe);
  const evidenceText = getEvidenceText(evidenceScore);

  return (
    <div
      className={cn('grid grid-cols-4', className)}
      role="region"
      aria-label="Quick remedy statistics"
    >
      <StatColumn
        icon={Clock}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        value={remedy.timeToEffect || 'Varies'}
        label="Time to relief"
        ariaLabel={`Time to relief: ${remedy.timeToEffect || 'Varies'}`}
        delay={0}
        isLast={false}
      />
      <StatColumn
        icon={ShieldCheck}
        iconBg="bg-success/10"
        iconColor={safetyColor}
        value={safetyText}
        label="Safety"
        ariaLabel={`Safety: ${safetyText}`}
        delay={0.04}
        isLast={false}
      />
      <StatColumn
        icon={BarChart3}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        value={evidenceText}
        label="Evidence"
        ariaLabel={`Evidence: ${evidenceText}`}
        delay={0.08}
        isLast={false}
      />
      <StatColumn
        icon={Gauge}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        value={remedy.difficulty || 'Easy'}
        label="Difficulty"
        ariaLabel={`Difficulty: ${remedy.difficulty || 'Easy'}`}
        delay={0.12}
        isLast={true}
      />
    </div>
  );
}
