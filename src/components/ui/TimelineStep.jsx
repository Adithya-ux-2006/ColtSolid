import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TimelineStep({ number, description, isLast = false, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'group flex flex-col md:flex-row md:items-center gap-3 md:gap-5',
        'md:hover:bg-surface/30 md:rounded-2xl md:-mx-3 md:px-3 md:py-2',
        'md:transition-all md:duration-200',
        className
      )}
    >
      <div className="flex md:flex-col items-center shrink-0 gap-3 md:gap-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border border-primary/20 shadow-[0_0_16px_hsl(var(--primary)/0.2)]">
          <span className="text-base font-bold text-primary-foreground">{number}</span>
        </div>
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
        <ArrowRight className="hidden md:block w-4 h-4 text-ink-subtle shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </motion.div>
  );
}
