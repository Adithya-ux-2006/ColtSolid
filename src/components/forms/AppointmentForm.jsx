import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function AppointmentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      doctor: '',
      date: '',
      time: '',
      location: '',
      type: 'General',
      notes: ''
    }
  );

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { title, doctor, date, time, location } = formData;
    setIsFormValid(
      title.trim() !== '' &&
      doctor.trim() !== '' &&
      date.trim() !== '' &&
      time.trim() !== '' &&
      location.trim() !== ''
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <label className="block text-sm font-medium text-ink mb-1" htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
          placeholder="e.g. General Checkup"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1" htmlFor="doctor">Doctor *</label>
          <input
            id="doctor"
            name="doctor"
            type="text"
            required
            value={formData.doctor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1" htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral bg-white"
          >
            <option value="General">General</option>
            <option value="Specialist">Specialist</option>
            <option value="Telehealth">Telehealth</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1" htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1" htmlFor="time">Time *</label>
          <input
            id="time"
            name="time"
            type="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1" htmlFor="location">Location *</label>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1" htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral resize-none"
          placeholder="Any symptoms or questions for the doctor?"
        />
      </div>

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
          className="flex-1 py-2.5 rounded-xl font-medium bg-coral text-white hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'Update' : 'Schedule'}
        </button>
      </div>
    </form>
  );
}
