import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Checklist({ items, delay = 0, className }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: delay + i * 0.04 }}
          className="flex items-start gap-3"
        >
          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-success" />
          </div>
          <span className="text-[15px] text-ink leading-snug">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
