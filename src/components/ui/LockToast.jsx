import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function LockToast({ message, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full bg-forest px-4 py-3 text-sm text-white shadow-2xl md:hidden"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="leading-snug">{message}</p>
            <Link to="/register" onClick={onClose} className="shrink-0 font-semibold text-sage-light">
              Sign Up Free →
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
