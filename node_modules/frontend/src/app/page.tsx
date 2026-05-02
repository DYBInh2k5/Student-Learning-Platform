'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🎓 LearnHub</h1>
          <div className="flex gap-4">
            <Link href="/login" className="text-white hover:text-blue-100">Login</Link>
            <Link href="/register" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-20">
        <div className="text-center text-white mb-12">
          <h2 className="text-5xl font-bold mb-4">Learn Programming Together</h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of students, access courses, solve exercises, and grow skills
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
              Get Started
            </Link>
            <Link href="/courses" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
              Browse Courses
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Learn</h3>
            <p className="text-white/80">Access structured courses from basics to advanced programming</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
            <p className="text-white/80">Share knowledge, help peers, and grow as a community</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Practice</h3>
            <p className="text-white/80">Solve real-world exercises and track your progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
