# Deployment Guide

## Overview
This guide covers deploying the Student Learning Platform to production using Vercel (frontend + backend) and Supabase (database migrations).

---

## 1. Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel

### Step 1: Connect Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: Next.js (for frontend)
   - Root Directory: `frontend`

### Step 2: Environment Variables
Set these in Vercel dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-api.vercel.app
NODE_ENV=production
```

### Step 3: Deploy Backend
Backend can be deployed as a serverless function:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd backend
vercel --prod
```

Or configure in `vercel.json` at root for monorepo setup (already included).

### Step 4: Configure Domain
- Add custom domain in Vercel dashboard
- Update `FRONTEND_URL` and `BACKEND_URL` in environment variables

---

## 2. Supabase Setup (Optional: for PostgreSQL migrations)

If migrating from MongoDB to Supabase PostgreSQL:

### Step 1: Initialize Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref
```

### Step 2: Create Migrations
```bash
# Create initial migration
node supabase-migrate.js create initial_schema

# Edit migration files in backend/supabase/migrations/
# Then push to Supabase
supabase db push
```

### Step 3: Environment Variables
Add to Vercel:
```
DATABASE_URL=postgresql://user:pass@db.supabase.co/postgres
```

---

## 3. GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build backend
        run: npm run build:backend
      
      - name: Build frontend
        run: npm run build:frontend
      
      - name: Run API tests
        env:
          API_URL: http://localhost:5000
        run: npm run test:api
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod
```

---

## 4. Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] MongoDB connection string verified
- [ ] Frontend built successfully locally
- [ ] Backend build passes TypeScript checks
- [ ] API tests pass: `npm run test:api`
- [ ] No dev routes exposed (`/dev/*` routes removed in production)
- [ ] HTTPS enabled on both frontend and backend

---

## 5. Monitoring & Logs

### Vercel
- View logs: https://vercel.com/dashboard → Project → Deployments → Logs

### MongoDB Atlas
- Monitor database: https://cloud.mongodb.com → Clusters → Metrics

### Supabase (if used)
- View logs: https://supabase.com/dashboard → Project → Logs

---

## 6. Rollback

If deployment fails:

```bash
# Vercel rollback
vercel rollback

# Or redeploy previous commit
git revert <commit-hash>
git push
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
