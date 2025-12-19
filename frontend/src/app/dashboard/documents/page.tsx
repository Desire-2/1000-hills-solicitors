'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Eye, Trash2, Search, Filter, FolderOpen } from 'lucide-react';
import { useState } from 'react';

function DocumentsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const documents = [
    {
      id: 1,
      name: 'Employment Contract.pdf',
      category: 'Contracts',
      size: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2025-01-10',
      caseId: '1000HILLS-2025-001',
      status: 'signed',
    },
    {
      id: 2,
      name: 'Court Filing Documents.pdf',
      category: 'Legal',
      size: '1.8 MB',
      uploadedBy: 'You',
      uploadDate: '2025-01-12',
      caseId: '1000HILLS-2025-001',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Evidence Photos.zip',
      category: 'Evidence',
      size: '15.2 MB',
      uploadedBy: 'You',
      uploadDate: '2025-01-14',
      caseId: '1000HILLS-2025-002',
      status: 'approved',
    },
    {
      id: 4,
      name: 'Settlement Agreement.pdf',
      category: 'Contracts',
      size: '890 KB',
      uploadedBy: 'Mike Davis',
      uploadDate: '2025-01-15',
      caseId: '1000HILLS-2025-002',
      status: 'review',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Documents', count: 12 },
    { id: 'contracts', name: 'Contracts', count: 4 },
    { id: 'legal', name: 'Legal Documents', count: 3 },
    { id: 'evidence', name: 'Evidence', count: 2 },
    { id: 'correspondence', name: 'Correspondence', count: 3 },
  ];

  const stats = [
    { label: 'Total Documents', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Review', value: '3', icon: Eye, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Storage Used', value: '45 MB', icon: FolderOpen, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      signed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category.toLowerCase() === selectedCategory);

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage and access your case documents</p>
          </div>
          <Button className="bg-1000-blue hover:bg-1000-blue/90">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-1000-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className={`text-xs ${
                        selectedCategory === category.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Storage</h3>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">45 MB of 5 GB used</span>
                  <span className="text-gray-900 font-medium">0.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-1000-blue h-2 rounded-full" style={{ width: '0.9%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Documents Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-1000-blue mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">{doc.caseId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{doc.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{doc.size}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{doc.uploadedBy}</p>
                            <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded" title="View">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-600" />
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
        </div>
      </div>
    </ClientLayout>
  );
}

export default function Documents() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <DocumentsContent />
    </ProtectedRoute>
  );
}
