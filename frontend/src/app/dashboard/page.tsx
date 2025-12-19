'use client';

import ClientLayout from '@/components/client/ClientLayout';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';

function DashboardContent() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch cases from API
    // For now, mock data
    setCases([
      { 
        id: 1, 
        caseId: '1000HILLS-2025-001', 
        title: 'Contract Dispute', 
        status: 'IN_PROGRESS', 
        category: 'LEGAL_CONSULTANCY',
        lastUpdated: '2025-01-15',
        priority: 'HIGH',
        assignedTo: 'Sarah Johnson'
      },
      { 
        id: 2, 
        caseId: '1000HILLS-2025-002', 
        title: 'Property Claim', 
        status: 'NEW', 
        category: 'MEDIATION',
        lastUpdated: '2025-01-18',
        priority: 'MEDIUM',
        assignedTo: 'Mike Davis'
      },
    ]);
    setLoading(false);
  }, []);

  const stats = [
    { label: 'Active Cases', value: '2', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Resolved Cases', value: '5', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending Actions', value: '1', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Upcoming Meetings', value: '3', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const recentActivity = [
    { id: 1, action: 'Case status updated', case: 'Contract Dispute', time: '2 hours ago', type: 'update' },
    { id: 2, action: 'New message received', case: 'Property Claim', time: '5 hours ago', type: 'message' },
    { id: 3, action: 'Document uploaded', case: 'Contract Dispute', time: '1 day ago', type: 'document' },
  ];

  const upcomingAppointments = [
    { id: 1, title: 'Case Review Meeting', date: '2025-12-20', time: '10:00 AM', attorney: 'Sarah Johnson' },
    { id: 2, title: 'Initial Consultation', date: '2025-12-22', time: '2:00 PM', attorney: 'Mike Davis' },
  ];

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your cases today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Cases */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Cases</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/cases">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:border-1000-blue transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-1000-blue font-semibold">{caseItem.caseId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          caseItem.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          caseItem.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{caseItem.category.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Assigned to {caseItem.assignedTo}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      caseItem.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      caseItem.status === 'NEW' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Last updated: {caseItem.lastUpdated}</span>
                    <Button asChild size="sm" variant="ghost" className="text-1000-blue">
                      <Link href={`/dashboard/cases/${caseItem.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild className="w-full mt-4 bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/submit-case">
                <Plus className="w-4 h-4 mr-2" />
                Submit New Case
              </Link>
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-1000-blue bg-blue-50 rounded-r-lg p-3">
                    <h3 className="font-medium text-gray-900 text-sm">{appointment.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{appointment.date} at {appointment.time}</p>
                    <p className="text-xs text-gray-600">with {appointment.attorney}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4" size="sm">
                <Link href="/dashboard/appointments">View All Appointments</Link>
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'message' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.case}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-1000-blue to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button asChild className="w-full bg-white text-1000-blue hover:bg-gray-100" size="sm">
                  <Link href="/dashboard/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button asChild className="w-full bg-white text-1000-blue hover:bg-gray-100" size="sm">
                  <Link href="/dashboard/documents">
                    <Download className="w-4 h-4 mr-2" />
                    Upload Document
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
