'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Search, Paperclip, User } from 'lucide-react';
import { useState } from 'react';

function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      role: 'Case Manager',
      lastMessage: 'I\'ve reviewed your case and have some updates.',
      time: '2 hours ago',
      unread: 2,
      caseId: '1000HILLS-2025-001'
    },
    { 
      id: 2, 
      name: 'Mike Davis', 
      role: 'Attorney',
      lastMessage: 'Please upload the requested documents.',
      time: '1 day ago',
      unread: 0,
      caseId: '1000HILLS-2025-002'
    },
  ];

  const messages = [
    { id: 1, sender: 'Sarah Johnson', text: 'Hello! I\'ve reviewed your contract dispute case.', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Thank you. What are the next steps?', time: '10:35 AM', isOwn: true },
    { id: 3, sender: 'Sarah Johnson', text: 'I\'ve reviewed your case and have some updates.', time: '11:00 AM', isOwn: false },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // TODO: Send message via API
      console.log('Sending:', messageText);
      setMessageText('');
    }
  };

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your legal team</p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(600px-73px)]">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-1000-blue rounded-full flex items-center justify-center text-white font-medium">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{conv.name}</p>
                          <p className="text-xs text-gray-500">{conv.role}</p>
                        </div>
                      </div>
                      {conv.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{conv.time}</span>
                      <span className="text-xs text-1000-blue font-medium">{conv.caseId}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-1000-blue rounded-full flex items-center justify-center text-white font-medium">
                        SJ
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Case Manager - 1000HILLS-2025-001</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg p-3 ${
                            msg.isOwn 
                              ? 'bg-1000-blue text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-1000-blue hover:bg-1000-blue/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
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
