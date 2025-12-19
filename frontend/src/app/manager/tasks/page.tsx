'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, AlertTriangle, Plus, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';

function ManagerTasksContent() {
  const [filterStatus, setFilterStatus] = useState('all');

  const tasks = [
    {
      id: 1,
      title: 'File court documents',
      description: 'Submit evidence and supporting documents to court',
      caseId: '1000HILLS-2025-005',
      caseName: 'Employment Mediation',
      dueDate: '2025-12-20',
      priority: 'High',
      status: 'pending',
      assignedTo: 'You'
    },
    {
      id: 2,
      title: 'Client meeting preparation',
      description: 'Prepare materials and agenda for contract review meeting',
      caseId: '1000HILLS-2025-001',
      caseName: 'Contract Dispute',
      dueDate: '2025-12-21',
      priority: 'Medium',
      status: 'in-progress',
      assignedTo: 'You'
    },
    {
      id: 3,
      title: 'Review settlement terms',
      description: 'Analyze proposed settlement and prepare recommendations',
      caseId: '1000HILLS-2025-003',
      caseName: 'Property Settlement',
      dueDate: '2025-12-22',
      priority: 'High',
      status: 'pending',
      assignedTo: 'Mike Johnson'
    },
    {
      id: 4,
      title: 'Submit evidence documents',
      description: 'Compile and submit client-provided evidence',
      caseId: '1000HILLS-2025-007',
      caseName: 'Litigation Case',
      dueDate: '2025-12-23',
      priority: 'Medium',
      status: 'pending',
      assignedTo: 'Sarah Davis'
    },
    {
      id: 5,
      title: 'Follow up with opposing counsel',
      description: 'Discuss settlement terms and negotiate conditions',
      caseId: '1000HILLS-2025-002',
      caseName: 'Mediation Case',
      dueDate: '2025-12-24',
      priority: 'Low',
      status: 'completed',
      assignedTo: 'You'
    },
  ];

  const stats = [
    { label: 'All Tasks', value: '15', icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: '7', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'In Progress', value: '3', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed', value: '5', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[priority as keyof typeof styles] || styles['Medium'];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
    };
    return styles[status as keyof typeof styles] || styles['pending'];
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date('2025-12-19');
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks & Deadlines</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and upcoming deadlines</p>
          </div>
          <Button className="bg-1000-blue hover:bg-1000-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-1000-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-1000-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('in-progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'in-progress'
                    ? 'bg-1000-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-1000-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const daysUntil = getDaysUntilDue(task.dueDate);
            const isOverdue = daysUntil < 0;
            const isDueToday = daysUntil === 0;
            const isDueSoon = daysUntil > 0 && daysUntil <= 2;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-colors ${
                  isOverdue
                    ? 'border-red-300 bg-red-50'
                    : isDueToday
                    ? 'border-orange-300 bg-orange-50'
                    : isDueSoon
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 hover:border-1000-blue'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-mono text-1000-blue font-medium">{task.caseId}</span>
                      <span>•</span>
                      <span>{task.caseName}</span>
                      <span>•</span>
                      <span>Assigned to: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${
                      isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      Due: {task.dueDate}
                      {isOverdue && ' (Overdue)'}
                      {isDueToday && ' (Today)'}
                      {!isOverdue && !isDueToday && ` (${daysUntil} days)`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <Button size="sm" className="bg-1000-green hover:bg-1000-green/90">
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No tasks found for this filter</p>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default function ManagerTasks() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerTasksContent />
    </ProtectedRoute>
  );
}
