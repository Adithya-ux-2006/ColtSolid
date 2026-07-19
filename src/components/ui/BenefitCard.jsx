import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BenefitCard({ title, description, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={cn(
        'flex items-start gap-3 py-1',
        className
      )}
    >
      <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
        <Check className="w-3.5 h-3.5 text-success" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-ink text-sm mb-0.5 leading-snug">{title}</p>
        {description && (
          <p className="text-[13px] text-ink-muted leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
