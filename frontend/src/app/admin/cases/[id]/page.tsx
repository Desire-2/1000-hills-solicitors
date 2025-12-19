'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Save, User, Calendar, AlertCircle, 
  FileText, MessageSquare, Plus, Edit, Trash
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

export default function AdminCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string;
  
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Edit states
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [newNote, setNewNote] = useState('');
  const [notePrivate, setNotePrivate] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail();
      fetchNotes();
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

  const handleUpdateCase = async () => {
    if (!caseDetail) return;
    
    try {
      setSaving(true);
      const response = await apiService.updateCase(caseDetail.id, {
        status: editStatus,
        priority: editPriority
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseDetail) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error || 'Case not found'}</p>
          <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
            <Link href="/admin/cases">Back to Cases</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/admin/cases">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Link>
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-lg text-1000-blue font-semibold block mb-2">
              {caseDetail.case_id}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{caseDetail.title}</h1>
          </div>
          
          <Button 
            onClick={handleUpdateCase}
            disabled={saving}
            className="bg-1000-blue hover:bg-1000-blue/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Management</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                >
                  <option value="NEW">New</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="AWAITING_CLIENT">Awaiting Client</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
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
            <p className="text-gray-700 whitespace-pre-wrap">{caseDetail.description}</p>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Case Notes
            </h2>
            
            {/* Add Note Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue mb-2"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notePrivate}
                    onChange={(e) => setNotePrivate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Private (staff only)</span>
                </label>
                <Button onClick={handleAddNote} className="bg-1000-blue hover:bg-1000-blue/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
            
            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notes yet</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-4 border-1000-blue pl-4 py-2 relative group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{note.author.name}</span>
                        {note.is_private && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            Private
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDateTime(note.created_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
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
          {/* Client Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">{caseDetail.client?.name || 'Not assigned'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">{caseDetail.client?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Case Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
            
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
                  Assigned To
                </p>
                <p className="font-medium text-gray-900">
                  {caseDetail.assigned_to ? caseDetail.assigned_to.name : 'Unassigned'}
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
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {formatDate(caseDetail.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
