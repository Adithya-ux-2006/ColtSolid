import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SafetyBanner({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-3xl p-6 flex items-start gap-4',
        'bg-success/5 border border-success/15',
        className
      )}
    >
      <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5 text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink mb-1">Safe for you</p>
        <p className="text-sm text-ink-muted leading-relaxed">
          Based on your health profile, no known interactions were found.
        </p>
        <button className="text-sm font-medium text-primary mt-2 hover:underline">
          Learn More →
        </button>
      </div>
    </motion.div>
  );
}
