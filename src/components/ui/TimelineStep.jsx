import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function TimelineStep({ number, title, description, isLast = false, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn('flex gap-4', className)}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{number}</span>
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border my-2" />
        )}
      </div>
      <div className={cn('pb-6', isLast && 'pb-0')}>
        {title && <p className="font-semibold text-ink text-sm mb-0.5">{title}</p>}
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
