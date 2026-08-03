import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AdvisoryCard({ title, message, className }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      role="alert"
      className={cn(
        'rounded-r-2xl rounded-l-none border border-warning/30 border-l-4 border-l-warning p-5 flex items-start gap-4',
        'bg-warning/[0.08]',
        className
      )}
    >
      <div className="w-11 h-11 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-ink text-sm mb-1">{title}</p>}
        {message && (
          <p className="text-sm text-ink-muted leading-relaxed">{message}</p>
        )}
      </div>
    </motion.div>
  );
}
