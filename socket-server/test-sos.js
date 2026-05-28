// Test script v2: Simulate the full SOS WebSocket flow with proper timing
const { io } = require('socket.io-client');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret-key-change-this-in-production';
const SOCKET_URL = 'http://localhost:3001';

// Real user IDs from the database (satisfies FK constraint on EmergencyAlert)
const REAL_USER_ID = 'cmpnt0z5m0001h4413d11pc9o';
const REAL_ADMIN_ID = 'cmpnsbk9j0005zk41wuwin94a';

const adminToken = jwt.sign(
  { userId: REAL_ADMIN_ID, email: 'admin@kleverklues.com', role: 'ADMIN' },
  JWT_SECRET, { expiresIn: '1h' }
);

const userToken = jwt.sign(
  { userId: REAL_USER_ID, email: 'hello@gmail.com', role: 'USER' },
  JWT_SECRET, { expiresIn: '1h' }
);


console.log('\n🧪 ===== SOS WebSocket End-to-End Test =====\n');

// Connect BOTH sockets upfront
const adminSocket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
const userSocket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });

let adminReady = false;
let userReady = false;
let testAlertId = null;

function tryStartTest() {
  if (!adminReady || !userReady) return;

  console.log('\n🚨 Both connected — Sending SOS alert...');
  userSocket.emit('emergency:sos', {
    userId: REAL_USER_ID,
    latitude: 28.6139,
    longitude: 77.2090,
    message: 'Test SOS - automated end-to-end test',
    severity: 'CRITICAL'
  });
}

// ADMIN setup
adminSocket.on('connect', () => {
  console.log('✅ ADMIN socket connected:', adminSocket.id);
  adminSocket.emit('authenticate', { userId: REAL_ADMIN_ID, role: 'ADMIN', token: adminToken });
});

adminSocket.on('authenticated', (data) => {
  if (!data.success) { console.error('❌ ADMIN auth FAILED:', data.error); process.exit(1); }
  console.log('✅ ADMIN authenticated successfully');
  adminReady = true;
  tryStartTest();
});

adminSocket.on('emergency:alert', (alert) => {
  testAlertId = alert.id;
  console.log('\n🚨 ADMIN received emergency alert!');
  console.log('   Alert ID   :', alert.id);
  console.log('   User       :', alert.userId);
  console.log('   Location   :', alert.latitude + ', ' + alert.longitude);
  console.log('   Severity   :', alert.severity);
  console.log('   Message    :', alert.message);
  console.log('   Google Maps: https://www.google.com/maps?q=' + alert.latitude + ',' + alert.longitude);

  setTimeout(() => {
    console.log('\n👮 Admin acknowledging alert...');
    adminSocket.emit('emergency:acknowledge', { alertId: alert.id, adminId: REAL_ADMIN_ID });
  }, 500);
});

adminSocket.on('emergency:acknowledged', (data) => {
  console.log('✅ ADMIN: Alert acknowledged in system:', data.alertId);
  setTimeout(() => {
    console.log('\n✔️  Admin resolving alert...');
    adminSocket.emit('emergency:resolve', { alertId: data.alertId, adminId: REAL_ADMIN_ID });
  }, 500);
});

adminSocket.on('emergency:resolved', (data) => {
  console.log('✅ ADMIN: Alert resolved:', data.alertId);
  console.log('\n🎉 ===== FULL END-TO-END TEST PASSED =====');
  console.log('✅ User → WebSocket → DB saved → Admin alerted → Acknowledged → Resolved');
  console.log('✅ All in real-time WebSocket. Zero page refresh.\n');
  process.exit(0);
});

adminSocket.on('connect_error', (err) => {
  console.error('❌ ADMIN connect error:', err.message);
  process.exit(1);
});

// USER setup
userSocket.on('connect', () => {
  console.log('✅ USER socket connected:', userSocket.id);
  userSocket.emit('authenticate', { userId: REAL_USER_ID, role: 'USER', token: userToken });
});

userSocket.on('authenticated', (data) => {
  if (!data.success) { console.error('❌ USER auth FAILED:', data.error); process.exit(1); }
  console.log('✅ USER authenticated successfully');
  userReady = true;
  tryStartTest();
});

userSocket.on('emergency:confirmed', (data) => {
  console.log('✅ SOS confirmed to user! Alert ID:', data.alertId);
});

userSocket.on('emergency:acknowledged', (data) => {
  console.log('✅ USER notified: alert acknowledged');
});

userSocket.on('emergency:resolved', (data) => {
  console.log('✅ USER notified: alert resolved -', data.message);
});

userSocket.on('emergency:error', (err) => {
  console.error('❌ SOS ERROR:', err);
  process.exit(1);
});

userSocket.on('connect_error', (err) => {
  console.error('❌ USER connect error:', err.message);
  process.exit(1);
});

// Timeout safety
setTimeout(() => {
  console.error('\n❌ TEST TIMEOUT after 15 seconds');
  process.exit(1);
}, 15000);
