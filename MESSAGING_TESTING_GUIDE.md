# Testing the Messaging System

## Prerequisites

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend should run on `http://localhost:5001`

### Frontend Setup
```bash
cd frontend
npm install  # or pnpm install
npm run dev
```

Frontend should run on `http://localhost:3000`

## Test Scenarios

### 1. Test Client Messaging

1. Register/Login as a client
2. Navigate to Dashboard → Messages
3. You should see:
   - List of conversations (if any cases exist)
   - Ability to send messages
   - Real-time unread count in navigation
4. Send a test message
5. Verify message appears in conversation

### 2. Test Manager Messaging

1. Register/Login as a case manager
2. Navigate to Manager Dashboard → Messages
3. You should see:
   - All client conversations for assigned cases
   - Unread message filter
   - Message count badge in navigation
4. Select a conversation
5. Send a response to client
6. Verify real-time updates

### 3. Test Admin Messaging

1. Login as super admin
2. Navigate to Admin Panel → Messages
3. You should see:
   - Statistics dashboard (total, unread, conversations)
   - All conversations system-wide
   - Filter and search functionality
4. Browse through conversations
5. Click to view case details

### 4. Test Real-time Updates

1. Open two browser windows:
   - Window 1: Client logged in
   - Window 2: Manager logged in
2. Send message from client
3. Verify manager receives notification immediately
4. Verify unread count updates in real-time
5. Open conversation on manager side
6. Verify message marked as read

### 5. Test WebSocket Connection

1. Open browser console
2. Look for WebSocket connection logs:
   ```
   [WebSocket] Connecting to: http://localhost:5001
   [WebSocket] Connected with ID: xxxxx
   ```
3. Send a message
4. Verify real-time event received:
   ```
   [WebSocket] New message received: {...}
   ```

## API Endpoint Testing

### Test Message Endpoints with curl

```bash
# Login to get token
TOKEN="your_jwt_token_here"

# Get unread count
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/messages/unread-count

# Get conversations
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/messages/conversations

# Get case messages
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/cases/1/messages

# Send a message
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipient_id": 2, "content": "Test message"}' \
  http://localhost:5001/cases/1/messages

# Mark message as read
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/messages/1/read

# Get all messages (admin only)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5001/messages/all?limit=10"
```

## Expected Results

### Client Interface
✅ See conversations with case managers
✅ Send/receive messages
✅ Unread count badge updates
✅ Messages marked as read when opened
✅ Real-time message delivery

### Manager Interface
✅ See all assigned client conversations
✅ Filter by unread messages
✅ Send messages to clients
✅ View case status and details
✅ Real-time notifications
✅ Read receipts (double check marks)

### Admin Interface
✅ Statistics dashboard displays correctly
✅ View all system conversations
✅ Filter and search functionality works
✅ Quick navigation to cases
✅ User role indicators visible
✅ Unread message tracking

## Troubleshooting

### Issue: "No conversations found"
- Ensure you have cases in the system
- Verify user is assigned to cases (for managers)
- Check database has case records

### Issue: "WebSocket not connecting"
- Check backend is running
- Verify Flask-SocketIO is installed
- Check browser console for connection errors
- Ensure CORS is configured properly

### Issue: "Unread count not updating"
- Refresh the page
- Check WebSocket connection status
- Verify token is valid
- Check browser console for errors

### Issue: "Cannot send messages"
- Verify recipient exists and is valid for the case
- Check user has permission to send messages
- Ensure case is assigned to a manager
- Check API endpoint response for errors

## Success Criteria

The messaging system is working correctly if:

1. ✅ All three user types can access their respective message interfaces
2. ✅ Messages are sent and received successfully
3. ✅ Unread counts update in real-time
4. ✅ WebSocket connection establishes automatically
5. ✅ Messages are marked as read when viewed
6. ✅ Search and filter functionality works
7. ✅ Mobile responsive design works on all screen sizes
8. ✅ No console errors during normal operation

## Performance Checks

- Message list loads within 2 seconds
- Real-time updates appear within 1 second
- Unread count updates within 30 seconds maximum
- No memory leaks after extended use
- WebSocket reconnects automatically after disconnect

## Security Checks

- ✅ Unauthenticated users cannot access endpoints
- ✅ Users can only see their own conversations
- ✅ Managers see only assigned cases
- ✅ Admins have system-wide access
- ✅ CSRF protection enabled
- ✅ XSS protection in place

## Next Steps After Testing

1. Monitor system performance under load
2. Collect user feedback
3. Implement additional features from enhancement list
4. Set up monitoring and alerting
5. Document any issues or edge cases discovered

## Support

For issues or questions:
1. Check the MESSAGING_SYSTEM_GUIDE.md
2. Review browser console logs
3. Check backend logs
4. Verify database state
5. Contact development team

---

**Testing Status: Ready for Testing**
Date: December 19, 2025
