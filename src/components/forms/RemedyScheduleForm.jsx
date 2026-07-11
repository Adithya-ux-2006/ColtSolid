import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function RemedyScheduleForm({ remedies, initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      remedyId: '',
      remedyName: '',
      scheduledTime: '08:00',
      recurrence: 'daily',
      daysOfWeek: [],
    }
  );

  const isFormValid = formData.remedyId && formData.scheduledTime;

  const handleRemedyChange = (e) => {
    const remedyId = e.target.value;
    const remedy = remedies.find((r) => r.id === remedyId);
    setFormData((prev) => ({
      ...prev,
      remedyId,
      remedyName: remedy?.name || '',
    }));
  };

  const toggleDay = (dayIndex) => {
    setFormData((prev) => {
      const days = prev.daysOfWeek.includes(dayIndex)
        ? prev.daysOfWeek.filter((d) => d !== dayIndex)
        : [...prev.daysOfWeek, dayIndex];
      return { ...prev, daysOfWeek: days };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1" htmlFor="remedyId">
          Remedy *
        </label>
        <select
          id="remedyId"
          value={formData.remedyId}
          onChange={handleRemedyChange}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          <option value="">Select a remedy</option>
          {remedies.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1" htmlFor="scheduledTime">
          Time *
        </label>
        <input
          id="scheduledTime"
          type="time"
          required
          value={formData.scheduledTime}
          onChange={(e) => setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Recurrence</label>
        <div className="flex gap-2">
          {['daily', 'weekly', 'once'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, recurrence: opt }))}
              className={
                formData.recurrence === opt
                  ? 'rounded-full border border-forest bg-primary px-4 py-2 text-sm font-medium text-white'
                  : 'rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-ink'
              }
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {formData.recurrence === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Days of Week</label>
          <div className="flex gap-2">
            {DAYS.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={
                  formData.daysOfWeek.includes(i)
                    ? 'w-10 h-10 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center'
                    : 'w-10 h-10 rounded-full border border-gray-200 text-ink text-sm font-medium flex items-center justify-center hover:bg-gray-50'
                }
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl font-medium border border-gray-200 text-ink hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="flex-1 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'Update' : 'Add Schedule'}
        </button>
      </div>
    </form>
  );
}
