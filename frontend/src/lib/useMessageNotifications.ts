/**
 * useMessageNotifications Hook
 * Manages unread message count and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import apiService from './api';
import webSocketService from './websocket';

export function useMessageNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getUnreadCount();
      
      if (!response.error && response.data) {
        setUnreadCount((response.data as any).unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up interval to refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Set up WebSocket listener for new messages
  useEffect(() => {
    if (!user) return;

    const token = apiService.getToken();
    if (!token) return;

    // Connect to WebSocket if not already connected
    if (!webSocketService.isConnected()) {
      webSocketService.connect(token);
    }

    // Listen for new messages
    const handleNewMessage = (data: any) => {
      // Only increment if the current user is the recipient
      if (data.recipient_id === user.id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    webSocketService.onNewMessage(handleNewMessage);

    return () => {
      webSocketService.offNewMessage();
    };
  }, [user]);

  const refreshUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const decrementUnreadCount = useCallback((amount: number = 1) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  }, []);

  return {
    unreadCount,
    loading,
    refreshUnreadCount,
    decrementUnreadCount
  };
}
