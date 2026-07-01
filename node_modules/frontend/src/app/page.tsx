'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type CommunityStats = {
  users: number;
  courses: number;
  posts: number;
  messages: number;
  newUsers: number;
  newPosts: number;
  newMessages: number;
  communityMomentum: number;
};

const defaultStats: CommunityStats = {
  users: 0,
  courses: 0,
  posts: 0,
  messages: 0,
  newUsers: 0,
  newPosts: 0,
  newMessages: 0,
  communityMomentum: 0,
};

export default function Home() {
  const [stats, setStats] = useState<CommunityStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/admin/stats/public`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load community stats');
        }

        setStats(data.data);
      } catch (err: any) {
        setError(err.message || 'Unable to load community stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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

        <div className="mt-12 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Community pulse</p>
              <h3 className="text-2xl font-semibold text-white">A growing learning network</h3>
            </div>
            <div className="rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-medium text-emerald-100">
              {loading ? 'Syncing live data…' : `${stats.communityMomentum} moments shared`}
            </div>
          </div>

          {error ? (
            <p className="mt-4 text-sm text-rose-100">{error}</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Students', value: stats.users, note: `${stats.newUsers} joined this month`, icon: '👩‍🎓' },
                { label: 'Courses', value: stats.courses, note: 'Fresh learning paths', icon: '📚' },
                { label: 'Posts', value: stats.posts, note: `${stats.newPosts} new discussions`, icon: '💬' },
                { label: 'Messages', value: stats.messages, note: `${stats.newMessages} sent recently`, icon: '⚡' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/20 bg-slate-950/20 p-4">
                  <div className="text-3xl">{item.icon}</div>
                  <p className="mt-3 text-sm text-blue-100">{item.label}</p>
                  <p className="text-3xl font-semibold text-white">{loading ? '—' : item.value}</p>
                  <p className="mt-2 text-sm text-white/70">{loading ? 'Loading…' : item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
