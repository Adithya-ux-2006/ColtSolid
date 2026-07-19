import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { SafetyLabel } from './SafetyLabel';
import { EvidenceLabel } from './EvidenceLabel';

function StatCard({ icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col items-center gap-1.5 text-center min-w-0"
    >
      <span className="text-ink-muted">{icon}</span>
      <span className="font-semibold text-ink text-sm leading-tight whitespace-nowrap">{value}</span>
      <span className="text-[11px] text-ink-muted leading-tight whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

export function QuickStats({ remedy, isSafe, evidenceScore, safetyScore, className }) {
  return (
    <div className={cn('grid grid-cols-4 gap-4', className)}>
      <StatCard
        icon={<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        value={remedy.timeToEffect || 'Varies'}
        label="Time to relief"
        delay={0}
      />
      <StatCard
        icon={<span className="text-lg">🛡</span>}
        value={<SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} />}
        label="Safety"
        delay={0.05}
      />
      <StatCard
        icon={<span className="text-lg">📈</span>}
        value={<EvidenceLabel score={evidenceScore} />}
        label="Evidence"
        delay={0.1}
      />
      <StatCard
        icon={<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
        value={remedy.difficulty || 'Easy'}
        label="Difficulty"
        delay={0.15}
      />
    </div>
  );
}
