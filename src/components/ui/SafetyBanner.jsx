import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyBanner({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative rounded-[20px] p-6 md:p-8',
        'bg-gradient-to-br from-success/[0.08] to-success/[0.03]',
        'border border-success/15',
        'shadow-[0_0_24px_hsl(var(--success)/0.06)]',
        'hover:shadow-[0_4px_32px_hsl(var(--success)/0.1)]',
        'transition-all duration-200',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink text-xl mb-1">Safe for you</p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            Based on your health profile, no known interactions were found.
          </p>
        </div>
        <button className="sm:self-center flex items-center gap-1 text-sm font-semibold text-success hover:text-success/80 transition-colors duration-200 min-h-[44px] shrink-0">
          Learn More
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
