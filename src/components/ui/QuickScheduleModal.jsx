import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { RemedyScheduleForm } from '../forms/RemedyScheduleForm';
import { useQuickScheduleStore } from '../../store/quickScheduleStore';
import { useRemedyScheduleStore } from '../../store/remedyScheduleStore';
import { useFavoritesStore } from '../../store/favoritesStore';

export function QuickScheduleModal() {
  const remedy = useQuickScheduleStore((s) => s.remedy);
  const closeQuickSchedule = useQuickScheduleStore((s) => s.closeQuickSchedule);
  const add = useRemedyScheduleStore((s) => s.add);
  const favorites = useFavoritesStore((s) => s.favorites);

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!remedy) return null;

  const resetState = () => {
    setFormError(null);
    setIsSubmitting(false);
    setShowSuccess(false);
  };

  const handleSubmit = async (data) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await add(data);
    setIsSubmitting(false);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        resetState();
        closeQuickSchedule();
      }, 1500);
    } else {
      setFormError(result.error?.message || 'Could not add schedule — please try again.');
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetState();
    closeQuickSchedule();
  };

  return (
    <Modal isOpen={remedy !== null} onClose={handleClose} title="Quick Add Schedule">
      {showSuccess ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <CheckCircle className="w-12 h-12 text-primary" />
          <p className="text-ink font-medium">Schedule added!</p>
        </div>
      ) : (
        <RemedyScheduleForm
          remedies={[remedy]}
          favorites={favorites}
          lockRemedy
          initialData={{
            remedyId: remedy.id,
            remedyName: remedy.name,
            scheduledTime: '08:00',
            recurrence: 'daily',
            daysOfWeek: [],
          }}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          error={formError}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}
