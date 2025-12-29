# Messaging System Implementation Guide

## Overview

This document describes the comprehensive messaging system implemented for 1000 Hills Solicitors, supporting communication between clients, case managers, and super admins with real-time updates and notifications.

## Architecture

### Backend Components

#### 1. Message Model (`backend/models/message.py`)
- Stores message content, read status, timestamps
- Links to case, sender, and recipient
- Supports attachments through document relationships

#### 2. Message Routes (`backend/routes/messages.py`)

**Endpoints:**

- `POST /cases/<case_id>/messages` - Send a message within a case
- `GET /cases/<case_id>/messages` - Get all messages for a specific case
- `PUT /messages/<message_id>/read` - Mark a message as read
- `GET /messages/all` - Get all messages (Admin only)
  - Query params: `case_id`, `unread_only`, `limit`, `offset`
- `GET /messages/unread-count` - Get unread message count for current user
- `GET /messages/conversations` - Get all conversations grouped by case

#### 3. WebSocket Handlers (`backend/websockets/handlers.py`)

**Events:**
- `connect` - Authenticate and establish connection
- `join_case` - Join a case room for real-time updates
- `send_message` - Send a message via WebSocket
- `new_message` - Broadcast to case room when new message is sent
- `case_update` - Notify about case status changes
- `notification` - Send notifications to specific users

### Frontend Components

#### 1. API Service (`frontend/src/lib/api.ts`)

**New Methods:**
```typescript
- getAllMessages(params?) - Get all messages with filtering (admin)
- getUnreadCount() - Get current user's unread message count
- getConversations() - Get conversations grouped by case
- getCaseMessages(caseId) - Get messages for a specific case
- sendMessage(caseId, messageData) - Send a message
- markMessageRead(messageId) - Mark a message as read
```

#### 2. WebSocket Service (`frontend/src/lib/websocket.ts`)

**Features:**
- Automatic reconnection
- Authentication with JWT token
- Event listeners for real-time updates
- Case room management
- Message broadcasting

**Usage:**
```typescript
import webSocketService from '@/lib/websocket';

// Connect with token
webSocketService.connect(token);

// Join case room
webSocketService.joinCaseRoom(caseId);

// Listen for new messages
webSocketService.onNewMessage((data) => {
  console.log('New message:', data);
});

// Send message
webSocketService.sendMessage(caseId, content);

// Disconnect
webSocketService.disconnect();
```

#### 3. Message Notifications Hook (`frontend/src/lib/useMessageNotifications.ts`)

**Features:**
- Tracks unread message count
- Real-time updates via WebSocket
- Automatic refresh every 30 seconds
- Helper methods for count management

**Usage:**
```typescript
import { useMessageNotifications } from '@/lib/useMessageNotifications';

const { unreadCount, refreshUnreadCount, decrementUnreadCount } = useMessageNotifications();
```

#### 4. User Interfaces

##### Client Messages (`/dashboard/messages`)
- **Features:**
  - View all conversations with case managers
  - Real-time message updates
  - Unread message indicators
  - Search conversations
  - Send/receive messages
  - Automatic read receipts

##### Manager Messages (`/manager/messages`)
- **Features:**
  - Manage all assigned client conversations
  - Filter by unread messages
  - View case details and status
  - Quick access to case information
  - Message count tracking
  - Real-time notifications

##### Admin Messages (`/admin/messages`)
- **Features:**
  - System-wide message monitoring
  - View all conversations across cases
  - Filter by case or unread status
  - Statistics dashboard (total messages, unread, conversations)
  - Search across all messages and users
  - Quick case navigation
  - User role indicators

## Features

### 1. Real-time Communication
- WebSocket-based instant messaging
- Live message delivery without page refresh
- Connection status monitoring
- Automatic reconnection on disconnect

### 2. Conversation Management
- Messages organized by case
- Last message preview
- Unread message counts
- Message timestamps
- Sender/recipient identification

### 3. Notifications
- Badge indicators on navigation menus
- Unread message counts
- Real-time count updates
- Visual "new message" indicators

### 4. Message Status
- Read/unread tracking
- Automatic marking as read when viewed
- Read receipts (double check marks)
- Delivery confirmation

### 5. Search & Filtering
- Search conversations by name, case title, or reference
- Filter by unread messages
- Admin filtering by case
- Time-based sorting

### 6. Responsive Design
- Mobile-friendly interface
- Split-view conversation layout
- Adaptive navigation
- Touch-optimized controls

## User Flows

### Client Sending a Message

1. Client navigates to `/dashboard/messages`
2. Selects a case conversation or it auto-selects
3. Types message in input field
4. Presses Enter or clicks Send button
5. Message is sent via API
6. Real-time update shows message in conversation
7. Manager receives notification

### Manager Responding

1. Manager sees unread count badge in navigation
2. Navigates to `/manager/messages`
3. Sees conversation with unread indicator
4. Selects conversation
5. Messages automatically marked as read
6. Types and sends response
7. Client receives real-time notification

### Admin Monitoring

1. Admin accesses `/admin/messages`
2. Views statistics dashboard
3. Sees all conversations system-wide
4. Can filter by unread or specific case
5. Monitors communication patterns
6. Can click through to case details

