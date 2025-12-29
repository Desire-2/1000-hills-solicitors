'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, CaseStatus, Priority, CaseCategory, Case as CaseType, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Search, Filter, Plus, Eye, Edit, UserPlus, AlertCircle, 
  Download, RefreshCw, X, Check, ChevronDown, ChevronUp,
  ArrowUpDown, Loader2, Mail, Phone, User as UserIcon,
  MessageSquare, Calendar, FileText, Archive, Trash2, Copy, 
  ExternalLink, MoreVertical, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import apiService from '@/lib/api';
import { formatDate } from '@/lib/date-utils';
import { formatDistanceToNow } from 'date-fns';

interface Case extends CaseType {
  case_id?: string;
}

function ManagerCasesContent() {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  
  // Data states
  const [cases, setCases] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // UI states
  const [selectedCases, setSelectedCases] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCaseId, setAssigningCaseId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Action menu state
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    fetchCases();
    fetchUsers();
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
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getCaseManagers();
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data as User[]);
      }
    } catch (err) {
      console.error('Error fetching case managers:', err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCases();
  };

  const handleAssignCase = async () => {
    if (!assigningCaseId || !selectedUserId) return;
    
    try {
      const response = await apiService.updateCase(assigningCaseId, {
        assigned_to_id: selectedUserId
      });
      
      if (response.error) {
        alert('Error assigning case: ' + response.error);
      } else {
        setShowAssignModal(false);
        setAssigningCaseId(null);
        setSelectedUserId(null);
        fetchCases();
      }
    } catch (err) {
      alert('Failed to assign case');
      console.error('Error assigning case:', err);
    }
  };

  const handleBulkStatusUpdate = async (status: CaseStatus) => {
    if (selectedCases.length === 0) return;
    
    const confirmed = confirm(`Update ${selectedCases.length} case(s) to ${status}?`);
    if (!confirmed) return;
    
    try {
      await Promise.all(
        selectedCases.map(caseId => 
          apiService.updateCase(caseId, { status })
        )
      );
      setSelectedCases([]);
      fetchCases();
    } catch (err) {
      alert('Failed to update cases');
      console.error('Error updating cases:', err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCases.length === filteredAndSortedCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredAndSortedCases.map(c => c.id));
    }
  };

  const toggleSelectCase = (caseId: number) => {
    setSelectedCases(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const stats = [
    { label: 'Total Cases', value: cases.length.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: cases.filter(c => c.status === CaseStatus.IN_PROGRESS).length.toString(), color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: cases.filter(c => c.status === CaseStatus.PENDING).length.toString(), color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Resolved', value: cases.filter(c => c.status === CaseStatus.RESOLVED).length.toString(), color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

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

  const formatCategory = (category: CaseCategory): string => {
    return category.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  // Filtering and sorting
  const filteredAndSortedCases = cases
    .filter(c => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.case_id && c.case_id.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesAssigned = assignedFilter === 'all' || 
        (assignedFilter === 'unassigned' && !c.assigned_to_id) ||
        (assignedFilter === 'assigned' && c.assigned_to_id);
      
      return matchesStatus && matchesPriority && matchesCategory && matchesSearch && matchesAssigned;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { [Priority.URGENT]: 0, [Priority.HIGH]: 1, [Priority.MEDIUM]: 2, [Priority.LOW]: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCases.length / itemsPerPage);
  const paginatedCases = filteredAndSortedCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setAssignedFilter('all');
    setSearchQuery('');
  };

  const handleExportCases = () => {
    // Convert cases to CSV format
    const headers = ['Case ID', 'Title', 'Client', 'Category', 'Status', 'Priority', 'Assigned To', 'Created Date'];
    const rows = filteredAndSortedCases.map(c => [
      c.case_id || c.id,
      c.title,
      c.client?.name || 'N/A',
      c.category,
      c.status,
      c.priority,
      c.assigned_to?.name || 'Unassigned',
      formatDate(c.created_at)
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cases-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDuplicateCase = async (caseId: number) => {
    if (!confirm('Create a duplicate of this case?')) return;
    
    const originalCase = cases.find(c => c.id === caseId);
    if (!originalCase) return;
    
    try {
      const response = await apiService.post('/cases', {
        title: `${originalCase.title} (Copy)`,
        category: originalCase.category,
        description: originalCase.description,
        priority: originalCase.priority
      });
      
      if (response.error) {
        alert('Error duplicating case: ' + response.error);
      } else {
        alert('Case duplicated successfully!');
        fetchCases();
      }
    } catch (err) {
      alert('Failed to duplicate case');
    }
  };

  const handleArchiveCase = async (caseId: number) => {
    if (!confirm('Archive this case? It will be marked as closed.')) return;
    
    try {
      const response = await apiService.updateCase(caseId, {
        status: CaseStatus.CLOSED
      });
      
      if (response.error) {
        alert('Error archiving case: ' + response.error);
      } else {
        alert('Case archived successfully!');
        fetchCases();
      }
    } catch (err) {
      alert('Failed to archive case');
    }
  };

  const handleSetPriority = async (caseId: number, priority: Priority) => {
    try {
      const response = await apiService.updateCase(caseId, { priority });
      
      if (response.error) {
        alert('Error updating priority: ' + response.error);
      } else {
        fetchCases();
      }
    } catch (err) {
      alert('Failed to update priority');
    }
  };

  const handleSetStatus = async (caseId: number, status: CaseStatus) => {
    try {
      const response = await apiService.updateCase(caseId, { status });
      
      if (response.error) {
        alert('Error updating status: ' + response.error);
      } else {
        fetchCases();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-1000-blue mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading cases...</p>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchCases} className="bg-1000-blue hover:bg-1000-blue/90">
              Try Again
            </Button>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedCases.length} of {cases.length} cases
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button className="bg-1000-blue hover:bg-1000-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6 border border-gray-200`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters & Search
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Search Bar - Always Visible */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by case ID, title, or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            />
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
              >
                <option value="all">All Statuses</option>
                <option value={CaseStatus.PENDING}>Pending</option>
                <option value={CaseStatus.IN_PROGRESS}>In Progress</option>
                <option value={CaseStatus.AWAITING_CLIENT}>Awaiting Client</option>
                <option value={CaseStatus.RESOLVED}>Resolved</option>
                <option value={CaseStatus.CLOSED}>Closed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
              >
                <option value="all">All Priorities</option>
                <option value={Priority.URGENT}>Urgent</option>
                <option value={Priority.HIGH}>High</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.LOW}>Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
              >
                <option value="all">All Categories</option>
                {Object.values(CaseCategory).map(cat => (
                  <option key={cat} value={cat}>{formatCategory(cat)}</option>
                ))}
              </select>

              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
              >
                <option value="all">All Assignments</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort as 'date' | 'priority' | 'status');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="priority-asc">Priority: High to Low</option>
                <option value="priority-desc">Priority: Low to High</option>
                <option value="status-asc">Status: A-Z</option>
                <option value="status-desc">Status: Z-A</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCases.length > 0 && (
          <div className="bg-1000-blue text-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">
              {selectedCases.length} case(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-1000-blue hover:bg-gray-100"
                onClick={() => handleBulkStatusUpdate(CaseStatus.IN_PROGRESS)}
              >
                Mark In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-1000-blue hover:bg-gray-100"
                onClick={() => handleBulkStatusUpdate(CaseStatus.RESOLVED)}
              >
                Mark Resolved
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-1000-blue hover:bg-gray-100"
                onClick={handleExportCases}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-1000-blue hover:bg-gray-100"
                onClick={() => setSelectedCases([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Quick Export Button */}
        {filteredAndSortedCases.length > 0 && selectedCases.length === 0 && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCases}
            >
              <Download className="w-4 h-4 mr-2" />
              Export {filteredAndSortedCases.length} Cases
            </Button>
          </div>
        )}

        {/* Cases List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No cases found matching your filters
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map((caseItem) => {
                    const progress = calculateProgress(caseItem);
                    return (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCases.includes(caseItem.id)}
                            onChange={() => toggleSelectCase(caseItem.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-1000-blue font-semibold">
                            {caseItem.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">{caseItem.title}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {caseItem.client?.name || 'Unknown Client'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(caseItem.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatCategory(caseItem.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                            {formatStatus(caseItem.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}>
                            {caseItem.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {!caseItem.assigned_to ? (
                              <button 
                                onClick={() => {
                                  setAssigningCaseId(caseItem.id);
                                  setShowAssignModal(true);
                                }}
                                className="text-1000-blue hover:underline flex items-center gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                Assign
                              </button>
                            ) : (
                              <div>
                                <p className="font-medium text-gray-900">{caseItem.assigned_to?.name || 'Unknown'}</p>
                                <button
                                  onClick={() => {
                                    setAssigningCaseId(caseItem.id);
                                    setShowAssignModal(true);
                                  }}
                                  className="text-xs text-1000-blue hover:underline"
                                >
                                  Reassign
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-1000-blue h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/manager/cases/${caseItem.id}`}>
                              <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </Link>
                            
                            {/* More Actions Dropdown */}
                            <div className="relative">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => setActionMenuOpen(actionMenuOpen === caseItem.id ? null : caseItem.id)}
                                title="More Actions"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                              
                              {actionMenuOpen === caseItem.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActionMenuOpen(null)}
                                  ></div>
                                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <Link href={`/manager/cases/${caseItem.id}`}>
                                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-gray-600" />
                                        View Details
                                      </button>
                                    </Link>
                                    
                                    <Link href={`/manager/cases/${caseItem.id}`}>
                                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-600" />
                                        Message Client
                                      </button>
                                    </Link>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        setAssigningCaseId(caseItem.id);
                                        setShowAssignModal(true);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <UserPlus className="w-4 h-4 text-gray-600" />
                                      {caseItem.assigned_to ? 'Reassign Case' : 'Assign Case'}
                                    </button>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    <div className="px-4 py-1">
                                      <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                                    </div>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetStatus(caseItem.id, CaseStatus.PENDING);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <Clock className="w-4 h-4 text-yellow-600" />
                                      <span className={caseItem.status === CaseStatus.PENDING ? 'font-semibold' : ''}>
                                        Pending
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetStatus(caseItem.id, CaseStatus.IN_PROGRESS);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <RefreshCw className="w-4 h-4 text-blue-600" />
                                      <span className={caseItem.status === CaseStatus.IN_PROGRESS ? 'font-semibold' : ''}>
                                        In Progress
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetStatus(caseItem.id, CaseStatus.AWAITING_CLIENT);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <UserIcon className="w-4 h-4 text-purple-600" />
                                      <span className={caseItem.status === CaseStatus.AWAITING_CLIENT ? 'font-semibold' : ''}>
                                        Awaiting Client
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetStatus(caseItem.id, CaseStatus.RESOLVED);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className={caseItem.status === CaseStatus.RESOLVED ? 'font-semibold' : ''}>
                                        Resolved
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetStatus(caseItem.id, CaseStatus.CLOSED);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <Archive className="w-4 h-4 text-gray-600" />
                                      <span className={caseItem.status === CaseStatus.CLOSED ? 'font-semibold' : ''}>
                                        Closed
                                      </span>
                                    </button>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    <div className="px-4 py-1">
                                      <p className="text-xs font-semibold text-gray-500 uppercase">Priority</p>
                                    </div>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetPriority(caseItem.id, Priority.URGENT);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <AlertTriangle className="w-4 h-4 text-red-600" />
                                      <span className={caseItem.priority === Priority.URGENT ? 'font-semibold' : ''}>
                                        Urgent
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetPriority(caseItem.id, Priority.HIGH);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <AlertCircle className="w-4 h-4 text-orange-600" />
                                      <span className={caseItem.priority === Priority.HIGH ? 'font-semibold' : ''}>
                                        High
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetPriority(caseItem.id, Priority.MEDIUM);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <Clock className="w-4 h-4 text-yellow-600" />
                                      <span className={caseItem.priority === Priority.MEDIUM ? 'font-semibold' : ''}>
                                        Medium
                                      </span>
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleSetPriority(caseItem.id, Priority.LOW);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className={caseItem.priority === Priority.LOW ? 'font-semibold' : ''}>
                                        Low
                                      </span>
                                    </button>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        handleDuplicateCase(caseItem.id);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <Copy className="w-4 h-4 text-gray-600" />
                                      Duplicate Case
                                    </button>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      onClick={() => {
                                        window.open(`/manager/cases/${caseItem.id}`, '_blank');
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <ExternalLink className="w-4 h-4 text-gray-600" />
                                      Open in New Tab
                                    </button>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    <button 
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600"
                                      onClick={() => {
                                        handleArchiveCase(caseItem.id);
                                        setActionMenuOpen(null);
                                      }}
                                    >
                                      <Archive className="w-4 h-4" />
                                      Archive Case
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedCases.length)} of{' '}
                {filteredAndSortedCases.length} cases
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Case</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Case Manager
                </label>
                <select
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                >
                  <option value="">Select a manager...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningCaseId(null);
                    setSelectedUserId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignCase}
                  disabled={!selectedUserId}
                  className="bg-1000-blue hover:bg-1000-blue/90"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Assign Case
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default function ManagerCases() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerCasesContent />
    </ProtectedRoute>
  );
}
