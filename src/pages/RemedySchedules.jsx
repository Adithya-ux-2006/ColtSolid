import { useState } from 'react';
import { Clock, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { RemedyScheduleForm } from '../components/forms';
import { useRemedyScheduleStore } from '../store/remedyScheduleStore';
import { useCatalogStore } from '../store/catalogStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { cn } from '../utils/cn';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatRecurrence(schedule) {
  if (schedule.recurrence === 'once') return 'One-time';
  if (schedule.recurrence === 'daily') return 'Daily';
  if (schedule.recurrence === 'weekly' && schedule.days_of_week?.length) {
    return `Weekly (${schedule.days_of_week.map((d) => DAYS[d]).join(', ')})`;
  }
  return 'Weekly';
}

export function RemedySchedules() {
  const schedules = useRemedyScheduleStore((s) => s.schedules);
  const add = useRemedyScheduleStore((s) => s.add);
  const remove = useRemedyScheduleStore((s) => s.remove);
  const toggleActive = useRemedyScheduleStore((s) => s.toggleActive);
  const remedies = useCatalogStore((s) => s.remedies);
  const favorites = useFavoritesStore((s) => s.favorites);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (data) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await add(data);
    setIsSubmitting(false);
    if (result.success) {
      setIsModalOpen(false);
      setFormError(null);
    } else {
      setFormError(result.error?.message || 'Could not add schedule — please try again.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this schedule?')) {
      remove(id);
    }
  };

  return (
    <PageWrapper className="min-h-screen pb-24 md:pb-8 pt-6 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink mb-2">Remedy Schedules</h1>
            <p className="text-sm text-ink-muted">Set reminders for when to take your remedies.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-glow"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        <div className="space-y-3">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={cn(
                  'bg-card rounded-2xl p-5 shadow-sm border border-border relative',
                  !schedule.active && 'opacity-60'
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-ink">{schedule.remedy_name}</h3>
                    <p className="text-sm text-ink-muted">{formatRecurrence(schedule)}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(schedule.id)}
                    className="p-1 text-ink-muted hover:text-ink transition-colors"
                    aria-label={schedule.active ? 'Pause schedule' : 'Resume schedule'}
                  >
                    {schedule.active ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-ink-muted mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(schedule.scheduled_time)}</span>
                </div>

                <div className="flex justify-end border-t border-border pt-3 mt-2">
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-2 text-ink-muted hover:text-primary-dark hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Clock}
              title="No remedy schedules"
              description="Add a schedule to get reminders for your remedies."
            />
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-glow flex items-center justify-center hover:bg-primary-dark transition-colors z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormError(null); }}
        title="New Remedy Schedule"
      >
        <RemedyScheduleForm
          remedies={remedies}
          favorites={favorites}
          onSubmit={handleAdd}
          onCancel={() => { setIsModalOpen(false); setFormError(null); }}
          error={formError}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </PageWrapper>
  );
}
