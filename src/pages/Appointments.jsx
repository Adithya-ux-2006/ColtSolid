import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Edit3, MapPin, User as UserIcon } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { Modal, EmptyState } from '../components/ui';
import { AppointmentForm } from '../components/forms';
import { useAppointmentStore } from '../store/appointmentStore';
import { cn } from '../utils/cn';

export function Appointments() {
  const { appointments, add, update, remove } = useAppointmentStore(state => ({
    appointments: state.appointments,
    add: state.add,
    update: state.update,
    remove: state.delete
  }));

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'All') return true;
    return apt.status === activeTab;
  });

  const handleOpenNew = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setEditingAppointment(apt);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingAppointment) {
      update(editingAppointment.id, data);
    } else {
      add({ ...data, status: 'Upcoming' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      remove(id);
    }
  };

  const typeColors = {
    General: 'border-coral',
    Specialist: 'border-teal',
    Telehealth: 'border-yellow'
  };

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-8 pt-6 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink mb-2">Appointments</h1>
            <p className="text-sm text-ink-muted">Manage your doctor visits and telehealth calls.</p>
          </div>
          <button 
            onClick={handleOpenNew}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-full font-medium hover:bg-coral-dark transition-colors shadow-coral"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {['Upcoming', 'Completed', 'All'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === tab ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(apt => (
              <div 
                key={apt.id} 
                className={cn(
                  "bg-white rounded-2xl p-5 shadow-sm border border-gray-50 border-l-4 relative group",
                  typeColors[apt.type] || 'border-gray-200'
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-ink pr-12">{apt.title}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                    apt.status === 'Upcoming' ? "bg-teal/10 text-teal-dark" : "bg-gray-100 text-ink-muted"
                  )}>
                    {apt.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <UserIcon className="w-4 h-4" />
                    <span>{apt.doctor}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-ink">{apt.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{apt.date} at {apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <MapPin className="w-4 h-4" />
                    <span>{apt.location}</span>
                  </div>
                </div>

                {apt.notes && (
                  <div className="bg-gray-50 p-3 rounded-xl text-sm text-ink-muted mb-4">
                    {apt.notes}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 mt-2">
                  <button 
                    onClick={() => handleOpenEdit(apt)}
                    className="p-2 text-ink-muted hover:text-ink hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-ink-muted hover:text-coral hover:bg-coral/5 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              icon={CalendarIcon}
              title={`No ${activeTab.toLowerCase()} appointments`}
              description="Keep track of your health visits here."
              ctaLabel="Schedule One"
              ctaHref="#"
            />
          )}
        </div>

        {/* FAB for Mobile */}
        <button 
          onClick={handleOpenNew}
          className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-coral text-white rounded-full shadow-coral flex items-center justify-center hover:bg-coral-dark transition-colors z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? "Edit Appointment" : "New Appointment"}
      >
        <AppointmentForm 
          initialData={editingAppointment} 
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}
