import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function Checklist({ items, delay = 0, tone = 'warning', className }) {
  const reduced = useReducedMotion();
  const maxStagger = 0.48;
  const perItem = items.length > 1 ? Math.min(0.07, maxStagger / (items.length - 1)) : 0;

  return (
    <ul className={className}>
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
          whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.3, delay: delay + i * perItem, ease: 'easeOut' }}
          className="flex items-start gap-3"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${tone === 'danger' ? 'bg-danger/10' : 'bg-warning/10'}`}>
            <AlertCircle className={`w-3 h-3 ${tone === 'danger' ? 'text-danger' : 'text-warning'}`} />
          </div>
          <span className="text-[15px] text-ink leading-snug">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
