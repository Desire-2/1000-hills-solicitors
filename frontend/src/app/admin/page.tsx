'use client';

import { Button } from '@/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, FileText, Users, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

function AdminDashboardContent() {
  const { user } = useAuth();

  // Mock analytics data
  const caseData = [
    { month: 'Jan', cases: 12 },
    { month: 'Feb', cases: 19 },
    { month: 'Mar', cases: 15 },
    { month: 'Apr', cases: 22 },
    { month: 'May', cases: 18 },
    { month: 'Jun', cases: 25 },
  ];

  const statusData = [
    { name: 'New', value: 8, color: '#FCD34D' },
    { name: 'In Progress', value: 12, color: '#1E40AF' },
    { name: 'Resolved', value: 35, color: '#10B981' },
  ];

  const recentCases = [
    { id: 1, caseId: '1000HILLS-2025-001', title: 'Contract Dispute', client: 'John Doe', status: 'IN_PROGRESS', priority: 'HIGH' },
    { id: 2, caseId: '1000HILLS-2025-002', title: 'Property Claim', client: 'Jane Smith', status: 'NEW', priority: 'MEDIUM' },
    { id: 3, caseId: '1000HILLS-2025-003', title: 'Employment Matter', client: 'Bob Johnson', status: 'RESOLVED', priority: 'LOW' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/cases">Manage Cases</Link>
            </Button>
            <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/admin/content">Content Management</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Cases</p>
                <p className="text-3xl font-bold text-1000-blue">55</p>
              </div>
              <FileText className="w-12 h-12 text-1000-blue/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Cases</p>
                <p className="text-3xl font-bold text-1000-green">20</p>
              </div>
              <TrendingUp className="w-12 h-12 text-1000-green/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Registered Clients</p>
                <p className="text-3xl font-bold text-1000-gold">142</p>
              </div>
              <Users className="w-12 h-12 text-1000-gold/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Actions</p>
                <p className="text-3xl font-bold text-red-600">5</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-600/20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cases Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Cases Over Time (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={caseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#1E40AF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Case Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Case Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Cases</h2>
            <Button asChild size="sm" className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/admin/cases">View All</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Case ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-1000-blue">{caseItem.caseId}</td>
                    <td className="py-3 px-4">{caseItem.title}</td>
                    <td className="py-3 px-4">{caseItem.client}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        caseItem.status === 'IN_PROGRESS' ? 'bg-blue-100 text-1000-blue' :
                        caseItem.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {caseItem.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        caseItem.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        caseItem.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/cases/${caseItem.id}`}>Manage</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole={Role.SUPER_ADMIN}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
