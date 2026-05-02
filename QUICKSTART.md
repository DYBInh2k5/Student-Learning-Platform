Quickstart — Student Learning Platform (local dev)

Backend (dev with in-memory Mongo fallback):

1. Install dependencies (from repo root):

```powershell
npm install
```

2. Start backend and frontend (from repo root):

```powershell
npm run dev:backend
npm run dev:frontend
```

Notes:
- If `MONGODB_URI` is not set or unreachable, the backend will automatically start an in-memory MongoDB for local development (mongodb-memory-server).
- The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000` by default.

Testing realtime notifications (dev):

1. Connect a client (the frontend notifications page uses socket IO).
2. You can also run the test helper script to simulate a client and create a notification:

```powershell
node backend/scripts/testNotify.js
```

This script connects with a test JWT and posts to the dev notification endpoint, demonstrating realtime delivery.
# 🚀 Quick Start Guide

## ✅ System Currently Running

**Backend:** Port 5000 ✅  
**Frontend:** Port 3000 ✅  
**Database:** MongoDB Atlas ✅

### Access the Platform
👉 **Open Browser:** http://localhost:3000

---

## 📋 First Time Setup

### 1. Register Account
1. Go to http://localhost:3000
2. Click "Register" 
3. Create account with email, password, and name

### 2. Explore Features
- ✅ **Courses** - Browse and enroll in courses
- ✅ **Feed** - Create posts, like, comment
- ✅ **Exercises** - Write code and submit for grading
- ✅ **Messaging** - Real-time chat with users
- ✅ **Admin Panel** - System management (if admin role)

---

## 🎯 Feature Guide

### 📚 Courses (`/courses`)
- View all available courses
- Enroll in courses
- Access course lessons

### 💻 Exercises (`/exercises`)
- Browse coding exercises
- Write solutions in code editor
- Submit code for automatic grading
- View test case results
- Track submission history

### 📝 Feed (`/feed`)
- Create posts and share ideas
- Like and comment on posts
- Follow other users
- Real-time feed updates

### 💬 Messages
- Start conversations with users
- Send real-time messages
- Mark messages as read

### 👨‍💼 Admin Dashboard (`/admin`)
- View system statistics
- Manage user roles
- Moderate content
- Access admin features

---

## 🔑 Admin Setup

To enable admin features:

#### Option 1: MongoDB Compass
1. Connect to MongoDB Atlas cluster
2. Find user in `student-platform.users` collection
3. Change `role` from `"student"` to `"admin"`
4. Logout and login to see admin panel

#### Option 2: MongoDB Shell
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Public Endpoints
- `GET /api/posts` - Get all posts
- `GET /api/courses` - Get all courses
- `GET /api/exercises` - Get all exercises

### Protected Endpoints (Require JWT Token)
- `POST /api/posts` - Create post
- `POST /api/messages` - Send message
- `POST /api/courses/:id/enroll` - Enroll in course

---

## 🔧 Useful Commands

### Check if Services are Running
```powershell
# Test backend
curl http://localhost:5000/health

# Test frontend (should return HTML)
curl http://localhost:3000
```

### Start Services
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Stop Services
```powershell
# Kill all Node processes
Get-Process node | Stop-Process -Force
```

### Production Build
```bash
npm run build:backend
npm run build:frontend
```

---

## ⚠️ Troubleshooting

### Port Already in Use
```powershell
# Free port 5000
Get-NetTCPConnection -LocalPort 5000 | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Frontend Won't Load
- Try ports: 3000, 3001, 3002
- Clear browser cache: Ctrl + Shift + Delete
- Check browser console: F12

### Can't Connect to Database
- Verify MongoDB Atlas IP whitelist includes your IP
- Check `.env` connection string is correct
- Verify internet connection

### Messages Not Sending
- Ensure backend is running on port 5000
- Check browser console for Socket.IO errors
- Try logging out and back in

---

## 📊 Project Structure

```
d:\codeee\
├── backend/
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   └── index.ts      # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Pages and routes
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── store/        # Zustand state
│   └── package.json
├── SYSTEM_STATUS.md      # Complete system info
└── QUICKSTART.md         # This file
```

---

## 🎓 Testing the System

### Test User Registration
1. Go to http://localhost:3000
2. Register with email, password, name
3. You'll be logged in automatically

### Test Course Enrollment
1. Go to /courses
2. Click "Enroll" on any course
3. Course should appear on dashboard

### Test Exercise Submission
1. Go to /exercises
2. Select an exercise
3. Write code in the editor
4. Click "Submit"
5. See test results

### Test Messaging
1. Register multiple accounts
2. Find another user
3. Start conversation
4. Send message - see real-time delivery

---

## 📚 For More Information

- **System Status:** See `SYSTEM_STATUS.md`
- **Full Docs:** See `README.md`
- **Build Info:** `npm run build` output
- **API Docs:** Backend has route definitions in `src/routes/`

---

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try: `mongodb://localhost:27017/student-platform`

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :3000` then `kill -9 <PID>`

### Dependencies Not Installed
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### CORS Issues
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL is `http://localhost:3000`

---

## 📚 Project Features

1. **Authentication** - Register, login, profile management
2. **Courses** - Browse and enroll in programming courses
3. **Exercises** - Solve coding problems
4. **Social** - Post updates, comment, build community
5. **Messaging** - Real-time chat with other students
6. **Gamification** - Points and badges system

---

## 🎯 Next Steps

1. Create your account
2. Browse available courses
3. Enroll in a course
4. Complete lessons and exercises
5. Connect with other students
6. Earn points and badges

---

## 📞 Support

For issues or questions:
- Check the README.md for detailed documentation
- Review development-guide.md for architecture details
- Check backend console for API errors
- Check browser console for frontend errors

Happy learning! 🎓
