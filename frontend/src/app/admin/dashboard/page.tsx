'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

function SuperAdminDashboardContent() {
  // Mock data - Replace with real API calls
  const [stats, setStats] = useState({
    totalUsers: 342,
    usersGrowth: 12.5,
    activeCases: 48,
    casesGrowth: -3.2,
    totalRevenue: 125000,
    revenueGrowth: 18.7,
    pendingActions: 12,
    actionsGrowth: -25.0,
  });

  const monthlyData = [
    { month: 'Jan', cases: 32, users: 280, revenue: 95000 },
    { month: 'Feb', cases: 38, users: 295, revenue: 102000 },
    { month: 'Mar', cases: 35, users: 310, revenue: 108000 },
    { month: 'Apr', cases: 42, users: 318, revenue: 112000 },
    { month: 'May', cases: 45, users: 328, revenue: 118000 },
    { month: 'Jun', cases: 48, users: 342, revenue: 125000 },
  ];

  const caseStatusData = [
    { name: 'New', value: 12, color: '#FCD34D' },
    { name: 'In Progress', value: 28, color: '#1E40AF' },
    { name: 'Awaiting Client', value: 8, color: '#F59E0B' },
    { name: 'Resolved', value: 85, color: '#10B981' },
    { name: 'Closed', value: 42, color: '#6B7280' },
  ];

  const userRoleData = [
    { name: 'Clients', value: 285, color: '#1E40AF' },
    { name: 'Case Managers', value: 32, color: '#10B981' },
    { name: 'Content Editors', value: 18, color: '#F59E0B' },
    { name: 'Viewers', value: 7, color: '#6B7280' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Smith', action: 'Created new case', case: 'Property Dispute', time: '5 min ago', type: 'create' },
    { id: 2, user: 'Sarah Johnson', action: 'Updated case status', case: 'Contract Review', time: '12 min ago', type: 'update' },
    { id: 3, user: 'Mike Davis', action: 'Assigned case', case: 'Employment Claim', time: '25 min ago', type: 'assign' },
    { id: 4, user: 'Emily Brown', action: 'Resolved case', case: 'Consultation', time: '1 hour ago', type: 'resolve' },
    { id: 5, user: 'Admin', action: 'System backup completed', case: '', time: '2 hours ago', type: 'system' },
  ];

  const urgentCases = [
    { id: 1, caseId: '1000HILLS-2025-045', title: 'Urgent Litigation Matter', client: 'ABC Corp', deadline: '2 days', priority: 'URGENT' },
    { id: 2, caseId: '1000HILLS-2025-042', title: 'Contract Deadline', client: 'XYZ Ltd', deadline: '3 days', priority: 'HIGH' },
    { id: 3, caseId: '1000HILLS-2025-038', title: 'Court Filing Required', client: 'John Doe', deadline: '5 days', priority: 'HIGH' },
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', cases: 42, rating: 4.9, avatar: 'SJ' },
    { name: 'Mike Davis', cases: 38, rating: 4.8, avatar: 'MD' },
    { name: 'Emily Brown', cases: 35, rating: 4.7, avatar: 'EB' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-1000-blue to-blue-600 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend === 'up' ? (
          <div className="flex items-center text-green-600">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{change}%</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
        <span className="text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Complete system overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.usersGrowth}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          change={stats.casesGrowth}
          icon={Briefcase}
          trend="down"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          change={stats.revenueGrowth}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Pending Actions"
          value={stats.pendingActions}
          change={stats.pendingActions}
          icon={AlertCircle}
          trend="down"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="cases" stroke="#1E40AF" fillOpacity={1} fill="url(#colorCases)" name="Cases" />
              <Area type="monotone" dataKey="users" stroke="#10B981" fillOpacity={1} fill="url(#colorUsers)" name="Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Case Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {caseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Urgent Cases */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Urgent Cases</h2>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {urgentCases.map((caseItem) => (
              <div key={caseItem.id} className="border border-red-200 bg-red-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{caseItem.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{caseItem.caseId}</p>
                    <p className="text-xs text-gray-600">Client: {caseItem.client}</p>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                    {caseItem.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">View All Urgent Cases</Button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  activity.type === 'create' ? 'bg-green-100 text-green-600' :
                  activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'assign' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'resolve' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.user.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  {activity.case && (
                    <p className="text-xs text-gray-600 truncate">{activity.case}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-gradient-to-br from-1000-blue to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {performer.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{performer.name}</p>
                  <p className="text-xs text-gray-600">{performer.cases} cases handled</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">★ {performer.rating}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">View All Team</Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution by Role</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userRoleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1E40AF">
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-1000-blue hover:bg-1000-blue/90 h-auto py-4 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button className="bg-1000-green hover:bg-1000-green/90 h-auto py-4 flex-col gap-2">
              <Briefcase className="w-6 h-6" />
              <span>View Cases</span>
            </Button>
            <Button className="bg-1000-gold hover:bg-1000-gold/90 h-auto py-4 flex-col gap-2">
              <FileText className="w-6 h-6" />
              <span>Reports</span>
            </Button>
            <Button className="bg-gray-700 hover:bg-gray-800 h-auto py-4 flex-col gap-2">
              <Activity className="w-6 h-6" />
              <span>System Logs</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboardContent;
