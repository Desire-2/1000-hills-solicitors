'use client';

import { useEffect, useState } from 'react';
import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, Case, CaseStatus, Priority } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Statistics {
  total: number;
  pending: number;
  in_progress: number;
  awaiting_client: number;
  resolved: number;
  closed: number;
  my_cases?: number;
  by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

function ManagerDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeCases, setActiveCases] = useState<Case[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Fetch statistics
      const statsResponse = await apiService.getCaseStatistics();
      if (statsResponse.error) {
        throw new Error(statsResponse.error);
      }
      
      // Fetch active cases
      const casesResponse = await apiService.getAdminCases();
      if (casesResponse.error) {
        throw new Error(casesResponse.error);
      }
      
      setStatistics(statsResponse.data as Statistics);
      
      // Filter and sort cases - get top 3 active cases (in progress or pending)
      const cases: Case[] = (casesResponse.data as Case[]) || [];
      const filteredCases = cases
        .filter(c => c.status === CaseStatus.IN_PROGRESS || c.status === CaseStatus.PENDING)
        .sort((a, b) => {
          // Sort by priority (urgent > high > medium > low) and then by date
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })
        .slice(0, 3);
      
      setActiveCases(filteredCases);
      setLastRefresh(new Date());
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Calculate progress percentage for a case (simplified logic)
  const calculateProgress = (caseItem: Case): number => {
    switch (caseItem.status) {
      case CaseStatus.PENDING:
        return 20;
      case CaseStatus.IN_PROGRESS:
        return 50;
      case CaseStatus.AWAITING_CLIENT:
        return 65;
      case CaseStatus.RESOLVED:
        return 90;
      case CaseStatus.CLOSED:
        return 100;
      default:
        return 0;
    }
  };

  // Generate stats cards from real data
  const stats = statistics ? [
    {
      label: 'Active Cases',
      value: (statistics.in_progress + statistics.pending).toString(),
      change: statistics.my_cases ? `${statistics.my_cases} assigned to me` : 'No assignments',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Cases',
      value: statistics.total.toString(),
      change: `${statistics.resolved} resolved`,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'High Priority',
      value: (statistics.by_priority.high + statistics.by_priority.urgent).toString(),
      change: `${statistics.by_priority.urgent} urgent`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      label: 'Completion Rate',
      value: statistics.total > 0 ? `${Math.round((statistics.resolved / statistics.total) * 100)}%` : '0%',
      change: `${statistics.closed} closed`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ] : [];
  // Generate chart data from statistics
  const casesByStatus = statistics ? [
    { name: 'Pending', count: statistics.pending, color: '#10b981' },
    { name: 'In Progress', count: statistics.in_progress, color: '#3b82f6' },
    { name: 'Awaiting Client', count: statistics.awaiting_client, color: '#f59e0b' },
    { name: 'Resolved', count: statistics.resolved, color: '#8b5cf6' },
    { name: 'Closed', count: statistics.closed, color: '#6b7280' },
  ] : [];

  const priorityData = statistics ? [
    { name: 'Low', count: statistics.by_priority.low },
    { name: 'Medium', count: statistics.by_priority.medium },
    { name: 'High', count: statistics.by_priority.high },
    { name: 'Urgent', count: statistics.by_priority.urgent },
  ] : [];

  const getStatusBadge = (status: CaseStatus) => {
    const styles = {
      [CaseStatus.PENDING]: 'bg-green-100 text-green-800',
      [CaseStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [CaseStatus.AWAITING_CLIENT]: 'bg-yellow-100 text-yellow-800',
      [CaseStatus.RESOLVED]: 'bg-purple-100 text-purple-800',
      [CaseStatus.CLOSED]: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: Priority) => {
    const styles = {
      [Priority.URGENT]: 'bg-red-100 text-red-800',
      [Priority.HIGH]: 'bg-orange-100 text-orange-800',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [Priority.LOW]: 'bg-green-100 text-green-800',
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: CaseStatus): string => {
    return status.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ManagerLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your cases and activities</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
              </span>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-3">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-1000-blue" />
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
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
        )}

        {/* Main Content Grid */}
        {!loading && !error && (
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
              {activeCases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active cases at the moment</p>
                </div>
              ) : (
                activeCases.map((caseItem) => {
                  const progress = calculateProgress(caseItem);
                  return (
                    <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:border-1000-blue transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-1000-blue font-semibold">{caseItem.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                              {caseItem.priority}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                          <p className="text-sm text-gray-600">Client: {caseItem.client?.name || 'Unassigned'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                          {formatStatus(caseItem.status)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-1000-blue h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Created: {formatDistanceToNow(new Date(caseItem.created_at), { addSuffix: true })}
                          </span>
                          <Button asChild variant="ghost" size="sm" className="text-1000-blue">
                            <Link href={`/manager/cases/${caseItem.id}`}>
                              View <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-1000-blue" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="space-y-3">
                {statistics && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">High Priority</span>
                      <span className="font-semibold text-red-600">
                        {statistics.by_priority.high + statistics.by_priority.urgent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Awaiting Client</span>
                      <span className="font-semibold text-yellow-600">{statistics.awaiting_client}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <span className="font-semibold text-blue-600">{statistics.in_progress}</span>
                    </div>
                    {statistics.my_cases !== undefined && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">My Cases</span>
                        <span className="font-bold text-1000-blue">{statistics.my_cases}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <Button asChild variant="outline" className="w-full mt-4" size="sm">
                <Link href="/manager/cases">View All Cases</Link>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link href="/manager/cases">
                    <Briefcase className="w-4 h-4 mr-2" />
                    All Cases
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link href="/manager/analytics">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start" size="sm">
                  <Link href="/manager/users">
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        )}\n\n        {/* Charts Section */}
        {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cases by Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cases by Status</h2>
            {casesByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={casesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e40af" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Cases by Priority */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cases by Priority</h2>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => {
                      const colors = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];
                      return <Bar key={`bar-${index}`} dataKey="count" fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
        )}
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
