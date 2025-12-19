'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Calendar, User, AlertCircle, FileText, 
  MessageSquare, Clock, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';
import apiService from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/date-utils';

interface CaseDetail {
  id: number;
  case_id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
  client: {
    id: number;
    name: string;
    email: string;
  };
  assigned_to?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Note {
  id: number;
  content: string;
  is_private: boolean;
  author: {
    id: number;
    name: string;
    role: string;
  };
  created_at: string;
}

function CaseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string;
  
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail();
      fetchNotes();
    }
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCase(parseInt(caseId));
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setCaseDetail(response.data as CaseDetail);
      }
    } catch (err) {
      setError('Failed to load case details');
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await apiService.getCaseNotes(parseInt(caseId));
      
      if (response.data && Array.isArray(response.data)) {
        setNotes(response.data as Note[]);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

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
              <p className="text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !caseDetail) {
    return (
      <ClientLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error || 'Case not found'}</p>
            <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/dashboard/cases">Back to Cases</Link>
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
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/dashboard/cases">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg text-1000-blue font-semibold">
                  {caseDetail.case_id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(caseDetail.status)}`}>
                  {caseDetail.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(caseDetail.priority)}`}>
                  {caseDetail.priority}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{caseDetail.title}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Case Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{caseDetail.description}</p>
            </div>

            {/* Notes/Updates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Updates & Notes
              </h2>
              
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No updates yet</p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-1000-blue pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{note.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(note.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium text-gray-900">
                    {caseDetail.category.replace('_', ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Assigned Attorney
                  </p>
                  <p className="font-medium text-gray-900">
                    {caseDetail.assigned_to ? caseDetail.assigned_to.name : 'Not assigned yet'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatDate(caseDetail.created_at)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last Updated
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatDate(caseDetail.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button className="w-full bg-1000-blue hover:bg-1000-blue/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Attorney
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function CaseDetailPage() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <CaseDetailContent />
    </ProtectedRoute>
  );
}
