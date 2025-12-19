'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { 
  Activity, 
  Filter, 
  Download,
  Calendar,
  User,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function ActivityLogContent() {
  const [filterType, setFilterType] = useState('ALL');
  const [filterUser, setFilterUser] = useState('ALL');

  // Mock activity data
  const activities = [
    { id: 1, type: 'user', user: 'John Smith', email: 'john@example.com', action: 'Logged in', timestamp: '2025-12-19 10:30:45', severity: 'info' },
    { id: 2, type: 'case', user: 'Sarah Johnson', email: 'sarah@example.com', action: 'Created new case: Property Dispute', timestamp: '2025-12-19 10:28:12', severity: 'info' },
    { id: 3, type: 'case', user: 'Mike Davis', email: 'mike@example.com', action: 'Updated case status: Contract Review', timestamp: '2025-12-19 10:25:33', severity: 'info' },
    { id: 4, type: 'user', user: 'Admin', email: 'admin@1000hills.com', action: 'Created new user: Emily Brown', timestamp: '2025-12-19 10:20:18', severity: 'success' },
    { id: 5, type: 'system', user: 'System', email: '', action: 'Database backup completed successfully', timestamp: '2025-12-19 10:15:00', severity: 'success' },
    { id: 6, type: 'case', user: 'Emily Brown', email: 'emily@example.com', action: 'Assigned case to Mike Davis', timestamp: '2025-12-19 10:10:45', severity: 'info' },
    { id: 7, type: 'system', user: 'System', email: '', action: 'Failed login attempt from IP 192.168.1.100', timestamp: '2025-12-19 10:05:22', severity: 'warning' },
    { id: 8, type: 'user', user: 'Robert Wilson', email: 'robert@example.com', action: 'Changed password', timestamp: '2025-12-19 10:00:15', severity: 'info' },
    { id: 9, type: 'case', user: 'Sarah Johnson', email: 'sarah@example.com', action: 'Resolved case: Immigration Consultation', timestamp: '2025-12-19 09:55:30', severity: 'success' },
    { id: 10, type: 'system', user: 'System', email: '', action: 'System maintenance completed', timestamp: '2025-12-19 09:50:00', severity: 'info' },
    { id: 11, type: 'user', user: 'Admin', email: 'admin@1000hills.com', action: 'Updated system settings', timestamp: '2025-12-19 09:45:12', severity: 'warning' },
    { id: 12, type: 'case', user: 'Mike Davis', email: 'mike@example.com', action: 'Added document to case: Employment Claim', timestamp: '2025-12-19 09:40:25', severity: 'info' },
  ];

  const getIcon = (type: string, severity: string) => {
    if (severity === 'warning' || severity === 'error') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (severity === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    switch (type) {
      case 'user': return <User className="w-5 h-5 text-blue-500" />;
      case 'case': return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'system': return <Settings className="w-5 h-5 text-gray-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'ALL' && activity.type !== filterType.toLowerCase()) return false;
    if (filterUser !== 'ALL' && activity.user !== filterUser) return false;
    return true;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Log
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-green-500" />
            <p className="text-sm text-gray-600">User Actions</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities.filter(a => a.type === 'user').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-yellow-500" />
            <p className="text-sm text-gray-600">Case Activities</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities.filter(a => a.type === 'case').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-gray-600">Warnings</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities.filter(a => a.severity === 'warning' || a.severity === 'error').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
            >
              <option value="ALL">All Types</option>
              <option value="USER">User Activities</option>
              <option value="CASE">Case Activities</option>
              <option value="SYSTEM">System Events</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by User
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
            >
              <option value="ALL">All Users</option>
              <option value="John Smith">John Smith</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Davis">Mike Davis</option>
              <option value="Admin">Admin</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="space-y-4">
            {filteredActivities.map((activity, idx) => (
              <div 
                key={activity.id} 
                className={`flex gap-4 p-4 rounded-lg border ${getSeverityColor(activity.severity)}`}
              >
                <div className="flex-shrink-0">
                  {getIcon(activity.type, activity.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {activity.user}
                        </span>
                        {activity.email && (
                          <span>• {activity.email}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{activity.timestamp}</span>
                      </div>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                        activity.type === 'user' ? 'bg-blue-100 text-blue-700' :
                        activity.type === 'case' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredActivities.length}</span> of <span className="font-medium">{activities.length}</span> activities
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-1000-blue text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ActivityLog() {
  return (
    <ProtectedRoute requiredRole={[Role.SUPER_ADMIN]}>
      <ActivityLogContent />
    </ProtectedRoute>
  );
}
