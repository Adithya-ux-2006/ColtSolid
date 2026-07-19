import { motion } from 'framer-motion';
import { Clock, ShieldCheck, BarChart3, PenLine } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SafetyLabel } from './SafetyLabel';
import { EvidenceLabel } from './EvidenceLabel';

const STAT_ICONS = {
  time: { Icon: Clock, bg: 'bg-primary/10', color: 'text-primary' },
  safety: { Icon: ShieldCheck, bg: 'bg-success/10', color: 'text-success' },
  evidence: { Icon: BarChart3, bg: 'bg-primary/10', color: 'text-primary' },
  difficulty: { Icon: PenLine, bg: 'bg-primary/10', color: 'text-primary' },
};

function StatCell({ icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col items-center gap-2.5 text-center min-w-0 py-2"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', icon.bg)}>
        <icon.Icon className={cn('w-5 h-5', icon.color)} />
      </div>
      <div className="min-w-0">
        {typeof value === 'string' || typeof value === 'number' ? (
          <span className="font-semibold text-ink text-sm leading-tight block whitespace-nowrap overflow-hidden text-ellipsis">{value}</span>
        ) : (
          value
        )}
      </div>
      <span className="text-xs text-ink-muted leading-tight whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

export function QuickStats({ remedy, isSafe, evidenceScore, safetyScore, className }) {
  return (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-4 gap-0',
      className
    )}>
      <StatCell
        icon={STAT_ICONS.time}
        value={remedy.timeToEffect || 'Varies'}
        label="Time to relief"
        delay={0}
      />
      <div className="hidden md:block w-px self-stretch bg-border-subtle mx-auto my-3" />
      <div className="block md:hidden h-px self-stretch bg-border-subtle mx-3" />
      <StatCell
        icon={STAT_ICONS.safety}
        value={<SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} />}
        label="Safety"
        delay={0.05}
      />
      <div className="hidden md:block w-px self-stretch bg-border-subtle mx-auto my-3" />
      <div className="block md:hidden h-px self-stretch bg-border-subtle mx-3" />
      <StatCell
        icon={STAT_ICONS.evidence}
        value={<EvidenceLabel score={evidenceScore} />}
        label="Evidence"
        delay={0.1}
      />
      <div className="hidden md:block w-px self-stretch bg-border-subtle mx-auto my-3" />
      <div className="block md:hidden h-px self-stretch bg-border-subtle mx-3" />
      <StatCell
        icon={STAT_ICONS.difficulty}
        value={remedy.difficulty || 'Easy'}
        label="Difficulty"
        delay={0.15}
      />
    </div>
  );
}
