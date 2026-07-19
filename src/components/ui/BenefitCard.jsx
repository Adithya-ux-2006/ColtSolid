import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BenefitCard({ title, description, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'bg-card rounded-3xl p-5 border border-border shadow-soft',
        className
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center mb-3 shrink-0">
        <Check className="w-4 h-4 text-success" />
      </div>
      <p className="font-semibold text-ink text-sm mb-1">{title}</p>
      {description && (
        <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
