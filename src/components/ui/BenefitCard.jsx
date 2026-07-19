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
        'flex flex-col items-start gap-3.5 py-2',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-success/[0.08] border border-success/15 flex items-center justify-center shrink-0 shadow-[0_0_12px_hsl(var(--success)/0.06)]">
        <Check className="w-5 h-5 text-success" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-ink text-lg leading-snug mb-1 line-clamp-2">{title}</p>
        {description && (
          <p className="text-[14px] text-ink-muted leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
