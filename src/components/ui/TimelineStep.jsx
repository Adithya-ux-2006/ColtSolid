import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TimelineStep({ number, description, isLast = false, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={cn(
        'flex flex-col md:flex-row md:items-start gap-3 md:gap-5',
        className
      )}
    >
      <div className="flex md:flex-col items-center shrink-0 gap-3 md:gap-0">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{number}</span>
        </div>
        {!isLast && (
          <>
            <div className="hidden md:block w-full h-px bg-border-subtle mt-3" />
            <div className="md:hidden w-px h-3 bg-border-subtle" />
          </>
        )}
      </div>
      <div className={cn('pb-5', isLast && 'pb-0', 'md:flex-1 md:pt-1.5')}>
        <p className="text-[15px] text-ink leading-relaxed">{description}</p>
      </div>
      {!isLast && (
        <ArrowRight className="hidden md:block w-4 h-4 text-ink-subtle shrink-0 mt-3" />
      )}
    </motion.div>
  );
}
