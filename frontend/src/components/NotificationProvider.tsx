'use client';

import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import apiService from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

// Socket.IO client setup with environment variable
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const token = apiService.getToken();

    if (user && token) {
      socket.auth = { token };
      if (!socket.connected) {
        socket.connect();
      }
    } else if (socket.connected) {
      socket.disconnect();
    }

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('new_message', (data) => {
      toast.info(`New Message in Case ${data.case_id}: ${data.content.substring(0, 30)}...`, {
        action: {
          label: 'View',
          onClick: () => window.location.href = `/dashboard/cases/${data.case_id}`,
        },
      });
    });

    socket.on('case_update', (data) => {
      toast.success(`Case ${data.case_id} status updated to ${data.status}`, {
        action: {
          label: 'View',
          onClick: () => window.location.href = `/dashboard/cases/${data.case_id}`,
        },
      });
    });

    socket.on('error', (data) => {
      toast.error(`WebSocket Error: ${data.msg}`);
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
      socket.off('case_update');
      socket.off('error');
    };
  }, [user, loading]);

  useEffect(() => {
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
