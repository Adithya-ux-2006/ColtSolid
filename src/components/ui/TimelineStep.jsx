import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TimelineStep({ number, description, isLast = false, delay = 0, arrowDelay, className }) {
  const reduced = useReducedMotion();
  const baseTransition = { duration: 0.35, ease: 'easeOut' };

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...baseTransition, delay }}
      className={cn(
        'group flex flex-col md:flex-row md:items-center gap-3 md:gap-5',
        'md:hover:bg-surface/30 md:rounded-2xl md:-mx-3 md:px-3 md:py-2',
        'md:transition-all md:duration-200',
        className
      )}
    >
      <div className="flex md:flex-col items-center shrink-0 gap-3 md:gap-0">
        <motion.div
          whileHover={reduced ? {} : { scale: 1.05 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border border-primary/20 shadow-[0_0_16px_hsl(var(--primary)/0.2)] transition-shadow duration-200 group-hover:shadow-[0_0_24px_hsl(var(--primary)/0.3)]"
        >
          <span className="text-base font-bold text-primary-foreground">{number}</span>
        </motion.div>
        {!isLast && (
          <>
            <div className="hidden md:block w-full h-px bg-border-subtle mt-3" />
            <div className="md:hidden w-px h-3 bg-border-subtle" />
          </>
        )}
      </div>
      <div className={cn('pb-5 md:pb-0', isLast && 'pb-0', 'md:flex-1')}>
        <p className="text-[15px] text-ink leading-relaxed">{description}</p>
      </div>
      {!isLast && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          whileInView={reduced ? { opacity: 1 } : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.25, delay: arrowDelay ?? delay + 0.1, ease: 'easeOut' }}
        >
          <ArrowRight className="hidden md:block w-4 h-4 text-ink-subtle shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
        </motion.div>
      )}
    </motion.div>
  );
}
