'use client';

import ClientLayout from '@/components/client/ClientLayout';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar, ArrowRight, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { Role, Case, CaseStatus, Priority } from '@/lib/types';
import apiService from '@/lib/api';

interface DashboardStats {
  total: number;
  pending?: number;
  in_progress?: number;
  awaiting_client?: number;
  resolved?: number;
  closed?: number;
  by_priority?: {
    low?: number;
    medium?: number;
    high?: number;
    urgent?: number;
  };
}

interface Activity {
  id: number;
  action: string;
  case_title: string;
  time: string;
  type: 'update' | 'message' | 'document';
}

function DashboardContent() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch cases and statistics in parallel
      const [casesResponse, statsResponse] = await Promise.all([
        apiService.getCases(),
        apiService.getCaseStatistics(),
      ]);

      if (casesResponse.error) {
        // Check if it's a network error
        if (casesResponse.error.includes('Failed to fetch') || casesResponse.error.includes('Network error')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5001');
        }
        throw new Error(casesResponse.error);
      }

      if (statsResponse.error) {
        console.warn('Failed to fetch statistics:', statsResponse.error);
        // Don't throw error for stats, just log it
      }

      setCases((casesResponse.data as Case[]) || []);
      setStats((statsResponse.data as DashboardStats) || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700';
      case CaseStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700';
      case CaseStatus.AWAITING_CLIENT:
        return 'bg-orange-100 text-orange-700';
      case CaseStatus.RESOLVED:
        return 'bg-green-100 text-green-700';
      case CaseStatus.CLOSED:
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'bg-red-100 text-red-700';
      case Priority.HIGH:
        return 'bg-orange-100 text-orange-700';
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-700';
      case Priority.LOW:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Calculate dashboard statistics from stats
  const dashboardStats = [
    { 
      label: 'Active Cases', 
      value: stats ? (stats.in_progress || 0) + (stats.pending || 0) : 0, 
      icon: FileText, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Resolved Cases', 
      value: stats?.resolved || 0, 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50' 
    },
    { 
      label: 'Awaiting Action', 
      value: stats?.awaiting_client || 0, 
      icon: Clock, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50' 
    },
    { 
      label: 'Total Cases', 
      value: stats?.total || 0, 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50' 
    },
  ];

  // Get recent cases (limit to 3)
  const recentCases = cases.slice(0, 3);

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

  if (error) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Troubleshooting:</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Ensure the backend server is running on port 5001</li>
                <li>Check that CORS is properly configured</li>
                <li>Verify your authentication token is valid</li>
                <li>Check the browser console for detailed errors</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRefresh} className="bg-1000-blue hover:bg-1000-blue/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6">
        {/* Welcome Section with Refresh */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your cases today</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
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
              <h2 className="text-xl font-semibold text-gray-900">Your Cases</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/cases">View All ({cases.length})</Link>
              </Button>
            </div>
            
            {recentCases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cases Yet</h3>
                <p className="text-gray-600 mb-6">Get started by submitting your first case</p>
                <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
                  <Link href="/submit-case">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit New Case
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {recentCases.map((caseItem) => (
                    <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:border-1000-blue transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-sm text-1000-blue font-semibold">
                              CASE-{String(caseItem.id).padStart(4, '0')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                              {caseItem.priority}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                            <span>{caseItem.category.replace(/_/g, ' ')}</span>
                            {caseItem.assigned_to && (
                              <>
                                <span>•</span>
                                <span>Assigned to {caseItem.assigned_to.name || 'Staff'}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Updated {formatDate(caseItem.updated_at)}
                        </span>
                        <Button asChild size="sm" variant="ghost" className="text-1000-blue hover:text-1000-blue/90">
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
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Priority Cases Alert */}
            {stats?.by_priority && (stats.by_priority.urgent || 0) + (stats.by_priority.high || 0) > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">High Priority Cases</h3>
                    <p className="text-sm text-red-700">
                      You have {(stats.by_priority.urgent || 0) + (stats.by_priority.high || 0)} high priority case(s) that need attention
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Case Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Status</h2>
              <div className="space-y-3">
                {stats && (
                  <>
                    {stats.pending !== undefined && stats.pending > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-semibold text-yellow-600">{stats.pending}</span>
                      </div>
                    )}
                    {stats.in_progress !== undefined && stats.in_progress > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">In Progress</span>
                        <span className="font-semibold text-blue-600">{stats.in_progress}</span>
                      </div>
                    )}
                    {stats.awaiting_client !== undefined && stats.awaiting_client > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Awaiting Response</span>
                        <span className="font-semibold text-orange-600">{stats.awaiting_client}</span>
                      </div>
                    )}
                    {stats.resolved !== undefined && stats.resolved > 0 && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Resolved</span>
                        <span className="font-semibold text-green-600">{stats.resolved}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {cases.length > 0 ? (
                  cases.slice(0, 3).map((caseItem) => (
                    <div key={`activity-${caseItem.id}`} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        caseItem.status === CaseStatus.IN_PROGRESS ? 'bg-blue-500' :
                        caseItem.status === CaseStatus.PENDING ? 'bg-yellow-500' :
                        caseItem.status === CaseStatus.RESOLVED ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium truncate">{caseItem.title}</p>
                        <p className="text-xs text-gray-600">Status: {caseItem.status.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(caseItem.updated_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-1000-blue to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button asChild className="w-full bg-white text-1000-blue hover:bg-gray-100" size="sm">
                  <Link href="/submit-case">
                    <Plus className="w-4 h-4 mr-2" />
                    New Case
                  </Link>
                </Button>
                <Button asChild className="w-full bg-white text-1000-blue hover:bg-gray-100" size="sm">
                  <Link href="/dashboard/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Link>
                </Button>
                <Button asChild className="w-full bg-white text-1000-blue hover:bg-gray-100" size="sm">
                  <Link href="/dashboard/documents">
                    <Download className="w-4 h-4 mr-2" />
                    Documents
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team is here to assist you with your legal matters. Feel free to reach out if you have any questions about your cases.
              </p>
              <div className="flex gap-3">
                <Button asChild size="sm" className="bg-1000-blue hover:bg-1000-blue/90">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/messages">Send Message</Link>
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
