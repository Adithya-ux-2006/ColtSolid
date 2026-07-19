import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TimelineStep({ number, title, description, isLast = false, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={cn(
        'flex flex-col md:flex-row md:items-start gap-3 md:gap-4',
        className
      )}
    >
      <div className="flex md:flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{number}</span>
        </div>
        {!isLast && (
          <>
            <div className="hidden md:block w-full h-px bg-border-subtle mt-2" />
            <div className="md:hidden w-px h-4 bg-border-subtle mx-auto" />
          </>
        )}
      </div>
      <div className={cn('pb-4', isLast && 'pb-0', 'md:flex-1')}>
        {title && <p className="font-semibold text-ink text-sm mb-0.5">{title}</p>}
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      {!isLast && (
        <ChevronRight className="hidden md:block w-4 h-4 text-ink-subtle shrink-0 mt-2.5" />
      )}
    </motion.div>
  );
}
