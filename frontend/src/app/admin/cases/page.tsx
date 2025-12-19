'use client';

import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import apiService from '@/lib/api';

interface Case {
  id: number;
  case_id: string;
  title: string;
  status: string;
  priority: string;
  client: {
    name: string;
  };
}

export default function AdminCasesManagement() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminCases();
      
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

  const casesByStatus = {
    NEW: cases.filter(c => c.status === 'NEW'),
    IN_PROGRESS: cases.filter(c => c.status === 'IN_PROGRESS'),
    IN_REVIEW: cases.filter(c => c.status === 'IN_REVIEW'),
    RESOLVED: cases.filter(c => c.status === 'RESOLVED'),
  };

  const CaseCard = ({ caseItem }: { caseItem: Case }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer">
      <p className="text-xs font-mono text-1000-blue mb-2">{caseItem.case_id}</p>
      <h3 className="font-semibold text-sm mb-2">{caseItem.title}</h3>
      <p className="text-xs text-gray-600 mb-3">{caseItem.client?.name || 'Client not assigned'}</p>
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${
          caseItem.priority === 'URGENT' || caseItem.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
          caseItem.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {caseItem.priority}
        </span>
        <Link href={`/admin/cases/${caseItem.id}`} className="text-1000-blue hover:underline text-xs">
          Manage
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cases...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={fetchCases} className="bg-1000-blue hover:bg-1000-blue/90">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Case Management</h1>
        <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
          <Link href="/admin/cases/new">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Controls */}
      <div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-1000-blue"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'kanban' ? 'default' : 'outline'}
                onClick={() => setView('kanban')}
                className={view === 'kanban' ? 'bg-1000-blue hover:bg-1000-blue/90' : ''}
              >
                Kanban
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-1000-blue hover:bg-1000-blue/90' : ''}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(casesByStatus).map(([status, cases]: any) => (
              <div key={status} className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-bold mb-4 text-sm uppercase text-gray-700">
                  {status.replace('_', ' ')} ({cases.length})
                </h2>
                <div className="space-y-3">
                  {cases.map((caseItem: any) => (
                    <CaseCard key={caseItem.id} caseItem={caseItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Case ID</th>
                    <th className="text-left py-4 px-6 font-semibold">Title</th>
                    <th className="text-left py-4 px-6 font-semibold">Client</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Priority</th>
                    <th className="text-left py-4 px-6 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(casesByStatus).map(([status, cases]: any) =>
                    cases.map((caseItem: any) => (
                      <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-mono text-sm text-1000-blue">{caseItem.caseId}</td>
                        <td className="py-4 px-6">{caseItem.title}</td>
                        <td className="py-4 px-6">{caseItem.client}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded text-sm font-semibold bg-blue-100 text-1000-blue">
                            {status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            caseItem.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            caseItem.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {caseItem.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/cases/${caseItem.id}`}>Manage</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
