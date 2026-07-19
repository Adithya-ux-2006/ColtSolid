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
        'rounded-2xl p-5 flex items-center gap-4',
        'bg-success/[0.06]',
        className
      )}
    >
      <div className="w-11 h-11 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5 text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink text-sm mb-0.5">Safe for you</p>
        <p className="text-sm text-ink-muted">
          Based on your health profile, no known interactions were found.
        </p>
      </div>
      <button className="flex items-center gap-0.5 text-sm font-medium text-primary shrink-0 hover:opacity-80 transition-opacity">
        Learn More
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
