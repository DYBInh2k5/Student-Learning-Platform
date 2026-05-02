# Student Learning Platform

A full-stack educational social network platform where students can learn programming, access courses, solve exercises, share knowledge, and connect with peers.

## Features

✨ **Core Features:**
- 📚 **Courses Management** - Browse, enroll, and complete programming courses
- 🎯 **Exercises** - Practice problem-solving with real-time code execution
- 💬 **Social Features** - Post updates, comment on posts, and build community
- 💌 **Real-time Messaging** - Send instant messages with Socket.io
- 🔔 **Real-time Notifications** - Instant push notifications for all events (new in v2.0)
- 🏆 **Gamification** - Earn points and badges for achievements
- 👥 **User Management** - Profiles, follower system, role-based access

**✨ NEW in v2.0:**
- 🔴 **Live Notifications** - Socket.IO-based real-time event delivery
- 📊 **Automated Testing** - Postman collection + Newman CLI
- 🚀 **CI/CD Pipeline** - GitHub Actions with auto-deploy to Vercel
- ☁️ **Production Ready** - Vercel + Supabase configurations included
- 🛠️ **Dev Tools** - In-memory MongoDB fallback, migration helpers

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Real-time:** Socket.io Client
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Password:** bcryptjs

## Project Structure

```
student-learning-platform/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Pages and routes
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── store/        # Zustand stores
│   │   └── lib/          # Utilities
│   └── public/           # Static assets
│
├── backend/              # Express.js API
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── services/     # Business logic
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utilities
│   └── tsconfig.json
│
└── shared/               # Shared TypeScript types
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB local or cloud (MongoDB Atlas)

### 1. Clone and Install Dependencies

```bash
cd student-learning-platform

# Install all dependencies
npm install

# Or install individually
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Environment Setup

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**Frontend (.env.local):**
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `MONGODB_URI` in backend/.env

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Server runs on http://localhost:5000 with Socket.IO
# Uses in-memory MongoDB if MONGODB_URI is unreachable
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Application runs on http://localhost:3000
```

### Testing Real-time Notifications

```bash
# In a separate terminal, with backend running:
node backend/scripts/testNotify.js
# Connects as client and creates a test notification
```

### Running API Tests

```bash
npm run test:api
# Runs Postman collection with Newman
# Tests: auth, notifications, messages, follows
# Generates test report in test-results.json
```

### Production Build

**Backend:**
```bash
npm run build:backend
npm run start:backend
```

**Frontend:**
```bash
npm run build:frontend
npm run start:frontend
```

## 🔔 Real-time Notifications (v2.0)

### Notification Types
- `user_followed` - When you're followed
- `post_liked` - When your post is liked
- `post_commented` - When someone comments on your post
- `new_message` - When you receive a direct message
- `course_started` - When a student enrolls (for instructors)
- `achievement_unlocked` - When you earn an achievement
- `course_review` - When your course gets reviewed

### Architecture
- **Backend:** Socket.IO server with JWT authentication
- **Frontend:** Socket.IO client auto-connects with user token
- **Storage:** MongoDB persistence + real-time push

### Testing Notifications
See [SYSTEM_STATUS.md](SYSTEM_STATUS.md) for testing guide.

---

## 🚀 Deployment

### Quick Deploy to Vercel

**Prerequisites:**
- GitHub account with code pushed
- Vercel account (https://vercel.com)
- Environment variables configured

**Steps:**
1. Push to GitHub (see below)
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `FRONTEND_URL` - Your frontend URL
   - `BACKEND_URL` - Your backend API URL
5. Deploy!

**GitHub Push & Auto-Deploy:**
```bash
# Ensure git is configured
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Commit and push
git add .
git commit -m "feat: realtime notifications + CI/CD pipeline"
git push origin main
```

For complete deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor only)
- `POST /api/courses/:id/enroll` - Enroll in course

### Posts (Social)
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Add comment

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/:userId` - Get conversation with user
- `POST /api/messages/read` - Mark message as read

## WebSocket Events

### Client → Server
- `user-online` - Notify user is online
- `send-message` - Send message
- `typing` - Notify typing
- `disconnect` - User disconnected

### Server → Client
- `receive-message` - New message received
- `user-typing` - User is typing
- `user-status-changed` - User online/offline status

## Database Models

- **User** - Student/Instructor profiles
- **Course** - Course information
- **Lesson** - Course lessons
- **Exercise** - Programming exercises
- **Post** - Social media posts
- **Message** - Direct messages

## Features Breakdown

### 1. User Management
- Registration & Login
- User profiles with avatar
- Role-based access (Student, Instructor, Admin)
- Points and badge system

### 2. Course Management
- Create and manage courses
- Add lessons to courses
- Organize by category and difficulty
- Student enrollment tracking

### 3. Exercises
- Programming challenges
- Test case validation
- Code submission
- Points and feedback

### 4. Social Features
- Create and share posts
- Comment on posts
- Like system
- Follow other students

### 5. Real-time Messaging
- Direct messaging between users
- Real-time delivery with WebSocket
- Typing indicators
- Message read status

### 6. Gamification
- Points system for achievements
- Badges for milestones
- Leaderboard (future feature)

## Deployment

### Docker (Recommended)
```bash
docker-compose up
```

### Cloud Platforms

**Heroku:**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

**Vercel (Frontend):**
```bash
npm install -g vercel
vercel
```

**AWS/DigitalOcean:**
- Deploy backend to EC2/Droplet
- Deploy frontend to S3/CloudFront

## Testing & CI/CD

### Automated API Tests
```bash
npm run test:api
```
Uses Postman collection with Newman to test all major endpoints.

### GitHub Actions
Automatically:
- Builds backend (TypeScript)
- Builds frontend (Next.js)
- Lints both projects
- Deploys to Vercel on main branch

See `.github/workflows/ci-cd.yml` for workflow details.

### Test Files
- `postman_collection.json` - API endpoint tests
- `newman-test.js` - Test runner script
- `backend/scripts/testNotify.js` - Real-time notification test

---

## Contributing

1. Create feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@learnhub.com
- Discord: [Community Server]

---

Built with ❤️ by the Learning Community
