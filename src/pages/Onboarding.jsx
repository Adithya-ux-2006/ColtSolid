import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';
import { CONDITIONS, ALLERGIES, PREFS } from '../constants/onboarding';

const STEPS = [
  {
    key: 'conditions',
    title: 'Which of these do you commonly experience?',
    subtext: "Select all that apply. We'll prioritize these on your dashboard.",
    options: CONDITIONS,
  },
  {
    key: 'allergies',
    title: 'Do you have any known allergies?',
    subtext: "We'll flag remedies that may affect you.",
    options: ALLERGIES,
  },
  {
    key: 'prefs',
    title: 'What kind of remedies do you prefer?',
    subtext: 'Select up to 2. This sets your default filter.',
    options: PREFS,
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const saveOnboarding = useAuthStore((state) => state.saveOnboarding);
  const hasCompletedOnboarding = useAuthStore((state) => state.user?.has_completed_onboarding ?? false);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectionWarning, setSelectionWarning] = useState('');
  const [conditions, setConditions] = useState(user?.common_conditions ?? []);
  const [allergies, setAllergies] = useState(user?.known_allergies ?? []);
  const [prefs, setPrefs] = useState(user?.treatment_prefs ?? []);

  const currentStep = STEPS[stepIndex];
  const progress = useMemo(() => stepIndex + 1, [stepIndex]);

  useEffect(() => {
    if (!showComplete) return undefined;

    const timer = window.setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [navigate, showComplete]);

  useEffect(() => {
    if (!hasCompletedOnboarding || showComplete) return;

    navigate('/dashboard', { replace: true });
  }, [hasCompletedOnboarding, navigate, showComplete]);

  const handleNoneAwareToggle = (value, selectedValues, setSelectedValues) => {
    if (value === 'none') {
      setSelectedValues(selectedValues.includes('none') ? [] : ['none']);
      return;
    }

    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues.filter((item) => item !== 'none'), value];

    setSelectedValues(nextValues);
  };

  const handlePrefToggle = (value) => {
    setSelectionWarning('');

    if (prefs.includes(value)) {
      setPrefs(prefs.filter((item) => item !== value));
      return;
    }

    if (prefs.length >= 2) {
      setSelectionWarning('Max 2 selected. Deselect one to change.');
      return;
    }

    setPrefs([...prefs, value]);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setDirection(-1);
    setSelectionWarning('');
    setStepIndex((current) => current - 1);
  };

  const handleContinue = async () => {
    setErrorMessage('');

    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setSelectionWarning('');
      setStepIndex((current) => current + 1);
      return;
    }

    setIsSaving(true);

    const result = await saveOnboarding({
      commonConditions: conditions.filter((value) => value !== 'none'),
      knownAllergies: allergies.filter((value) => value !== 'none'),
      treatmentPrefs: prefs,
    });

    setIsSaving(false);

    if (!result.success) {
      setErrorMessage(result.error?.message || 'Unable to save onboarding right now.');
      return;
    }

    setShowComplete(true);
  };

  if (showComplete) {
    return (
      <PageWrapper className="min-h-screen bg-[#F7F1E7] px-6 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-6"
          >
            <CheckCircle2 className="h-20 w-20 text-forest" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-ink">
            All set, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-3 text-lg text-ink-muted">Your dashboard is ready.</p>
        </div>
      </PageWrapper>
    );
  }

  const selectedValues = currentStep.key === 'conditions'
    ? conditions
    : currentStep.key === 'allergies'
      ? allergies
      : prefs;

  return (
    <PageWrapper className="min-h-screen bg-[#F7F1E7] px-6 py-8 md:py-12">
      <div className="mx-auto flex min-h-[82vh] max-w-3xl flex-col rounded-[2rem] bg-transparent">
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            {STEPS.map((step, index) => (
              <div key={step.key} className="h-2 flex-1 overflow-hidden rounded-full bg-white/70">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    index < progress ? 'w-full bg-forest' : 'w-0 bg-forest'
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-ink-muted">Step {progress} of 3</p>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-sm backdrop-blur md:p-10">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep.key}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div className="max-w-2xl">
                <h1 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">
                  {currentStep.title}
                </h1>
                <p className="mt-3 text-base text-ink-muted md:text-lg">{currentStep.subtext}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {currentStep.options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const handleClick = () => {
                    if (currentStep.key === 'conditions') {
                      handleNoneAwareToggle(option.value, conditions, setConditions);
                      return;
                    }

                    if (currentStep.key === 'allergies') {
                      handleNoneAwareToggle(option.value, allergies, setAllergies);
                      return;
                    }

                    handlePrefToggle(option.value);
                  };

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={handleClick}
                      className={cn(
                        'min-h-[88px] rounded-2xl border px-4 py-4 text-left transition-all',
                        isSelected
                          ? 'border-forest bg-forest text-white'
                          : 'border-forest bg-white text-forest hover:bg-forest/5'
                      )}
                    >
                      <div className="mb-2 text-2xl">{option.emoji}</div>
                      <div className="text-sm font-semibold leading-snug md:text-base">{option.label}</div>
                    </button>
                  );
                })}
              </div>

              {currentStep.key === 'prefs' && selectionWarning ? (
                <p className="text-sm font-medium text-amber-dark">{selectionWarning}</p>
              ) : null}

              {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0 || isSaving}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : stepIndex === STEPS.length - 1 ? 'Continue' : 'Continue'}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
