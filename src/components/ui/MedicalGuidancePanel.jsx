import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SYMPTOM_EMERGENCY_FLAGS, UNIVERSAL_EMERGENCY_FLAGS } from '../../constants/emergency';

export function MedicalGuidancePanel({ symptomId, severity, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const symptomFlags = SYMPTOM_EMERGENCY_FLAGS[symptomId] || [];
  const flags = [...new Set([...symptomFlags, ...UNIVERSAL_EMERGENCY_FLAGS])];

  if (severity === 'mild' && flags.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-danger/15 bg-danger-light overflow-hidden',
        className
      )}
      role="region"
      aria-label="When to seek medical care"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 min-h-[56px] text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
          <span className="text-sm font-semibold text-ink truncate">When to seek medical care</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="text-danger mt-1.5 text-[8px]" aria-hidden="true">&#9679;</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
