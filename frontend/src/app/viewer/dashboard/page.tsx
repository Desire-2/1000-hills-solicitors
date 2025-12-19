'use client';

import { Button } from '@/components/ui/button';
import { FileText, Eye, Search, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

function ViewerDashboardContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const recentlyViewed = [
    { id: 1, caseId: '1000HILLS-2025-001', title: 'Contract Dispute', viewedAt: '2 hours ago' },
    { id: 2, caseId: '1000HILLS-2025-015', title: 'Property Claim', viewedAt: '5 hours ago' },
    { id: 3, caseId: '1000HILLS-2025-023', title: 'Employment Matter', viewedAt: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Viewer Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Eye className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">Read-Only Access</h3>
              <p className="text-sm text-blue-800">
                You have view-only permissions. You can browse and search content but cannot make changes.
                Contact an administrator if you need additional permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Search Cases & Documents</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by case ID, title, or client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="justify-start h-auto py-4">
              <Link href="/viewer/cases">
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="font-semibold">All Cases</span>
                  </div>
                  <p className="text-xs text-gray-600">Browse all case records</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start h-auto py-4">
              <Link href="/viewer/documents">
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <Download className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Documents</span>
                  </div>
                  <p className="text-xs text-gray-600">View and download files</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start h-auto py-4">
              <Link href="/viewer/reports">
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <Eye className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Reports</span>
                  </div>
                  <p className="text-xs text-gray-600">View generated reports</p>
                </div>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recently Viewed</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viewed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentlyViewed.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.caseId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.viewedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/viewer/cases/${item.id}`} className="text-blue-600 hover:text-blue-800">
                        View Details
                      </Link>
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

export default function ViewerDashboard() {
  return (
    <ProtectedRoute requiredRole={Role.VIEWER}>
      <ViewerDashboardContent />
    </ProtectedRoute>
  );
}
