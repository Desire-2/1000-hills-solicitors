'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, CaseStatus, Priority, CaseCategory, Case as CaseType, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Save, User as UserIcon, Calendar, AlertCircle, 
  FileText, MessageSquare, Plus, Trash, Clock, CheckCircle,
  Edit, X, Mail, Phone, Paperclip, History, Tag, AlertTriangle, Loader2, UserPlus
} from 'lucide-react';
import Link from 'next/link';
import apiService from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import { formatDistanceToNow } from 'date-fns';

interface CaseDetail extends CaseType {
  case_id?: string;
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

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  user: string;
}

function ManagerCaseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string;
  
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details');
  
  // Edit states
  const [editStatus, setEditStatus] = useState<CaseStatus>(CaseStatus.PENDING);
  const [editPriority, setEditPriority] = useState<Priority>(Priority.MEDIUM);
  const [newNote, setNewNote] = useState('');
  const [notePrivate, setNotePrivate] = useState(true);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Message modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail();
      fetchNotes();
      fetchUsers();
    }
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminCase(parseInt(caseId));
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        const caseData = response.data as CaseDetail;
        setCaseDetail(caseData);
        setEditStatus(caseData.status);
        setEditPriority(caseData.priority);
        setSelectedUserId(caseData.assigned_to_id || null);
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

  const fetchUsers = async () => {
    try {
      const response = await apiService.get('/admin/users?role=CASE_MANAGER');
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data as User[]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleUpdateCase = async () => {
    if (!caseDetail) return;
    
    try {
      setSaving(true);
      const response = await apiService.updateCase(caseDetail.id, {
        status: editStatus,
        priority: editPriority,
        assigned_to_id: selectedUserId
      });
      
      if (response.error) {
        alert('Error updating case: ' + response.error);
      } else {
        alert('Case updated successfully');
        fetchCaseDetail();
      }
    } catch (err) {
      alert('Failed to update case');
      console.error('Error updating case:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const response = await apiService.createCaseNote(parseInt(caseId), {
        content: newNote,
        is_private: notePrivate
      });
      
      if (response.error) {
        alert('Error adding note: ' + response.error);
      } else {
        setNewNote('');
        fetchNotes();
      }
    } catch (err) {
      alert('Failed to add note');
      console.error('Error adding note:', err);
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    if (!editNoteContent.trim()) return;
    
    try {
      const response = await apiService.updateCaseNote(parseInt(caseId), noteId, {
        content: editNoteContent
      });
      
      if (response.error) {
        alert('Error updating note: ' + response.error);
      } else {
        setEditingNote(null);
        setEditNoteContent('');
        fetchNotes();
      }
    } catch (err) {
      alert('Failed to update note');
      console.error('Error updating note:', err);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await apiService.deleteCaseNote(parseInt(caseId), noteId);
      
      if (response.error) {
        alert('Error deleting note: ' + response.error);
      } else {
        fetchNotes();
      }
    } catch (err) {
      alert('Failed to delete note');
      console.error('Error deleting note:', err);
    }
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

  const getStatusColor = (status: CaseStatus): string => {
    const colors = {
      [CaseStatus.PENDING]: 'text-green-600',
      [CaseStatus.IN_PROGRESS]: 'text-blue-600',
      [CaseStatus.AWAITING_CLIENT]: 'text-yellow-600',
      [CaseStatus.RESOLVED]: 'text-purple-600',
      [CaseStatus.CLOSED]: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getPriorityColor = (priority: Priority): string => {
    const colors = {
      [Priority.URGENT]: 'text-red-600',
      [Priority.HIGH]: 'text-orange-600',
      [Priority.MEDIUM]: 'text-yellow-600',
      [Priority.LOW]: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !caseDetail?.client?.id) return;
    
    try {
      setSendingMessage(true);
      
      // Include case information in the message
      const caseInfo = `\n\n--- Case Information ---\nCase ID: ${caseDetail.case_id || caseId}\nTitle: ${caseDetail.title}\nCategory: ${caseDetail.category}\nStatus: ${caseDetail.status}\nPriority: ${caseDetail.priority}`;
      const fullMessage = messageContent.trim() + caseInfo;
      
      const response = await apiService.post(`/cases/${caseId}/messages`, {
        recipient_id: caseDetail.client.id,
        content: fullMessage
      });
      
      if (response.error) {
        alert('Error sending message: ' + response.error);
      } else {
        alert('Message sent successfully!');
        setShowMessageModal(false);
        setMessageContent('');
      }
    } catch (err) {
      alert('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-1000-blue mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error || !caseDetail) {
    return (
      <ManagerLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error || 'Case not found'}</p>
            <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
              <Link href="/manager/cases">Back to Cases</Link>
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
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/manager/cases">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Link>
          </Button>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-mono text-lg text-1000-blue font-semibold block mb-2">
                Case #{caseDetail.id}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseDetail.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Created {formatDistanceToNow(new Date(caseDetail.created_at), { addSuffix: true })}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last updated {formatDistanceToNow(new Date(caseDetail.updated_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handleUpdateCase}
              disabled={saving}
              className="bg-1000-blue hover:bg-1000-blue/90"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Save Changes</>
              )}
            </Button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Tag className={`w-5 h-5 ${getStatusColor(caseDetail.status)}`} />
              <span className="font-semibold">{formatStatus(caseDetail.status)}</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${getPriorityColor(caseDetail.priority)}`} />
              <span className="font-semibold">{caseDetail.priority} Priority</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span>{formatCategory(caseDetail.category)}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-1000-blue text-1000-blue font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Case Details
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-1000-blue text-1000-blue font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-1000-blue text-1000-blue font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <>
                {/* Case Management */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Case Management
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as CaseStatus)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                      >
                        <option value={CaseStatus.PENDING}>Pending</option>
                        <option value={CaseStatus.IN_PROGRESS}>In Progress</option>
                        <option value={CaseStatus.AWAITING_CLIENT}>Awaiting Client</option>
                        <option value={CaseStatus.RESOLVED}>Resolved</option>
                        <option value={CaseStatus.CLOSED}>Closed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as Priority)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                      >
                        <option value={Priority.LOW}>Low</option>
                        <option value={Priority.MEDIUM}>Medium</option>
                        <option value={Priority.HIGH}>High</option>
                        <option value={Priority.URGENT}>Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Case Description
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{caseDetail.description}</p>
                  </div>
                </div>
              </>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Case Notes
                </h2>
                
                {/* Add Note Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue mb-3 min-h-[100px]"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={notePrivate}
                        onChange={(e) => setNotePrivate(e.target.checked)}
                        className="rounded border-gray-300 text-1000-blue focus:ring-1000-blue"
                      />
                      <span className="text-gray-700 font-medium">Private note (staff only)</span>
                    </label>
                    <Button 
                      onClick={handleAddNote} 
                      disabled={!newNote.trim()}
                      className="bg-1000-blue hover:bg-1000-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </div>
                
                {/* Notes List */}
                {notes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notes yet. Add your first note above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div 
                        key={note.id} 
                        className="border-l-4 border-1000-blue pl-4 py-3 bg-white hover:bg-gray-50 transition-colors rounded-r-lg relative group"
                      >
                        {editingNote === note.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                              rows={3}
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateNote(note.id)}
                                className="bg-1000-blue hover:bg-1000-blue/90"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingNote(null);
                                  setEditNoteContent('');
                                }}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{note.author.name}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-600">{note.author.role}</span>
                                {note.is_private && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                                    Private
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingNote(note.id);
                                    setEditNoteContent(note.content);
                                  }}
                                  className="text-1000-blue hover:text-1000-blue/80 p-1"
                                  title="Edit note"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete note"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{note.content}</p>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Case Activity
                </h2>
                <div className="text-center py-12 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Activity timeline coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Client Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{caseDetail.client?.name || 'Not assigned'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  <p className="font-medium text-gray-900 text-sm">{caseDetail.client?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assigned To</p>
                  {caseDetail.assigned_to ? (
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="font-medium text-gray-900">{caseDetail.assigned_to.name}</p>
                      <p className="text-sm text-gray-600">{caseDetail.assigned_to.email}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 mb-2 text-center">
                      <p className="text-sm text-gray-500">Unassigned</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAssignModal(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {caseDetail.assigned_to ? 'Reassign' : 'Assign'} Case
                  </Button>
                </div>
              </div>
            </div>

            {/* Case Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Category
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatCategory(caseDetail.category)}
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
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(caseDetail.created_at), { addSuffix: true })}
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
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(caseDetail.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setShowMessageModal(true)}
                  disabled={!caseDetail.client}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Message Client
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach Documents
                </Button>
                <Button variant="outline" className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Close Case
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Case Manager</h3>
              
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
                    setSelectedUserId(caseDetail.assigned_to_id || null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCase}
                  disabled={!selectedUserId}
                  className="bg-1000-blue hover:bg-1000-blue/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assign Case
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Client Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Message Client</h3>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {caseDetail.client && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">To:</p>
                  <p className="font-semibold text-gray-900">{caseDetail.client.name}</p>
                  <p className="text-sm text-gray-600">{caseDetail.client.email}</p>
                </div>
              )}
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Regarding Case:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseDetail.case_id || caseId} - {caseDetail.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {caseDetail.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {caseDetail.status}
                  </span>
                  <span className={`flex items-center gap-1 ${getPriorityColor(caseDetail.priority)}`}>
                    <AlertTriangle className="w-3 h-3" />
                    {caseDetail.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message to the client..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue min-h-[150px]"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Case information will be automatically included with your message.
                </p>
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || sendingMessage}
                  className="bg-1000-blue hover:bg-1000-blue/90"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}

export default function ManagerCaseDetailPage() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerCaseDetailContent />
    </ProtectedRoute>
  );
}
