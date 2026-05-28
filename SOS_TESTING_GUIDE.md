# 🚨 SOS System Testing Guide

## System Overview

The SOS system enables users to send real-time emergency alerts to admins with GPS location tracking. The system uses WebSocket for sub-second latency communication.

## Architecture

```
User clicks SOS → Captures GPS → WebSocket sends alert → Admin receives instantly
```

- **Frontend**: Next.js (Port 3000)
- **Socket Server**: Express + Socket.io (Port 3001)
- **Database**: PostgreSQL with EmergencyAlert table
- **Real-time**: WebSocket with JWT authentication

## Testing Steps

### 1. Start Both Servers

**Terminal 1 - Socket Server:**
```bash
cd socket-server
npm run dev
```
Expected output: `✅ Socket.io server running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output: `✓ Ready on http://localhost:3000`

### 2. Test as User (Send SOS)

1. Login as a regular user
2. Look for the red **SOS** button (bottom-right corner, floating)
3. Click the SOS button
4. Modal opens with:
   - Connection status (should show "✓ Connected")
   - Severity selector (Critical/High/Medium)
   - Optional message field
5. Click "Send SOS Alert"
6. Browser will request location permission - **Allow it**
7. Alert should be sent successfully
8. You'll see: "🚨 Emergency alert sent successfully! Help is on the way."

### 3. Test as Admin (Receive & Manage Alerts)

1. Login as admin user
2. Navigate to: `/dashboard/admin/emergency`
3. You should see:
   - System status (WebSocket: Connected, Notifications: Enabled)
   - Alert counters (Active, Acknowledged, Total)
   - Real-time alert list

**When a user sends SOS:**
- Alert appears instantly (no page refresh needed)
- Browser notification pops up (if permission granted)
- Alert shows: User ID, severity, message, location, timestamp

**Admin Actions:**
1. Click "Acknowledge" - marks alert as being handled
2. Click "Resolve" - closes the alert
3. Click "📍 View Location" - opens Google Maps with exact coordinates

### 4. Real-Time Features to Verify

✅ **Sub-second latency**: Alert appears on admin dashboard immediately  
✅ **WebSocket connection**: Status shows "Connected" on both sides  
✅ **GPS accuracy**: Location coordinates are captured correctly  
✅ **Browser notifications**: Desktop notification appears for admins  
✅ **Status updates**: Acknowledge/Resolve updates appear in real-time  
✅ **Multiple admins**: All admins receive the same alert simultaneously

## Database Verification

Check the database to see stored alerts:

```sql
SELECT * FROM "EmergencyAlert" ORDER BY "createdAt" DESC LIMIT 10;
```

You should see:
- userId
- latitude, longitude
- message
- severity (CRITICAL/HIGH/MEDIUM)
- status (ACTIVE/ACKNOWLEDGED/RESOLVED)
- timestamps

## Troubleshooting

### SOS Button Not Visible
- Make sure you're logged in
- Check browser console for errors
- Verify `NEXT_PUBLIC_SOCKET_URL` is set in `.env.local`

### "Disconnected" Status
- Ensure socket server is running on port 3001
- Check if JWT token is valid
- Look at socket server logs for connection errors

### Location Not Working
- Browser must support Geolocation API
- User must grant location permission
- HTTPS required in production (localhost works in dev)

### Alert Not Appearing on Admin Dashboard
- Verify admin is on `/dashboard/admin/emergency` page
- Check WebSocket connection status
- Look at browser console and server logs

## Expected Console Logs

**User Side (when sending SOS):**
```
✅ Socket connected
✅ Socket authenticated
🚨 EMERGENCY SOS RECEIVED: { userId: "...", severity: "CRITICAL", ... }
```

**Admin Side (when receiving alert):**
```
✅ Socket connected
✅ Socket authenticated
🚨 New emergency alert: { id: "...", userId: "...", ... }
```

**Socket Server:**
```
✅ Socket.io server running on port 3001
🔌 Client connected: socket-id
✅ User authenticated: userId, role
🚨 EMERGENCY SOS RECEIVED: { userId, severity, location }
✅ Alert alert-id broadcasted to admins
```

## Production Considerations

Before deploying to production:

1. **HTTPS Required**: Geolocation API requires secure context
2. **Environment Variables**: Update `NEXT_PUBLIC_SOCKET_URL` to production URL
3. **Database**: Ensure PostGIS extension is enabled for location queries
4. **Monitoring**: Set up alerts for failed SOS attempts
5. **Scaling**: Consider Redis adapter for Socket.io if multiple server instances
6. **Privacy**: Implement data retention policies for emergency alerts

## Success Criteria

✅ User can send SOS with one click  
✅ GPS location is captured accurately  
✅ Alert reaches admin in < 1 second  
✅ Admin can acknowledge and resolve alerts  
✅ All actions update in real-time  
✅ System works across multiple browser tabs  
✅ Notifications work correctly  
✅ Database stores all alert data

## Test Complete! 🎉

If all steps work correctly, your SOS system is fully functional and ready for real-world testing.
