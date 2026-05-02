# Student Learning Platform - Development Guide

## Project Overview
A full-stack educational social network platform for programming students with courses, exercises, social features, and real-time messaging.

## Architecture
- **Frontend:** Next.js 14 (React) with Tailwind CSS
- **Backend:** Express.js with MongoDB
- **Real-time:** Socket.io for messaging
- **Auth:** JWT-based authentication

## Key Technologies
- Next.js, React, TypeScript
- Express, Node.js, MongoDB
- Socket.io, Zustand, Tailwind CSS

## Useful Commands

### Setup
```bash
npm install  # Install all dependencies
npm run dev:frontend  # Start frontend only
npm run dev:backend   # Start backend only
```

### Build
```bash
npm run build:frontend
npm run build:backend
```

### Database
- Configure MongoDB in `backend/.env`
- Models: User, Course, Lesson, Exercise, Post, Message

## Project Structure Guide
- `/frontend/src/app/` - Next.js pages
- `/backend/src/` - API routes, controllers, models
- `/shared/` - Shared TypeScript types
- `/.github/` - GitHub configuration

## Development Conventions
1. Use TypeScript for type safety
2. Follow RESTful API design
3. Use Zustand for frontend state
4. Implement error handling with try-catch

## Common Tasks

### Adding a New Feature
1. Define types in `shared/index.ts`
2. Create MongoDB model in `backend/src/models/`
3. Create API route in `backend/src/routes/`
4. Implement controller in `backend/src/controllers/`
5. Build UI component in `frontend/src/components/`
6. Add page or update in `frontend/src/app/`

### Deploying
- Docker: `docker-compose up`
- Cloud: Follow README deployment section

## Debugging
- Backend logs: Check console output on port 5000
- Frontend: Use browser dev tools
- Socket.io: Check WebSocket connections

## Additional Resources
- See [README.md](../README.md) for complete documentation
- Check API routes for endpoint details
- Review models for database schema
