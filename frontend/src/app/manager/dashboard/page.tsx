'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ManagerDashboardContent() {
  const stats = [
    {
      label: 'Active Cases',
      value: '12',
      change: '+2 this week',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Clients',
      value: '38',
      change: '+5 this month',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Pending Tasks',
      value: '7',
      change: '3 due today',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      label: 'Completion Rate',
      value: '87%',
      change: '+5% vs last month',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ];

  const activeCases = [
    {
      id: 1,
      caseId: '1000HILLS-2025-001',
      title: 'Contract Dispute Resolution',
      client: 'Sarah Williams',
      status: 'In Progress',
      priority: 'High',
      deadline: '2025-12-25',
      progress: 65
    },
    {
      id: 2,
      caseId: '1000HILLS-2025-003',
      title: 'Property Settlement',
      client: 'John Smith',
      status: 'Under Review',
      priority: 'Medium',
      deadline: '2025-12-30',
      progress: 40
    },
    {
      id: 3,
      caseId: '1000HILLS-2025-005',
      title: 'Employment Mediation',
      client: 'Emily Johnson',
      status: 'New',
      priority: 'High',
      deadline: '2025-12-22',
      progress: 20
    },
  ];

  const upcomingDeadlines = [
    { id: 1, task: 'File court documents', case: '1000HILLS-2025-005', date: '2025-12-20', priority: 'High' },
    { id: 2, task: 'Client meeting preparation', case: '1000HILLS-2025-001', date: '2025-12-21', priority: 'Medium' },
    { id: 3, task: 'Review settlement terms', case: '1000HILLS-2025-003', date: '2025-12-22', priority: 'High' },
  ];

  const recentMessages = [
    { id: 1, from: 'Sarah Williams', message: 'Can we schedule a meeting to discuss the contract?', time: '10 mins ago', unread: true },
    { id: 2, from: 'John Smith', message: 'Thank you for the update on my case.', time: '1 hour ago', unread: false },
    { id: 3, from: 'Emily Johnson', message: 'I have additional documents to share.', time: '2 hours ago', unread: true },
  ];

  const weeklyActivity = [
    { day: 'Mon', cases: 8 },
    { day: 'Tue', cases: 10 },
    { day: 'Wed', cases: 12 },
    { day: 'Thu', cases: 11 },
    { day: 'Fri', cases: 9 },
  ];

  const casesByStatus = [
    { name: 'New', count: 3 },
    { name: 'In Progress', count: 6 },
    { name: 'Under Review', count: 2 },
    { name: 'Resolved', count: 1 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'In Progress': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'New': 'bg-green-100 text-green-800',
      'Resolved': 'bg-gray-100 text-gray-800',
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

  return (
    <ManagerLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Case Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your cases and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              <p className="text-xs text-gray-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Active Cases */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Cases</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/manager/cases">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {activeCases.map((caseItem) => (
                <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:border-1000-blue transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-1000-blue font-semibold">{caseItem.caseId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                      <p className="text-sm text-gray-600">Client: {caseItem.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{caseItem.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-1000-blue h-2 rounded-full transition-all"
                        style={{ width: `${caseItem.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Deadline: {caseItem.deadline}</span>
                      <Button asChild variant="ghost" size="sm" className="text-1000-blue">
                        <Link href={`/manager/cases/${caseItem.id}`}>
                          View <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{deadline.task}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{deadline.case}</p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {deadline.date}
                    </p>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4" size="sm">
                <Link href="/manager/tasks">View All Tasks</Link>
              </Button>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-1000-blue" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
              </div>
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${msg.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900">{msg.from}</p>
                      {msg.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4" size="sm">
                <Link href="/manager/messages">View All Messages</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#1e40af" fillOpacity={1} fill="url(#colorCases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cases by Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cases by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={casesByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}

export default function ManagerDashboard() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerDashboardContent />
    </ProtectedRoute>
  );
}
