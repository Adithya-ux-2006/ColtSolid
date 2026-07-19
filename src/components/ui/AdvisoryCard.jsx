import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AdvisoryCard({ title, message, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="alert"
      className={cn(
        'rounded-3xl p-5 flex items-start gap-4',
        'bg-warning/5 border border-warning/15',
        className
      )}
    >
      <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-ink text-sm mb-1">{title}</p>}
        {message && (
          <p className="text-sm text-ink-muted leading-relaxed">{message}</p>
        )}
      </div>
    </motion.div>
  );
}
