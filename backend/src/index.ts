import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { initSocket, setActiveUser, getSocketId, removeActiveUser } from './utils/socket';
import { config } from './config';
import { connectDB } from './config/database';
import { verifyToken } from './utils/auth';

// Routes
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import socialRoutes from './routes/social';
import messageRoutes from './routes/message';
import exerciseRoutes from './routes/exercise';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notification';
import leaderboardRoutes from './routes/leaderboard';
import progressRoutes from './routes/progress';
import reviewRoutes from './routes/review';
import achievementRoutes from './routes/achievement';
import userRoutes from './routes/user';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/posts', socialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time messaging
io.use((socket, next) => {
  const authToken = socket.handshake.auth?.token as string | undefined;
  const headerToken = socket.handshake.headers.authorization?.split(' ')[1];
  const token = authToken || headerToken;

  if (!token) {
    next(new Error('Unauthorized'));
    return;
  }

  const decoded = verifyToken(token) as { userId?: string } | null;
  if (!decoded?.userId) {
    next(new Error('Invalid token'));
    return;
  }

  socket.data.userId = decoded.userId;
  next();
});

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.data.userId as string;
  setActiveUser(userId, socket.id);
  io.emit('user-status-changed', { userId, status: 'online' });

  socket.on('send-message', (data) => {
    const recipientSocketId = getSocketId(data.recipientId);
    const payload = {
      senderId: userId,
      recipientId: data.recipientId,
      content: data.content,
      messageId: data.messageId,
      createdAt: new Date().toISOString(),
    };

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive-message', payload);
    }
    socket.emit('message-sent', { messageId: data.messageId, recipientId: data.recipientId });
  });

  socket.on('typing', (data) => {
    const recipientSocketId = getSocketId(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user-typing', { senderId: userId });
    }
  });

  socket.on('disconnect', () => {
    removeActiveUser(userId);
    io.emit('user-status-changed', { userId, status: 'offline' });
    console.log(`User disconnected: ${socket.id}`);
  });
});

// initialize socket helper
initSocket(io);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(config.PORT, () => {
      console.log(`
╭─────────────────────────────────────────╮
│   Student Learning Platform Backend     │
│   🚀 Server running on port ${config.PORT}        │
│   🔗 ${config.BACKEND_URL}         │
╰─────────────────────────────────────────╯
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
