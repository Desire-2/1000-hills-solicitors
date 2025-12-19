'use client';

import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Socket.IO client setup with environment variable
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mock authentication token (replace with actual token retrieval)
    const token = 'MOCK_JWT_TOKEN'; 

    if (token) {
      socket.auth = { token };
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Mock joining a user-specific room
      // socket.emit('join_user', { token }); 
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
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
