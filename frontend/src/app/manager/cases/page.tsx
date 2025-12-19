'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, Eye, Edit, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function ManagerCasesContent() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const cases = [
    {
      id: 1,
      caseId: '1000HILLS-2025-001',
      title: 'Contract Dispute Resolution',
      client: 'Sarah Williams',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'You',
      lastUpdate: '2 hours ago',
      progress: 65
    },
    {
      id: 2,
      caseId: '1000HILLS-2025-002',
      title: 'Property Settlement',
      client: 'John Smith',
      status: 'Under Review',
      priority: 'Medium',
      assignedTo: 'Mike Johnson',
      lastUpdate: '5 hours ago',
      progress: 40
    },
    {
      id: 3,
      caseId: '1000HILLS-2025-003',
      title: 'Employment Mediation',
      client: 'Emily Johnson',
      status: 'New',
      priority: 'High',
      assignedTo: 'Unassigned',
      lastUpdate: '1 day ago',
      progress: 20
    },
    {
      id: 4,
      caseId: '1000HILLS-2025-004',
      title: 'Business Contract Review',
      client: 'David Brown',
      status: 'In Progress',
      priority: 'Low',
      assignedTo: 'Sarah Davis',
      lastUpdate: '3 hours ago',
      progress: 55
    },
    {
      id: 5,
      caseId: '1000HILLS-2025-005',
      title: 'Divorce Settlement',
      client: 'Lisa Anderson',
      status: 'Resolved',
      priority: 'Medium',
      assignedTo: 'You',
      lastUpdate: '2 days ago',
      progress: 100
    },
  ];

  const stats = [
    { label: 'Total Cases', value: '45', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: '12', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Under Review', value: '5', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Resolved', value: '28', color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'In Progress': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'New': 'bg-green-100 text-green-800',
      'Resolved': 'bg-gray-100 text-gray-800',
      'Closed': 'bg-gray-100 text-gray-600',
    };
    return styles[status as keyof typeof styles] || styles['New'];
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800',
    };
    return styles[priority as keyof typeof styles] || styles['Medium'];
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all cases</p>
          </div>
          <Button className="bg-1000-blue hover:bg-1000-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Cases List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-1000-blue font-semibold">{caseItem.caseId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{caseItem.title}</p>
                        <p className="text-xs text-gray-500">{caseItem.lastUpdate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {caseItem.client}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {caseItem.assignedTo === 'Unassigned' ? (
                          <button className="text-1000-blue hover:underline flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />
                            Assign
                          </button>
                        ) : (
                          <span>{caseItem.assignedTo}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-1000-blue h-2 rounded-full"
                            style={{ width: `${caseItem.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{caseItem.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}

export default function ManagerCases() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerCasesContent />
    </ProtectedRoute>
  );
}
