'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

function AppointmentsContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 15)); // January 2025
  const [view, setView] = useState<'calendar' | 'list'>('list');

  const appointments = [
    {
      id: 1,
      title: 'Initial Consultation',
      attorney: 'Sarah Johnson',
      date: '2025-01-20',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'video',
      location: 'Zoom Meeting',
      status: 'confirmed',
      caseId: '1000HILLS-2025-001'
    },
    {
      id: 2,
      title: 'Case Review Meeting',
      attorney: 'Mike Davis',
      date: '2025-01-25',
      time: '2:00 PM',
      duration: '45 minutes',
      type: 'in-person',
      location: '1000 Hills Office, Durban',
      status: 'pending',
      caseId: '1000HILLS-2025-002'
    },
    {
      id: 3,
      title: 'Document Signing',
      attorney: 'Sarah Johnson',
      date: '2025-02-01',
      time: '11:30 AM',
      duration: '30 minutes',
      type: 'in-person',
      location: '1000 Hills Office, Durban',
      status: 'confirmed',
      caseId: '1000HILLS-2025-001'
    },
  ];

  const stats = [
    { label: 'Upcoming', value: '3', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'This Month', value: '5', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Completed', value: '12', color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeIcon = (type: string) => {
    return type === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;
  };

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Schedule and manage your meetings</p>
          </div>
          <Button className="bg-1000-blue hover:bg-1000-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex justify-end">
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
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.date} at {appointment.time}</span>
                          <span className="text-gray-400">•</span>
                          <span>{appointment.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getTypeIcon(appointment.type)}
                          <span>{appointment.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-1000-blue rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {appointment.attorney.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>with {appointment.attorney}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-1000-blue font-medium">{appointment.caseId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      {appointment.type === 'video' && (
                        <Button className="bg-1000-blue hover:bg-1000-blue/90" size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
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
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
              {/* Calendar grid would be generated here */}
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm text-gray-600">{((i % 31) + 1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export default function Appointments() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <AppointmentsContent />
    </ProtectedRoute>
  );
}
