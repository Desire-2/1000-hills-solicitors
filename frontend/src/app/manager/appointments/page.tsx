'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, Appointment, AppointmentStatus, AppointmentType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Search,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Edit,
  User,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface AppointmentStats {
  upcoming: number;
  this_month: number;
  completed: number;
  pending: number;
}

function ManagerAppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    upcoming: 0,
    this_month: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<number | null>(null);
  const [manualMeetingLink, setManualMeetingLink] = useState('');
  const [editForm, setEditForm] = useState({
    location: '',
    notes: '',
    status: 'pending' as AppointmentStatus,
  });

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filterStatus, searchQuery]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.getAppointments();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data?.appointments) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getAppointmentStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.title.toLowerCase().includes(query) ||
          apt.client_name?.toLowerCase().includes(query) ||
          apt.attorney_name?.toLowerCase().includes(query) ||
          apt.case_reference?.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleConfirmAppointment = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    const isVideo = appointment?.appointment_type === AppointmentType.VIDEO;
    
    // If it's a video appointment, show modal for optional manual link
    if (isVideo) {
      setConfirmingAppointmentId(appointmentId);
      setManualMeetingLink('');
      setShowConfirmModal(true);
    } else {
      // For non-video appointments, confirm directly
      confirmAppointmentDirectly(appointmentId);
    }
  };

  const confirmAppointmentDirectly = async (appointmentId: number, meetingLink?: string) => {
    try {
      const updateData: any = {
        status: AppointmentStatus.CONFIRMED,
      };
      
      // If manual meeting link provided, include it
      if (meetingLink) {
        updateData.meeting_link = meetingLink;
      }

      const response = await api.updateAppointment(appointmentId, updateData);

      if (response.error) {
        setError(response.error);
        return;
      }

      const appointment = appointments.find(a => a.id === appointmentId);
      const isVideo = appointment?.appointment_type === AppointmentType.VIDEO;
      
      // Show success message
      const successMsg = isVideo 
        ? (meetingLink ? 'Appointment confirmed with your custom link!' : 'Appointment confirmed! Google Meet link generated and emails sent.')
        : 'Appointment confirmed! Confirmation emails sent.';
      
      alert(successMsg);
      
      setShowConfirmModal(false);
      setConfirmingAppointmentId(null);
      setManualMeetingLink('');
      
      fetchAppointments();
      fetchStats();
    } catch (err) {
      setError('Failed to confirm appointment');
      console.error('Error confirming appointment:', err);
    }
  };

  const handleConfirmSubmit = () => {
    if (confirmingAppointmentId) {
      confirmAppointmentDirectly(confirmingAppointmentId, manualMeetingLink || undefined);
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await api.cancelAppointment(appointmentId);

      if (response.error) {
        setError(response.error);
        return;
      }

      fetchAppointments();
      fetchStats();
    } catch (err) {
      setError('Failed to cancel appointment');
      console.error('Error cancelling appointment:', err);
    }
  };

  const handleRegenerateMeetingLink = async (appointmentId: number) => {
    if (!confirm('Regenerate the Google Meet link for this appointment? A new link will be sent to both parties.')) return;

    try {
      const response = await api.regenerateMeetingLink(appointmentId);

      if (response.error) {
        setError(response.error);
        return;
      }

      alert('Meeting link regenerated successfully! New link sent to both parties.');
      fetchAppointments();
    } catch (err) {
      setError('Failed to regenerate meeting link');
      console.error('Error regenerating meeting link:', err);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      location: appointment.location || '',
      notes: appointment.notes || '',
      status: appointment.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const response = await api.updateAppointment(selectedAppointment.id, editForm);

      if (response.error) {
        setError(response.error);
        return;
      }

      setShowEditModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
      fetchStats();
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Check },
      rescheduled: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock },
    };

    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: <Video className="w-4 h-4 text-blue-600" />,
      in_person: <MapPin className="w-4 h-4 text-green-600" />,
      phone: <Phone className="w-4 h-4 text-purple-600" />,
    };
    return icons[type as keyof typeof icons] || <Video className="w-4 h-4" />;
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const isUpcoming = (startDateTime: string) => {
    return new Date(startDateTime) > new Date();
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Appointments</h1>
          <p className="text-gray-600 mt-1">Review and manage all client appointments</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-sm font-medium text-gray-600">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <p className="text-sm font-medium text-gray-600">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.upcoming}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.this_month}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, attorney, case, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filterStatus === 'all' ? 'All Appointments' : `${filterStatus} Appointments`}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredAppointments.length})
              </span>
            </h2>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const datetime = formatDateTime(appointment.start_datetime);
                const upcoming = isUpcoming(appointment.start_datetime);

                return (
                  <div
                    key={appointment.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.title}
                          </h3>
                          {getStatusBadge(appointment.status)}
                          {upcoming && appointment.status === AppointmentStatus.CONFIRMED && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>

                        {appointment.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {appointment.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          {/* Date and Time */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{datetime.date}</span>
                            <span>at</span>
                            <span className="font-medium">{datetime.time}</span>
                          </div>

                          {/* Type */}
                          <div className="flex items-center gap-2">
                            {getTypeIcon(appointment.appointment_type)}
                            <span className="capitalize">
                              {appointment.appointment_type.replace('_', ' ')}
                            </span>
                            {appointment.location && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{appointment.location}</span>
                              </>
                            )}
                          </div>

                          {/* Client */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Client:</span>
                            <span>{appointment.client_name}</span>
                          </div>

                          {/* Attorney */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Attorney:</span>
                            <span>{appointment.attorney_name}</span>
                          </div>

                          {/* Case Reference */}
                          {appointment.case_reference && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Case:</span>
                              <span className="text-1000-blue">{appointment.case_reference}</span>
                            </div>
                          )}

                          {/* Meeting Link */}
                          {appointment.appointment_type === AppointmentType.VIDEO && (
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-gray-400" />
                              {appointment.meeting_link ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={appointment.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-1000-blue hover:underline flex items-center gap-1"
                                  >
                                    Meeting Link
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(appointment.meeting_link || '');
                                      alert('Meeting link copied!');
                                    }}
                                    className="text-xs text-gray-500 hover:text-1000-blue px-2 py-1 rounded border border-gray-300 hover:border-1000-blue"
                                  >
                                    Copy
                                  </button>
                                </div>
                              ) : appointment.status === AppointmentStatus.CONFIRMED ? (
                                <span className="text-amber-600 text-sm flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  Link pending - contact support
                                  <button
                                    onClick={() => handleRegenerateMeetingLink(appointment.id)}
                                    className="ml-2 text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded flex items-center gap-1"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                  </button>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">Link will be generated upon confirmation</span>
                              )}
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {appointment.status === AppointmentStatus.PENDING && (
                          <Button
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </Button>
                        )}

                        <Button
                          onClick={() => handleEditAppointment(appointment)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>

                        {appointment.status !== AppointmentStatus.CANCELLED && (
                          <Button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateAppointment} className="p-6 space-y-4">
                {/* Appointment Info (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-gray-900">{selectedAppointment.title}</h3>
                  <p className="text-sm text-gray-600">
                    Client: {selectedAppointment.client_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(selectedAppointment.start_datetime).date} at{' '}
                    {formatDateTime(selectedAppointment.start_datetime).time}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value as AppointmentStatus })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Location */}
                {selectedAppointment.appointment_type === 'in_person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                      placeholder="e.g., 1000 Hills Office, Durban"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Add any notes about this appointment"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-1000-blue hover:bg-1000-blue/90"
                  >
                    Update Appointment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAppointment(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Appointment Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Confirm Appointment</h3>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmingAppointmentId(null);
                    setManualMeetingLink('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Confirming this video appointment will send notifications to both parties.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Option 1:</strong> Leave the field below empty to auto-generate a Google Meet link.
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Option 2:</strong> Paste your own Google Meet link below.
                  </p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Meet Link (Optional)
                </label>
                <input
                  type="url"
                  value={manualMeetingLink}
                  onChange={(e) => setManualMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-generate a meeting link
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmingAppointmentId(null);
                    setManualMeetingLink('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default function ManagerAppointments() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerAppointmentsContent />
    </ProtectedRoute>
  );
}
