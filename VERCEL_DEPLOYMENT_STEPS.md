# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: https://github.com/DYBInh2k5/Student-Learning-Platform
- [x] Backend TypeScript build passes
- [x] Frontend Next.js build passes (17 routes)
- [x] Environment variables configured locally
- [x] MongoDB Atlas connection string obtained
- [x] JWT_SECRET generated
- [x] Postman tests passing

---

## 📋 Step 1: Prepare Environment Variables

### Get These Values Ready:

1. **MONGODB_URI** - Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/student-platform
   ```

2. **JWT_SECRET** - Create a strong secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
3. **FRONTEND_URL** - Will be assigned by Vercel (e.g., https://your-frontend.vercel.app)
4. **BACKEND_URL** - Will be assigned by Vercel (e.g., https://your-backend.vercel.app)
5. **NODE_ENV** - Set to `production`

---

## 🔗 Step 2: Deploy via GitHub Integration (Recommended)

### Option A: Automatic Deployment (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click: "New Project"

2. **Import GitHub Repository**
   - Select: `DYBInh2k5/Student-Learning-Platform`
   - Choose: Root directory
   - Select: Deploy both frontend and backend

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add each variable:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Your generated secret
     - `FRONTEND_URL` - (auto-populated after deployment)
     - `BACKEND_URL` - (auto-populated after deployment)
     - `NODE_ENV` - `production`

4. **Deploy**
   - Click: "Deploy"
   - Wait for build to complete (5-10 minutes)

5. **Get Your URLs**
   - Frontend: https://student-platform-frontend.vercel.app
   - Backend: https://student-platform-backend.vercel.app

---

### Option B: CLI Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy Frontend
cd frontend
vercel --prod
cd ..

# 4. Deploy Backend
cd backend
vercel --prod
cd ..

# 5. Update environment variables in Vercel dashboard
```

---

## 🔐 Step 3: Configure Environment Variables on Vercel

**Frontend Environment Variables:**
1. Go to Vercel Project → Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.vercel.app
   ```

**Backend Environment Variables:**
1. Go to Vercel Project → Settings → Environment Variables
2. Add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/student-platform
   JWT_SECRET=your_generated_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   BACKEND_URL=https://your-backend.vercel.app
   NODE_ENV=production
   ```

---

## ✅ Step 4: Verify Deployment

### Test Backend
```bash
curl https://your-backend.vercel.app/api/health
# Response: { "status": "ok" }
```

### Test Frontend
Visit: https://your-frontend.vercel.app
- Check if page loads
- Open browser console (F12)
- Verify no connection errors

### Test Real-time Notifications
1. Login to the app
2. Go to /notifications page
3. In another browser window, follow the user or send a message
4. Check if notification appears in real-time

---

## 🔄 Automatic Redeployment

With GitHub integration enabled:
- Every push to `main` branch automatically triggers deployment
- Deployment status visible in GitHub PR/commit
- Vercel will run the CI/CD pipeline automatically

**GitHub Actions Pipeline:**
- ✅ Build backend (TypeScript → JavaScript)
- ✅ Build frontend (Next.js)
- ✅ Lint both projects
- ✅ Deploy to Vercel on successful build

---

## 📊 Monitoring & Logs

### View Logs
1. **Vercel Dashboard → Deployments**
2. **Click on a deployment → Logs**
3. **See build output and runtime errors**

### Check Real-time Notifications
```bash
# Test via API
curl -X POST https://your-backend.vercel.app/api/notifications/dev/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipientId": "user_id",
    "type": "post_liked",
    "title": "Post Liked",
    "message": "Someone liked your post",
    "importance": "normal"
  }'
```

---

## 🔧 Troubleshooting

### Issue: Backend Won't Start
```
Solution: Check MONGODB_URI in environment variables
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Ensure credentials have proper database permissions
```

### Issue: Socket Connection Fails
```
Solution: Check FRONTEND_URL and BACKEND_URL match deployment URLs
- Frontend: NEXT_PUBLIC_SOCKET_URL must match backend deployment URL
- Verify Socket.IO middleware authentication works
```

### Issue: Notifications Not Showing
```
Solution: Check browser console for errors
1. F12 → Console tab
2. Look for WebSocket connection errors
3. Verify socket.io connection successful
4. Check backend logs for emission errors
```

### Issue: Build Fails
```
Solution: Run local build first
- Backend: npm run build:backend
- Frontend: npm run build:frontend
- Fix any errors locally before pushing
```

---

## 🎉 Success Indicators

✅ Frontend loads without errors
✅ Can login successfully
✅ Backend API responds
✅ Socket.IO connection shows in browser DevTools
✅ Notifications appear in real-time
✅ Messages send and receive instantly
✅ GitHub Actions shows green checkmarks

---

## 📚 Additional Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Socket.IO: https://socket.io/docs/
- Next.js: https://nextjs.org/docs
- Express: https://expressjs.com/

---

## 🚨 Important Notes

1. **Keep JWT_SECRET private** - Never commit to GitHub
2. **Monitor MongoDB usage** - Free tier has limits
3. **Update environment variables** after deployment URLs are generated
4. **Test in production** - Use staging environment first if possible
5. **Setup error monitoring** - Use Vercel analytics

---

## Next Steps After Deployment

1. ✅ Setup production domain (optional)
   ```
   Settings → Domains → Add custom domain
   ```

2. ✅ Setup GitHub secrets for CI/CD (optional)
   ```
   Repo → Settings → Secrets
   Add: VERCEL_TOKEN, VERCEL_PROJECT_ID, etc.
   ```

3. ✅ Monitor application in production
   ```
   Vercel Dashboard → Monitoring → Analytics
   ```

4. ✅ Setup email notifications (optional)
   ```
   Vercel Dashboard → Notifications → Email
   ```

---

**Deployment Status:** 🟢 **READY TO DEPLOY**

Run this command to get started:
```bash
npm install -g vercel && vercel login
```

Then visit https://vercel.com/new to import your GitHub repository!
