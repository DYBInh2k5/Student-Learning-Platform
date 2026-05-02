# Installation & Setup Guide

## 📋 Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **MongoDB**: Local or MongoDB Atlas (cloud)
- **Git**: For version control (optional)

## 🔧 Setup Instructions

### 1. Clone/Download the Project

```bash
# If you have git
git clone <your-repo-url>
cd student-learning-platform

# Or download the zip and extract it
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend Configuration

Create `backend/.env` file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### Frontend Configuration

Create `frontend/.env.local` file:
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Setup MongoDB Database

#### Option A: Local MongoDB

**Windows:**
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run installer and follow instructions
3. MongoDB service starts automatically
4. Verify: Open command prompt and run `mongod`

**Mac:**
```bash
# Using Homebrew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify Connection:**
```bash
# In another terminal
mongosh  # or mongo (older versions)
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Replace `MONGODB_URI` in `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-platform
   ```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
╭─────────────────────────────────────────╮
│   Student Learning Platform Backend     │
│   🚀 Server running on port 5000        │
│   🔗 http://localhost:5000             │
╰─────────────────────────────────────────╯
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  
✓ Ready in 2.5s
```

### 6. Access the Application

Open your browser and visit: **http://localhost:3000**

## ✅ Verification

### Check Backend is Running
```bash
# In your browser or using curl
curl http://localhost:5000/health
# Response: {"status":"ok","timestamp":"2024-..."}
```

### Check MongoDB Connection
```bash
# In MongoDB shell
mongosh
> show dbs
> use student-platform
> show collections
```

### First Run Setup

1. Visit http://localhost:3000
2. Click "Sign Up" to create your account
3. Fill in your details:
   - First Name
   - Last Name
   - Username
   - Email
   - Password

4. You'll be redirected to the dashboard
5. Browse courses and start learning!

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Error

```
MongooseError: Cannot connect to MongoDB
```

**Solutions:**
1. Ensure MongoDB is running: `mongod` or `brew services list`
2. Check `MONGODB_URI` in `backend/.env`
3. If using MongoDB Atlas, verify:
   - IP whitelist (add 0.0.0.0/0 for development)
   - Connection string is correct
   - Database user has permissions

### CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
- Check `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Ensure both frontend and backend are running

### Dependencies Not Found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting

1. **Frontend:** Press `Ctrl+Shift+R` to hard refresh browser
2. **Backend:** Restart `npm run dev` (it has auto-reload)

## 📚 Next Steps

1. **Create an Account** - Register on the platform
2. **Browse Courses** - Check out available programming courses
3. **Enroll in a Course** - Click "Enroll Now" on any course
4. **Complete Lessons** - Study course materials
5. **Solve Exercises** - Practice programming problems
6. **Connect with Others** - Share posts and send messages
7. **Earn Badges** - Complete challenges and earn points

## 🚀 Deployment

### Using Docker (Recommended)

```bash
# Ensure Docker is installed
docker --version

# Run the application
docker-compose up

# Stop the application
docker-compose down
```

### Manual Deployment

See [README.md](README.md) for cloud deployment instructions.

## 📞 Getting Help

- **Documentation:** See [README.md](README.md)
- **Quick Start:** See [QUICKSTART.md](QUICKSTART.md)
- **Backend Issues:** Check backend `console.log` output
- **Frontend Issues:** Open browser Developer Tools (F12)
- **Database Issues:** Check MongoDB Shell or Atlas console

## 🎓 Development Tips

### Add a New Course

**Using API (Postman/cURL):**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Advanced JavaScript",
    "description": "Deep dive into JS",
    "category": "JavaScript",
    "level": "advanced"
  }'
```

### Create Sample Data

Database seed script would go in `backend/src/scripts/seed.ts`

### Reset Database

```bash
# In MongoDB shell
use student-platform
db.dropDatabase()
```

---

✨ **Happy Learning!** ✨

If you encounter any issues, check the troubleshooting section or create an issue on GitHub.
