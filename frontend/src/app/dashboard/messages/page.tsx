'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, Case, CaseStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Search, Paperclip, User, AlertTriangle, RefreshCw, Plus, X, FileText } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import apiService from '@/lib/api';
import { formatDate } from '@/lib/date-utils';
import Link from 'next/link';

interface Message {
  id: number;
  case_id: number;
  content: string;
  read: boolean;
  created_at: string;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  recipient: {
    id: number;
    name: string;
    email: string;
  };
}

interface ConversationGroup {
  case_id: number;
  case_title: string;
  case_reference: string;
  messages: Message[];
  unread_count: number;
  last_message: Message | null;
  other_party: {
    id: number;
    name: string;
    role: string;
  } | null;
}

function MessagesContent() {
  const { user } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<ConversationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [availableCases, setAvailableCases] = useState<Case[]>([]);

  const fetchMessagesData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch user's cases
      const casesResponse = await apiService.getCases();
      
      if (casesResponse.error) {
        throw new Error(casesResponse.error);
      }
      
      const cases = (casesResponse.data as Case[]) || [];
      setAvailableCases(cases);
      
      // Fetch messages for each case
      const conversationGroups: ConversationGroup[] = [];
      
      for (const caseItem of cases) {
        const messagesResponse = await apiService.getCaseMessages(caseItem.id);
        
        if (!messagesResponse.error && messagesResponse.data) {
          const messages = (messagesResponse.data as any).messages as Message[];
          const unreadCount = messages.filter(m => !m.read && m.recipient.id === user?.id).length;
          
          // Determine the other party in the conversation
          let otherParty = null;
          if (messages.length > 0) {
            const firstMessage = messages[0];
            const otherPerson = firstMessage.sender.id === user?.id 
              ? firstMessage.recipient 
              : firstMessage.sender;
            
            otherParty = {
              id: otherPerson.id,
              name: otherPerson.name,
              role: caseItem.assigned_to?.name === otherPerson.name ? 'Case Manager' : 'Staff'
            };
          }
          
          conversationGroups.push({
            case_id: caseItem.id,
            case_title: caseItem.title,
            case_reference: `CASE-${String(caseItem.id).padStart(4, '0')}`,
            messages: messages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ),
            unread_count: unreadCount,
            last_message: messages.length > 0 ? messages[messages.length - 1] : null,
            other_party: otherParty
          });
        }
      }
      
      // Sort by last message time
      conversationGroups.sort((a, b) => {
        const aTime = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
        const bTime = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
        return bTime - aTime;
      });
      
      setConversations(conversationGroups);
      
      // Auto-select first conversation if none selected
      if (!selectedCaseId && conversationGroups.length > 0) {
        setSelectedCaseId(conversationGroups[0].case_id);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Messages fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, selectedCaseId]);

  useEffect(() => {
    fetchMessagesData();
  }, [fetchMessagesData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessagesData();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedCaseId || !user) return;
    
    try {
      setSending(true);
      
      const selectedConversation = conversations.find(c => c.case_id === selectedCaseId);
      if (!selectedConversation || !selectedConversation.other_party) {
        throw new Error('Cannot determine message recipient');
      }
      
      const response = await apiService.sendMessage(selectedCaseId, {
        recipient_id: selectedConversation.other_party.id,
        content: messageText.trim()
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMessageText('');
      // Refresh messages to show the new one
      await fetchMessagesData();
      
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await apiService.markMessageRead(messageId);
      // Refresh to update unread counts
      await fetchMessagesData();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const selectedConversation = conversations.find(c => c.case_id === selectedCaseId);
  
  // If a case is selected but has no conversation yet, create a virtual one
  const selectedCase = selectedCaseId && !selectedConversation 
    ? availableCases.find(c => c.id === selectedCaseId)
    : null;
  
  const displayConversation = selectedConversation || (selectedCase ? {
    case_id: selectedCase.id,
    case_reference: `CASE-${String(selectedCase.id).padStart(4, '0')}`,
    case_title: selectedCase.title,
    messages: [],
    unread_count: 0,
    last_message: null,
    other_party: selectedCase.assigned_to || null
  } : null);

  const filteredConversations = conversations.filter(c =>
    c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.case_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.other_party?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Messages</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-1000-blue hover:bg-1000-blue/90">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with your legal team</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowNewMessageModal(true)}
              className="bg-1000-blue hover:bg-1000-blue/90"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Message
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
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(600px-73px)]">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">
                      {searchTerm ? 'No conversations found' : 'No messages yet'}
                    </p>
                    {!searchTerm && availableCases.length > 0 && (
                      <Button 
                        onClick={() => setShowNewMessageModal(true)}
                        size="sm"
                        className="bg-1000-blue hover:bg-1000-blue/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Start a Conversation
                      </Button>
                    )}
                    {!searchTerm && availableCases.length === 0 && (
                      <div className="mt-4">
                        <p className="text-gray-500 text-sm mb-3">You need a case to start messaging</p>
                        <Link href="/submit-case">
                          <Button size="sm" className="bg-1000-blue hover:bg-1000-blue/90">
                            <FileText className="w-4 h-4 mr-2" />
                            Submit a Case
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.case_id}
                      onClick={() => setSelectedCaseId(conv.case_id)}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                        selectedCaseId === conv.case_id ? 'bg-blue-50 border-l-4 border-l-1000-blue' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-1000-blue rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                            {conv.other_party?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'SM'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {conv.other_party?.name || 'Staff Member'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{conv.other_party?.role || 'Staff'}</p>
                          </div>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conv.last_message?.content || 'No messages yet'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conv.last_message ? formatMessageTime(conv.last_message.created_at) : ''}
                        </span>
                        <span className="text-xs text-1000-blue font-medium">{conv.case_reference}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              {displayConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-1000-blue rounded-full flex items-center justify-center text-white font-medium">
                        {displayConversation.other_party?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'SM'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {displayConversation.other_party?.name || 'Staff Member'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {displayConversation.other_party?.role || 'Staff'} - {displayConversation.case_reference}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{displayConversation.case_title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {displayConversation.messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      displayConversation.messages.map((msg) => {
                        const isOwn = msg.sender.id === user?.id;
                        
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%]`}>
                              <div className="flex items-end gap-2 mb-1">
                                {!isOwn && (
                                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                                    {msg.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className={`rounded-lg p-3 ${
                                    isOwn 
                                      ? 'bg-1000-blue text-white' 
                                      : 'bg-white border border-gray-200 text-gray-900'
                                  }`}>
                                    {!isOwn && (
                                      <p className="text-xs font-medium mb-1 opacity-75">{msg.sender.name}</p>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                  <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                    {formatMessageTime(msg.created_at)}
                                    {!isOwn && !msg.read && (
                                      <span className="ml-2 text-1000-blue font-medium">New</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                        disabled={sending}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent disabled:bg-gray-100"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        className="bg-1000-blue hover:bg-1000-blue/90"
                      >
                        {sending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {availableCases.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">You don't have any cases yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      To start messaging with our legal team, you need to submit a case first.
                    </p>
                    <Link href="/submit-case">
                      <Button className="bg-1000-blue hover:bg-1000-blue/90">
                        <FileText className="w-4 h-4 mr-2" />
                        Submit a Case
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Select a case to start or continue a conversation with your case manager:
                    </p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {availableCases.map((caseItem) => {
                        const hasConversation = conversations.some(c => c.case_id === caseItem.id);
                        return (
                          <button
                            key={caseItem.id}
                            onClick={() => {
                              setSelectedCaseId(caseItem.id);
                              setShowNewMessageModal(false);
                            }}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-1000-blue hover:bg-blue-50 transition-all text-left"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{caseItem.title}</h4>
                                  {hasConversation && (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {`CASE-${String(caseItem.id).padStart(4, '0')}`}
                                </p>
                                {caseItem.assigned_to && (
                                  <p className="text-xs text-gray-500">
                                    Manager: {caseItem.assigned_to.name}
                                  </p>
                                )}
                                {!caseItem.assigned_to && (
                                  <p className="text-xs text-amber-600">
                                    ⚠ Not yet assigned to a case manager
                                  </p>
                                )}
                              </div>
                              <div className="ml-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  caseItem.status === CaseStatus.PENDING ? 'bg-green-100 text-green-700' :
                                  caseItem.status === CaseStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                                  caseItem.status === CaseStatus.CLOSED ? 'bg-gray-100 text-gray-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {caseItem.status}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  onClick={() => setShowNewMessageModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export default function Messages() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <MessagesContent />
    </ProtectedRoute>
  );
}