## Technical Implementation

### Message Creation Flow

```
1. User clicks Send
2. Frontend calls apiService.sendMessage()
3. Backend validates permissions
4. Message saved to database
5. WebSocket broadcasts to case room
6. Frontend updates UI
7. Recipient receives real-time update
```

### Read Status Update

```
1. User opens conversation
2. Frontend fetches messages
3. Unread messages identified
4. markMessageRead() called for each
5. Backend updates read status
6. Sender can see read receipts
```

### Real-time Update Flow

```
1. WebSocket connection established
2. User joins case room
3. New message sent by other party
4. Backend emits 'new_message' event
5. Frontend listener catches event
6. UI updates with new message
7. Unread count increments
```

## Security Considerations

1. **Authentication:**
   - JWT token required for all endpoints
   - WebSocket connection authenticated on connect
   - Token validation on each request

2. **Authorization:**
   - Users can only see messages for their cases
   - Managers see only assigned cases
   - Admins have full system access
   - Recipient verification before message send

3. **Data Validation:**
   - Message content required and validated
   - Case and user existence verified
   - Relationship verification (client-case, manager-case)

## Performance Optimizations

1. **Lazy Loading:**
   - Messages loaded per conversation
   - Pagination support in admin view
   - Limit/offset parameters available

2. **Caching:**
   - Unread count cached with 30s refresh
   - Conversation list cached until update

3. **WebSocket Efficiency:**
   - Room-based broadcasting
   - Only notify relevant users
   - Connection pooling

## Best Practices

### For Developers

1. **Adding New Features:**
   - Extend message model if needed
   - Add new endpoints to routes
   - Update API service methods
   - Create/update UI components

2. **Testing:**
   - Test real-time updates
   - Verify permission checks
   - Test with multiple concurrent users
   - Check mobile responsiveness

3. **Error Handling:**
   - Handle WebSocket disconnections
   - Provide fallback to polling
   - Show user-friendly error messages
   - Log errors for debugging

### For Users

1. **Client Best Practices:**
   - Check messages regularly
   - Respond promptly to manager queries
   - Provide clear, detailed information
   - Reference case number in complex issues

2. **Manager Best Practices:**
   - Respond to client messages within 24 hours
   - Use professional, clear language
   - Include case context in messages
   - Follow up on unresolved queries

3. **Admin Best Practices:**
   - Monitor response times
   - Track unread message patterns
   - Identify bottlenecks
   - Ensure compliance with communication policies

## Troubleshooting

### Common Issues

1. **Messages Not Updating in Real-time:**
   - Check WebSocket connection status
   - Verify token is valid
   - Check browser console for errors
   - Try reconnecting

2. **Unread Count Not Accurate:**
   - Refresh the page
   - Check if messages marked as read
   - Verify API endpoint response

3. **Cannot Send Messages:**
   - Verify case assignment
   - Check user permissions
   - Ensure recipient exists
   - Check network connection

### Debug Steps

1. Open browser console
2. Check for WebSocket connection logs
3. Verify API requests/responses
4. Check for authentication errors
5. Review network activity

## Future Enhancements

1. **Planned Features:**
   - File attachments in messages
   - Message threading/replies
   - Message editing/deletion
   - Typing indicators
   - Message reactions
   - Video/audio messages
   - Email notifications
   - Message templates
   - Automated responses
   - Message scheduling

2. **Performance Improvements:**
   - Message pagination in conversation view
   - Virtual scrolling for large conversations
   - Message search within conversation
   - Advanced filtering options

3. **Security Enhancements:**
   - End-to-end encryption
   - Message retention policies
   - Audit logging
   - Compliance reporting

## API Reference

### Send Message
```
POST /cases/<case_id>/messages
Headers: Authorization: Bearer <token>
Body: {
  "recipient_id": number,
  "content": string
}
Response: {
  "message": "Message sent successfully",
  "data": { message object }
}
```

### Get Case Messages
```
GET /cases/<case_id>/messages
Headers: Authorization: Bearer <token>
Response: {
  "messages": [array of message objects],
  "total": number
}
```

### Get Conversations
```
GET /messages/conversations
Headers: Authorization: Bearer <token>
Response: {
  "conversations": [array of conversation objects],
  "total": number
}
```

### Get Unread Count
```
GET /messages/unread-count
Headers: Authorization: Bearer <token>
Response: {
  "unread_count": number
}
```

### Mark Message as Read
```
PUT /messages/<message_id>/read
Headers: Authorization: Bearer <token>
Response: {
  "message": "Message marked as read"
}
```

### Get All Messages (Admin)
```
GET /messages/all?case_id=X&unread_only=true&limit=100&offset=0
Headers: Authorization: Bearer <token>
Response: {
  "messages": [array of message objects],
  "total": number,
  "limit": number,
  "offset": number
}
```

## Conclusion

The messaging system provides a comprehensive communication platform for all user roles with real-time updates, notifications, and an intuitive interface. It's built on modern web technologies with security, performance, and user experience as top priorities.

For questions or support, contact the development team.
