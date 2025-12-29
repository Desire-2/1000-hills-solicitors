'use client';

import ManagerLayout from '@/components/manager/ManagerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Search, User, AlertTriangle, RefreshCw, Filter, CheckCheck, Mail } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import apiService from '@/lib/api';

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

interface Conversation {
  case_id: number;
  case_title: string;
  case_reference: string;
  case_status: string;
  unread_count: number;
  message_count: number;
  last_message: {
    id: number;
    content: string;
    created_at: string;
    sender_id: number;
    read: boolean;
  };
  other_party: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

function ManagerMessagesContent() {
  const { user } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      
      const response = await apiService.getConversations();
      
      if (response.error) {
        throw new Error(response.error);
      }

      const conversationData = (response.data as any).conversations as Conversation[];
      setConversations(conversationData);
      
      // Auto-select first conversation if none selected
      if (!selectedCaseId && conversationData.length > 0) {
        setSelectedCaseId(conversationData[0].case_id);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
      console.error('Conversations fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCaseId]);

  const fetchCaseMessages = useCallback(async (caseId: number) => {
    try {
      const response = await apiService.getCaseMessages(caseId);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const messagesData = (response.data as any).messages as Message[];
      setMessages(messagesData.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ));

      // Mark unread messages as read
      const unreadMessages = messagesData.filter(m => !m.read && m.recipient.id === user?.id);
      for (const msg of unreadMessages) {
        await apiService.markMessageRead(msg.id);
      }
      
    } catch (err) {
      console.error('Messages fetch error:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedCaseId) {
      fetchCaseMessages(selectedCaseId);
    }
  }, [selectedCaseId, fetchCaseMessages]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    if (selectedCaseId) {
      await fetchCaseMessages(selectedCaseId);
    }
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
      // Refresh messages and conversations
      await fetchConversations();
      await fetchCaseMessages(selectedCaseId);
      
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const selectedConversation = conversations.find(c => c.case_id === selectedCaseId);

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = 
      c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.other_party?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterUnread || c.unread_count > 0;
    
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

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
      <ManagerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
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
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Manage client communications
              {totalUnread > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalUnread} unread
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setFilterUnread(!filterUnread)}
              variant={filterUnread ? "default" : "outline"}
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              {filterUnread ? 'Show All' : 'Unread Only'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[700px]">
            {/* Conversations List */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
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
              
              <div className="overflow-y-auto h-[calc(700px-73px)]">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      {searchTerm || filterUnread ? 'No conversations found' : 'No messages yet'}
                    </p>
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
                          <div className="w-10 h-10 bg-gradient-to-br from-1000-blue to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                            {conv.other_party?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'CL'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {conv.other_party?.name || 'Client'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{conv.case_title}</p>
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
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            conv.case_status === 'OPEN' ? 'bg-green-100 text-green-700' :
                            conv.case_status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {conv.case_status}
                          </span>
                          <span className="text-xs text-1000-blue font-medium">{conv.case_reference}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-1000-blue to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedConversation.other_party?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'CL'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {selectedConversation.other_party?.name || 'Client'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.other_party?.email || 'Unknown'} - {selectedConversation.case_reference}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedConversation.case_title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{selectedConversation.message_count} messages</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => {
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
                                  <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    {formatMessageTime(msg.created_at)}
                                    {isOwn && msg.read && <CheckCheck className="w-3 h-3 text-blue-500" />}
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
      </div>
    </ManagerLayout>
  );
}

export default function ManagerMessages() {
  return (
    <ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
      <ManagerMessagesContent />
    </ProtectedRoute>
  );
}
