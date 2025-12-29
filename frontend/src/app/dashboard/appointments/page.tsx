'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ManagerLayout from '@/components/manager/ManagerLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, Appointment, AppointmentType, AppointmentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Search,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface AppointmentStats {
  upcoming: number;
  this_month: number;
  completed: number;
  pending: number;
}

interface Attorney {
  id: number;
  name: string;
  email: string;
}

function AppointmentsContent() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    upcoming: 0,
    this_month: 0,
    completed: 0,
    pending: 0,
  });
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for booking
  const [bookingForm, setBookingForm] = useState({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    appointment_type: 'video' as AppointmentType,
    location: '',
    attorney_id: 0,
    case_id: '',
    notes: '',
    client_phone: '',
  });
  
  const [userPhone, setUserPhone] = useState('');
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  
  // Check if user is manager or admin
  const isManagerOrAdmin = user?.role === Role.SUPER_ADMIN || user?.role === Role.CASE_MANAGER;

  useEffect(() => {
    fetchAppointments();
    fetchStats();
    fetchAttorneys();
    fetchUserPhone();
  }, []);
  
  const fetchUserPhone = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.data?.phone) {
        setUserPhone(response.data.phone);
      }
    } catch (err) {
      console.error('Error fetching user phone:', err);
    }
  };

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

  const fetchAttorneys = async () => {
    try {
      console.log('[Appointments] Fetching attorneys...');
      const response = await api.getAvailableAttorneys();
      console.log('[Appointments] Attorneys response:', response);

      if (response.data?.attorneys) {
        console.log('[Appointments] Setting attorneys:', response.data.attorneys);
        setAttorneys(response.data.attorneys);
      } else {
        console.warn('[Appointments] No attorneys in response');
      }
    } catch (err) {
      console.error('Error fetching attorneys:', err);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.title.toLowerCase().includes(query) ||
          apt.attorney_name?.toLowerCase().includes(query) ||
          apt.location?.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if phone appointment and client doesn't have phone number
    if (bookingForm.appointment_type === AppointmentType.PHONE && 
        user?.role === Role.CLIENT && 
        !userPhone && 
        !bookingForm.client_phone) {
      setShowPhonePrompt(true);
      return;
    }

    try {
      const appointmentData: any = {
        ...bookingForm,
        case_id: bookingForm.case_id ? parseInt(bookingForm.case_id) : undefined,
      };
      
      // Add client_phone if provided and it's a phone appointment
      if (bookingForm.appointment_type === AppointmentType.PHONE && bookingForm.client_phone) {
        appointmentData.client_phone = bookingForm.client_phone;
      }
      
      // For managers/admins: auto-assign self as attorney if not selected
      if (isManagerOrAdmin && (!appointmentData.attorney_id || appointmentData.attorney_id === 0)) {
        appointmentData.attorney_id = user?.id;
      }
      
      // Remove location if client (will be set by manager/admin)
      if (!isManagerOrAdmin) {
        delete appointmentData.location;
      }
      
      // Remove client_id for managers/admins (anonymous appointment)
      if (isManagerOrAdmin) {
        delete appointmentData.client_id;
      }

      const response = await api.createAppointment(appointmentData);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Success
      setShowBookingModal(false);
      setShowPhonePrompt(false);
      fetchAppointments();
      fetchStats();
      resetBookingForm();
    } catch (err) {
      setError('Failed to book appointment');
      console.error('Error booking appointment:', err);
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

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setBookingForm({
      title: appointment.title,
      description: appointment.description || '',
      start_datetime: appointment.start_datetime,
      end_datetime: appointment.end_datetime,
      appointment_type: appointment.appointment_type,
      location: appointment.location || '',
      attorney_id: appointment.attorney_id,
      case_id: appointment.case_id?.toString() || '',
      notes: appointment.notes || '',
      client_phone: '',
    });
    setShowBookingModal(true);
  };

  const resetBookingForm = () => {
    setBookingForm({
      title: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      appointment_type: 'video' as AppointmentType,
      location: '',
      attorney_id: 0,
      case_id: '',
      notes: '',
      client_phone: '',
    });
    setSelectedAppointment(null);
    setShowPhonePrompt(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: Check },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
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
      video: <Video className="w-4 h-4" />,
      in_person: <MapPin className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
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
    // Select appropriate layout based on user role
    const LayoutComponent = user?.role === Role.SUPER_ADMIN ? AdminLayout : 
                           user?.role === Role.CASE_MANAGER ? ManagerLayout : 
                           ClientLayout;
    
    return (
      <LayoutComponent>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  // Select appropriate layout based on user role
  const LayoutComponent = user?.role === Role.SUPER_ADMIN ? AdminLayout : 
                         user?.role === Role.CASE_MANAGER ? ManagerLayout : 
                         ClientLayout;

  return (
    <LayoutComponent>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Schedule and manage your meetings</p>
          </div>
          <Button
            onClick={() => {
              resetBookingForm();
              setShowBookingModal(true);
            }}
            className="bg-1000-blue hover:bg-1000-blue/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
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
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <p className="text-sm font-medium text-gray-600">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.upcoming}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.this_month}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.completed}</p>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
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

          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                view === 'list'
                  ? 'bg-1000-blue text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l ${
                view === 'calendar'
                  ? 'bg-1000-blue text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {view === 'list' ? (
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
                <p className="text-gray-400 text-sm mt-1">
                  Book your first appointment to get started
                </p>
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
                            {upcoming && (
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

                          <div className="space-y-2 text-sm text-gray-600">
                            {/* Date and Time */}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{datetime.date}</span>
                              <span>at</span>
                              <span className="font-medium">{datetime.time}</span>
                              <span className="text-gray-400">•</span>
                              <span>{appointment.duration} minutes</span>
                            </div>

                            {/* Type and Location */}
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

                            {/* Attorney */}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-1000-blue rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {appointment.attorney_name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <span>with {appointment.attorney_name}</span>
                              {appointment.case_reference && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-1000-blue font-medium">
                                    {appointment.case_reference}
                                  </span>
                                </>
                              )}
                            </div>
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
                          {/* Video Call Button */}
                          {appointment.appointment_type === AppointmentType.VIDEO &&
                            appointment.status === AppointmentStatus.CONFIRMED && (
                              <div className="space-y-2">
                                {appointment.meeting_link ? (
                                  <>
                                    <Button
                                      onClick={() => window.open(appointment.meeting_link, '_blank')}
                                      className="bg-1000-blue hover:bg-1000-blue/90 w-full"
                                      size="sm"
                                    >
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Meeting
                                      <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(appointment.meeting_link || '');
                                        alert('Meeting link copied to clipboard!');
                                      }}
                                      className="text-xs text-gray-600 hover:text-1000-blue underline w-full"
                                    >
                                      Copy link
                                    </button>
                                  </>
                                ) : (
                                  <div className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Meeting link pending</span>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Phone Call Button */}
                          {appointment.appointment_type === AppointmentType.PHONE &&
                            appointment.status === AppointmentStatus.CONFIRMED && (
                              <Button
                                onClick={() => {
                                  const phoneNumber = user?.role === Role.CLIENT 
                                    ? appointment.attorney_phone 
                                    : appointment.client_phone;
                                  if (phoneNumber) {
                                    window.location.href = `tel:${phoneNumber}`;
                                  }
                                }}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                              </Button>
                            )}

                          {upcoming &&
                            appointment.status !== AppointmentStatus.CANCELLED && (
                              <>
                                <Button
                                  onClick={() => handleReschedule(appointment)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button>
                                <Button
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-700 py-2 text-sm"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Grid */}
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = ((i % 31) + 1).toString();
                const dayAppointments = filteredAppointments.filter((apt) => {
                  const aptDate = new Date(apt.start_datetime);
                  return (
                    aptDate.getDate() === parseInt(dayNumber) &&
                    aptDate.getMonth() === currentDate.getMonth() &&
                    aptDate.getFullYear() === currentDate.getFullYear()
                  );
                });

                return (
                  <div
                    key={i}
                    className="min-h-24 border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer relative"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      {dayNumber}
                    </span>
                    {dayAppointments.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs p-1 bg-1000-blue text-white rounded truncate"
                            title={apt.title}
                          >
                            {formatDateTime(apt.start_datetime).time}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAppointment ? 'Reschedule Appointment' : 'Book New Appointment'}
                </h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    resetBookingForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.title}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="e.g., Initial Consultation"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Additional details about this appointment"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingForm.start_datetime}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, start_datetime: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingForm.end_datetime}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, end_datetime: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'video', label: 'Video Call', icon: Video },
                      { value: 'in_person', label: 'In Person', icon: MapPin },
                      { value: 'phone', label: 'Phone Call', icon: Phone },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setBookingForm({
                            ...bookingForm,
                            appointment_type: value as AppointmentType,
                          })
                        }
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                          bookingForm.appointment_type === value
                            ? 'border-1000-blue bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Info messages based on appointment type */}
                  {!isManagerOrAdmin && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        {bookingForm.appointment_type === 'video' && (
                          <>
                            <Check className="w-4 h-4 inline mr-1" />
                            Google Meet link will be generated automatically when your appointment is confirmed
                          </>
                        )}
                        {bookingForm.appointment_type === 'in_person' && (
                          <>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            The location will be provided by the attorney after confirmation
                          </>
                        )}
                        {bookingForm.appointment_type === 'phone' && (
                          <>
                            <Phone className="w-4 h-4 inline mr-1" />
                            The attorney will call you at the scheduled time
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location - Only for managers/admins and in-person appointments */}
                {isManagerOrAdmin && bookingForm.appointment_type === 'in_person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.location}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                      placeholder="e.g., 1000 Hills Office, Durban"
                    />
                  </div>
                )}
                
                {/* Phone Number - Only for clients with phone appointments */}
                {!isManagerOrAdmin && bookingForm.appointment_type === 'phone' && !userPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.client_phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, client_phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                      placeholder="e.g., +27 12 345 6789"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We'll use this number to call you for the appointment
                    </p>
                  </div>
                )}
                
                {/* Show saved phone number for clients */}
                {!isManagerOrAdmin && bookingForm.appointment_type === 'phone' && userPhone && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Phone:</span> {userPhone}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setUserPhone('');
                        setShowPhonePrompt(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                    >
                      Use different number
                    </button>
                  </div>
                )}

                {/* Attorney Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Attorney *
                  </label>
                  <select
                    required
                    value={bookingForm.attorney_id}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        attorney_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                  >
                    <option value={0}>Select an attorney</option>
                    {attorneys.map((attorney) => (
                      <option key={attorney.id} value={attorney.id}>
                        {attorney.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Case ID (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case ID (Optional)
                  </label>
                  <input
                    type="number"
                    value={bookingForm.case_id}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, case_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Link to existing case"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Any additional notes or requirements"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-1000-blue hover:bg-1000-blue/90"
                  >
                    {selectedAppointment ? 'Update Appointment' : 'Book Appointment'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBookingModal(false);
                      resetBookingForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutComponent>
  );
}

export default function Appointments() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT, Role.CASE_MANAGER, Role.SUPER_ADMIN]}>
      <AppointmentsContent />
    </ProtectedRoute>
  );
}
