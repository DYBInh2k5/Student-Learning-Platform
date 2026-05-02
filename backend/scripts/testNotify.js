const ioClient = require('socket.io-client');
const axios = require('axios');

const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';
const SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
const jwt = require('jsonwebtoken');

const payload = { userId: 'test-user-1', role: 'user' };
const token = jwt.sign(payload, SECRET);

console.log('Using token:', token);

const socket = ioClient(BACKEND, { auth: { token } });

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

socket.on('notification-created', (data) => {
  console.log('Received notification-created:', data);
});

socket.on('connect_error', (err) => {
  console.error('Socket connect error:', err.message);
});

setTimeout(async () => {
  try {
    const res = await axios.post(
      `${BACKEND}/api/notifications/dev/create`,
      { recipientId: 'test-user-1', type: 'test', title: 'Hello from test', message: 'This is a test', importance: 'high' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Create notification response:', res.data);
  } catch (err) {
    console.error('Create notification failed:', err?.response?.data || err.message);
  }
}, 1000);
