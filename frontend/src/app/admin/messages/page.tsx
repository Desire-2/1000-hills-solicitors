'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, User, AlertTriangle, RefreshCw, Filter, Mail, Eye, Users, FileText } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import apiService from '@/lib/api';
import Link from 'next/link';

interface Message {
  id: number;
  case_id: number;
  case_title: string;
  case_reference: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  recipient: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  totalConversations: number;
  activeConversations: number;
}

function AdminMessagesContent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalConversations: 0,
    activeConversations: 0
  });

  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      
      const params: any = {};
      if (filterUnread) {
        params.unread_only = true;
      }
      if (selectedCaseId) {
        params.case_id = selectedCaseId;
      }
      
      const response = await apiService.getAllMessages(params);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const messagesData = (response.data as any).messages as Message[];
      setMessages(messagesData);
      
      // Calculate stats
      const uniqueCases = new Set(messagesData.map(m => m.case_id));
      setStats({
        totalMessages: (response.data as any).total || messagesData.length,
        unreadMessages: messagesData.filter(m => !m.read).length,
        totalConversations: uniqueCases.size,
        activeConversations: uniqueCases.size // Could be refined with date logic
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Messages fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterUnread, selectedCaseId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.case_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Group messages by case
  const messagesByCase = filteredMessages.reduce((acc, msg) => {
    if (!acc[msg.case_id]) {
      acc[msg.case_id] = {
        case_id: msg.case_id,
        case_title: msg.case_title,
        case_reference: msg.case_reference,
        messages: [],
        unread_count: 0
      };
    }
    acc[msg.case_id].messages.push(msg);
    if (!msg.read) {
      acc[msg.case_id].unread_count++;
    }
    return acc;
  }, {} as Record<number, any>);

  const conversationGroups = Object.values(messagesByCase).sort((a: any, b: any) => {
    const aLatest = Math.max(...a.messages.map((m: Message) => new Date(m.created_at).getTime()));
    const bLatest = Math.max(...b.messages.map((m: Message) => new Date(m.created_at).getTime()));
    return bLatest - aLatest;
  });

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Management</h1>
            <p className="text-gray-600 mt-1">Monitor all system communications</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-1000-blue" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.unreadMessages}</p>
              </div>
              <Mail className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalConversations}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeConversations}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages, cases, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Messages by Conversation */}
        <div className="space-y-4">
          {conversationGroups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filterUnread ? 'No messages found' : 'No messages yet'}
              </p>
            </div>
          ) : (
            conversationGroups.map((group: any) => (
              <div key={group.case_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Conversation Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-1000-blue" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.case_title}</h3>
                        <p className="text-sm text-gray-600">{group.case_reference}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {group.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {group.unread_count} unread
                        </span>
                      )}
                      <span className="text-sm text-gray-600">
                        {group.messages.length} messages
                      </span>
                      <Link 
                        href={`/admin/cases/${group.case_id}`}
                        className="text-1000-blue hover:text-1000-blue/80 text-sm font-medium"
                      >
                        View Case →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="divide-y divide-gray-200">
                  {group.messages.slice(0, 5).map((msg: Message) => (
                    <div key={msg.id} className={`p-4 hover:bg-gray-50 ${!msg.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {msg.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">{msg.sender.name}</p>
                            <span className="text-xs text-gray-500">→</span>
                            <p className="text-sm text-gray-600">{msg.recipient.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              msg.sender.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                              msg.sender.role === 'CASE_MANAGER' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {msg.sender.role}
                            </span>
                            {!msg.read && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                Unread
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatMessageTime(msg.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {group.messages.length > 5 && (
                    <div className="p-3 text-center bg-gray-50">
                      <button
                        onClick={() => setSelectedCaseId(group.case_id === selectedCaseId ? null : group.case_id)}
                        className="text-sm text-1000-blue hover:text-1000-blue/80 font-medium"
                      >
                        {group.case_id === selectedCaseId 
                          ? 'Show Less' 
                          : `Show ${group.messages.length - 5} more messages`
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminMessages() {
  return (
    <ProtectedRoute requiredRole={[Role.SUPER_ADMIN]}>
      <AdminMessagesContent />
    </ProtectedRoute>
  );
}
