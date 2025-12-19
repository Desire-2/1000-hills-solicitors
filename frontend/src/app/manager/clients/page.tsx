'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, Plus, Eye, Edit, MessageSquare } from 'lucide-react';
import { useState } from 'react';

function ManagerClientsContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+27 82 123 4567',
      activeCases: 2,
      totalCases: 5,
      status: 'Active',
      joinedDate: '2024-06-15'
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+27 82 234 5678',
      activeCases: 1,
      totalCases: 3,
      status: 'Active',
      joinedDate: '2024-08-20'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      email: 'emily.j@email.com',
      phone: '+27 82 345 6789',
      activeCases: 1,
      totalCases: 2,
      status: 'Active',
      joinedDate: '2024-11-10'
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.b@email.com',
      phone: '+27 82 456 7890',
      activeCases: 1,
      totalCases: 1,
      status: 'Active',
      joinedDate: '2025-01-05'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+27 82 567 8901',
      activeCases: 0,
      totalCases: 2,
      status: 'Inactive',
      joinedDate: '2024-03-12'
    },
  ];

  const stats = [
    { label: 'Total Clients', value: '38', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Clients', value: '32', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'New This Month', value: '5', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Inactive', value: '6', color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">View and manage client information</p>
          </div>
          <Button className="bg-1000-blue hover:bg-1000-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-1000-blue transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-1000-blue rounded-full flex items-center justify-center text-white text-lg font-medium">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Active Cases</p>
                  <p className="text-xl font-bold text-1000-blue">{client.activeCases}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Cases</p>
                  <p className="text-xl font-bold text-gray-900">{client.totalCases}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">Client since {client.joinedDate}</p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">No clients found matching your search</p>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default function ManagerClients() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerClientsContent />
    </ProtectedRoute>
  );
}
