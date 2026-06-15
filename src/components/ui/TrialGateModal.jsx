import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function TrialGateModal({ isOpen }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trial-gate-title"
          >
            <div className="bg-gradient-to-r from-forest to-forest-dark px-6 py-5 text-white">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 id="trial-gate-title" className="text-2xl font-bold">You've used your 3 free searches</h2>
              <p className="mt-2 text-sm text-white/80">
                Create a free account to unlock unlimited remedy searches, save favorites, and track appointments.
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3.5 font-semibold text-white transition-colors hover:bg-forest-dark"
              >
                <Sparkles className="h-4 w-4" />
                Create Free Account
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 font-semibold text-ink transition-colors hover:bg-snow"
              >
                Log In
              </button>

              <p className="text-center text-sm text-ink-subtle">
                No credit card required. Always free to join.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
