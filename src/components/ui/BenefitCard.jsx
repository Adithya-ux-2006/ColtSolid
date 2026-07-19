import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BenefitCard({ title, description, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={cn(
        'flex items-start gap-3 py-4',
        className
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
        <Check className="w-4 h-4 text-success" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-ink text-sm mb-0.5">{title}</p>
        {description && (
          <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
