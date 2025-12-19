'use client';

import { Button } from '@/components/ui/button';
import { FileText, Image, Layout, Edit, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

function ContentEditorDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPages: 0,
    draftPosts: 0,
    publishedPosts: 0,
    pendingReview: 0,
  });

  useEffect(() => {
    // TODO: Fetch real data from API
    setStats({
      totalPages: 12,
      draftPosts: 5,
      publishedPosts: 24,
      pendingReview: 3,
    });
  }, []);

  const recentContent = [
    { id: 1, title: 'Understanding Property Law in Rwanda', type: 'Blog Post', status: 'Published', lastEdited: '2 hours ago' },
    { id: 2, title: 'About Us Page Update', type: 'Page', status: 'Draft', lastEdited: '5 hours ago' },
    { id: 3, title: 'New Service: Immigration Law', type: 'Service', status: 'Pending Review', lastEdited: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Published: 'bg-green-100 text-green-800',
      Draft: 'bg-gray-100 text-gray-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Content Editor Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/editor/content">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Content
                </Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/editor/content/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPages}</p>
              </div>
              <Layout className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Draft Posts</p>
                <p className="text-3xl font-bold text-gray-600">{stats.draftPosts}</p>
              </div>
              <Edit className="w-12 h-12 text-gray-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Published Posts</p>
                <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
              </div>
              <FileText className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</p>
              </div>
              <Eye className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/editor/blog/new">
                <FileText className="w-4 h-4 mr-2" />
                New Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/editor/pages">
                <Layout className="w-4 h-4 mr-2" />
                Edit Pages
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/editor/media">
                <Image className="w-4 h-4 mr-2" />
                Media Library
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/editor/services">
                <Edit className="w-4 h-4 mr-2" />
                Manage Services
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Content Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Content</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Edited
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.lastEdited}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <Link href={`/editor/content/${item.id}/edit`} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                      <Link href={`/editor/content/${item.id}/preview`} className="text-gray-600 hover:text-gray-800">
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Keep blog posts between 800-1200 words for optimal engagement</li>
            <li>Always add relevant images to improve reader experience</li>
            <li>Use clear headings and subheadings for better readability</li>
            <li>Submit content for review before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ContentEditorDashboard() {
  return (
    <ProtectedRoute requiredRole={Role.CONTENT_EDITOR}>
      <ContentEditorDashboardContent />
    </ProtectedRoute>
  );
}
