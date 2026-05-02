#!/bin/bash
# Vercel Deployment Quick Start
# Run this script to deploy to Vercel

set -e

echo "🚀 Student Learning Platform - Vercel Deployment"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔑 Step 1: Login to Vercel"
echo "   Run: vercel login"
vercel login

echo ""
echo "🎯 Step 2: Deploy Frontend"
echo "   Deploying to Vercel..."
cd frontend
vercel --prod
cd ..

echo ""
echo "🎯 Step 3: Deploy Backend"
echo "   Deploying to Vercel..."
cd backend
vercel --prod
cd ..

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📍 Next steps:"
echo "   1. Check Vercel dashboard: https://vercel.com"
echo "   2. Set environment variables in project settings:"
echo "      - MONGODB_URI"
echo "      - JWT_SECRET"
echo "      - FRONTEND_URL"
echo "      - BACKEND_URL"
echo "   3. Configure custom domain (optional)"
echo ""
