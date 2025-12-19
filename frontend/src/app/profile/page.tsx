'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      CLIENT: 'Client',
      CASE_MANAGER: 'Case Manager',
      CONTENT_EDITOR: 'Content Editor',
      SUPER_ADMIN: 'Super Admin',
      VIEWER: 'Viewer',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                {getRoleName(user.role)}
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="border-t pt-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                  {user.email_verified ? (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-xs text-amber-600">⚠ Not verified</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{getRoleName(user.role)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium text-gray-500">#{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" disabled>
              Change Password
              <span className="ml-auto text-xs text-gray-500">Coming soon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              Update Profile Information
              <span className="ml-auto text-xs text-gray-500">Coming soon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              Two-Factor Authentication
              <span className="ml-auto text-xs text-gray-500">Coming soon</span>
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Security Tip:</strong> Never share your password with anyone. Our team will never ask for your password.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
