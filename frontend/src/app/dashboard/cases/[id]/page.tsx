'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Calendar, User, AlertCircle, FileText, 
  MessageSquare, Clock, CheckCircle, Send, Upload, Download,
  Trash2, RefreshCw, File, Plus, Edit
} from 'lucide-react';
import Link from 'next/link';
import apiService from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import { useAuth } from '@/lib/auth-context';

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

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    name: string;
  };
  recipient: {
    id: number;
    name: string;
  };
  read: boolean;
  created_at: string;
}

interface Document {
  id: number;
  filename: string;
  file_size: number;
  mime_type: string;
  uploaded_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

type TabType = 'overview' | 'notes' | 'documents' | 'messages' | 'timeline';

function CaseDetailContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Message form
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  
  // Note form
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!caseId) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Fetch case details
      const caseResponse = await apiService.getCase(parseInt(caseId));
      if (caseResponse.error) {
        throw new Error(caseResponse.error);
      }
      if (caseResponse.data) {
        setCaseDetail(caseResponse.data as CaseDetail);
      }
      
      // Fetch notes
      try {
        const notesResponse = await apiService.getCaseNotes(parseInt(caseId));
        if (notesResponse.data && Array.isArray(notesResponse.data)) {
          setNotes(notesResponse.data as Note[]);
        }
      } catch (err) {
        console.warn('Notes not available:', err);
      }
      
      // Fetch messages
      try {
        const messagesResponse = await apiService.getCaseMessages(parseInt(caseId));
        if (messagesResponse.data && (messagesResponse.data as any).messages) {
          setMessages((messagesResponse.data as any).messages);
        }
      } catch (err) {
        console.warn('Messages not available:', err);
      }
      
      // Fetch documents
      try {
        const docsResponse = await apiService.getDocuments(parseInt(caseId));
        if (docsResponse.data && Array.isArray(docsResponse.data)) {
          setDocuments(docsResponse.data as Document[]);
        }
      } catch (err) {
        console.warn('Documents not available:', err);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case details');
      console.error('Error fetching case data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !caseDetail?.assigned_to) return;
    
    try {
      setSending(true);
      const response = await apiService.sendMessage(parseInt(caseId), {
        recipient_id: caseDetail.assigned_to.id,
        content: messageText.trim()
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMessageText('');
      await fetchAllData(); // Refresh to show new message
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    
    try {
      setAddingNote(true);
      const response = await apiService.createCaseNote(parseInt(caseId), {
        content: noteText.trim(),
        is_private: false
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setNoteText('');
      await fetchAllData(); // Refresh to show new note
      alert('Note added successfully!');
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add note. Feature may not be available yet.');
    } finally {
      setAddingNote(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
      'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
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

  // Build timeline from all activities
  const buildTimeline = () => {
    const timeline: Array<{
      id: string;
      type: 'case' | 'note' | 'message' | 'document';
      title: string;
      description: string;
      timestamp: string;
      author?: string;
    }> = [];
    
    // Add case creation
    if (caseDetail) {
      timeline.push({
        id: `case-${caseDetail.id}`,
        type: 'case',
        title: 'Case Created',
        description: `Case "${caseDetail.title}" was created`,
        timestamp: caseDetail.created_at,
        author: caseDetail.client.name
      });
    }
    
    // Add notes
    notes.forEach(note => {
      timeline.push({
        id: `note-${note.id}`,
        type: 'note',
        title: 'Note Added',
        description: note.content,
        timestamp: note.created_at,
        author: note.author.name
      });
    });
    
    // Add messages
    messages.forEach(msg => {
      timeline.push({
        id: `message-${msg.id}`,
        type: 'message',
        title: 'Message Sent',
        description: msg.content,
        timestamp: msg.created_at,
        author: msg.sender.name
      });
    });
    
    // Add documents
    documents.forEach(doc => {
      timeline.push({
        id: `doc-${doc.id}`,
        type: 'document',
        title: 'Document Uploaded',
        description: doc.filename,
        timestamp: doc.created_at,
        author: doc.uploaded_by.name
      });
    });
    
    // Sort by timestamp (newest first)
    return timeline.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const timeline = buildTimeline();

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
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="outline">
              <Link href="/dashboard/cases">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cases
              </Link>
            </Button>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg text-1000-blue font-semibold">
                  {caseDetail.case_id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(caseDetail.status)}`}>
                  {caseDetail.status.replace(/_/g, ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(caseDetail.priority)}`}>
                  {caseDetail.priority}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{caseDetail.title}</h1>
              <p className="text-gray-600 mt-1">{caseDetail.category.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: 'overview' as TabType, label: 'Overview', icon: FileText },
              { id: 'notes' as TabType, label: 'Notes', icon: Edit, count: notes.length },
              { id: 'documents' as TabType, label: 'Documents', icon: File, count: documents.length },
              { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare, count: messages.length },
              { id: 'timeline' as TabType, label: 'Timeline', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-1000-blue text-1000-blue font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{caseDetail.description}</p>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Notes & Updates</h2>
                </div>
                
                {/* Add Note Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note or update..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent mb-2"
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddNote}
                    disabled={addingNote || !noteText.trim()}
                    size="sm"
                    className="bg-1000-blue hover:bg-1000-blue/90"
                  >
                    {addingNote ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" /> Add Note</>
                    )}
                  </Button>
                </div>
                
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet</p>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border-l-4 border-1000-blue pl-4 py-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{note.author.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(note.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                  <Button size="sm" className="bg-1000-blue hover:bg-1000-blue/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                    <Button size="sm" className="bg-1000-blue hover:bg-1000-blue/90">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-1000-blue transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-1000-blue flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(doc.file_size)} • Uploaded by {doc.uploaded_by.name} • {formatDate(doc.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  {caseDetail.assigned_to && (
                    <p className="text-sm text-gray-600">Conversation with {caseDetail.assigned_to.name}</p>
                  )}
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender.id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[80%]">
                            <div className={`rounded-lg p-3 ${
                              isOwn 
                                ? 'bg-1000-blue text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              {!isOwn && (
                                <p className="text-xs font-medium mb-1 opacity-75">{msg.sender.name}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                              {formatDateTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                      disabled={sending || !caseDetail.assigned_to}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent disabled:bg-gray-100"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sending || !messageText.trim() || !caseDetail.assigned_to}
                      className="bg-1000-blue hover:bg-1000-blue/90"
                    >
                      {sending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {!caseDetail.assigned_to && (
                    <p className="text-xs text-gray-500 mt-2">Messages will be available once an attorney is assigned</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Timeline</h2>
                
                {timeline.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activity yet</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((item) => {
                      const icon = {
                        case: Clock,
                        note: Edit,
                        message: MessageSquare,
                        document: FileText
                      }[item.type];
                      const Icon = icon;
                      const color = {
                        case: 'text-blue-600 bg-blue-50',
                        note: 'text-purple-600 bg-purple-50',
                        message: 'text-green-600 bg-green-50',
                        document: 'text-orange-600 bg-orange-50'
                      }[item.type];
                      
                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{item.title}</span>
                              <span className="text-xs text-gray-500">{formatDateTime(item.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                            {item.author && (
                              <p className="text-xs text-gray-500">by {item.author}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
                    {caseDetail.category.replace(/_/g, ' ')}
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
                  {caseDetail.assigned_to && (
                    <p className="text-xs text-gray-500 mt-1">{caseDetail.assigned_to.email}</p>
                  )}
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

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notes</span>
                  <span className="font-semibold text-gray-900">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="font-semibold text-gray-900">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages</span>
                  <span className="font-semibold text-gray-900">{messages.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setActiveTab('messages')}
                  className="w-full bg-1000-blue hover:bg-1000-blue/90"
                  disabled={!caseDetail.assigned_to}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  onClick={() => setActiveTab('documents')}
                  variant="outline" 
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <Button 
                  onClick={() => setActiveTab('notes')}
                  variant="outline" 
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
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
