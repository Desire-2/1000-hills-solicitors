'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import apiService from '@/lib/api';
import { formatDate } from '@/lib/date-utils';

interface Case {
  id: number;
  case_id: string;
  title: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
  assigned_to?: {
    name: string;
  };
}

function CasesListContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCases();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data && Array.isArray(response.data)) {
        setCases(response.data as Case[]);
      }
    } catch (err) {
      setError('Failed to load cases');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.case_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
      'NEW': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'IN_REVIEW': 'bg-purple-100 text-purple-700 border-purple-200',
      'AWAITING_CLIENT': 'bg-orange-100 text-orange-700 border-orange-200',
      'RESOLVED': 'bg-green-100 text-green-700 border-green-200',
      'CLOSED': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.NEW;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'URGENT': 'bg-red-100 text-red-700',
      'HIGH': 'bg-orange-100 text-orange-700',
      'MEDIUM': 'bg-yellow-100 text-yellow-700',
      'LOW': 'bg-green-100 text-green-700',
    };
    return styles[priority as keyof typeof styles] || styles.MEDIUM;
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cases...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchCases} className="bg-1000-blue hover:bg-1000-blue/90">
              Try Again
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
          <p className="text-gray-600 mt-1">Manage and track all your legal cases</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Cases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'NEW').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'RESOLVED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AWAITING_CLIENT">Awaiting Client</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/submit-case">Submit New Case</Link>
            </Button>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-1000-blue transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-1000-blue font-semibold">{caseItem.case_id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <strong>Category:</strong> {caseItem.category.replace('_', ' ')}
                    </span>
                    {caseItem.assigned_to && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <strong>Attorney:</strong> {caseItem.assigned_to.name}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <strong>Created:</strong> {formatDate(caseItem.created_at)}
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/dashboard/cases/${caseItem.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">No cases found matching your criteria</p>
            <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/submit-case">Submit Your First Case</Link>
            </Button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export default function CasesList() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <CasesListContent />
    </ProtectedRoute>
  );
}
