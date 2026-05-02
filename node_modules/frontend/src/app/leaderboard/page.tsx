'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';
import { Trophy, Flame, Award } from 'lucide-react';

interface LeaderboardUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  points: number;
  currentStreak: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { request } = useApi();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<'points' | 'streaks' | 'monthly'>('points');
  const [userRank, setUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/leaderboard';
        if (activeTab === 'streaks') endpoint = '/api/leaderboard/streaks';
        if (activeTab === 'monthly') endpoint = '/api/leaderboard/monthly-challenge';

        const response = await request(endpoint);
        setLeaderboard(response.leaderboard || []);

        const rankResponse = await request('/api/leaderboard/my-rank');
        setUserRank(rankResponse);
      } catch (error: any) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
          <p className="text-gray-600">Compete with learners worldwide</p>
        </div>

        {/* Your Rank */}
        {userRank && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-indigo-600">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Your Rank</p>
                <p className="text-3xl font-bold text-indigo-600">#{userRank.rank}</p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Points</p>
                <p className="text-3xl font-bold text-green-600">{userRank.points}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Current Streak</p>
                <div className="flex justify-center items-center gap-1">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <p className="text-3xl font-bold text-orange-600">{userRank.streak}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 py-2 px-4 rounded transition ${
              activeTab === 'points'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setActiveTab('streaks')}
            className={`flex-1 py-2 px-4 rounded transition flex items-center justify-center gap-2 ${
              activeTab === 'streaks'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            Streaks
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-2 px-4 rounded transition ${
              activeTab === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly Challenge
          </button>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <Link
                key={user._id}
                href={`/user/${user._id}`}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition flex items-center gap-4 cursor-pointer"
              >
                <div className="text-xl font-bold text-gray-400 w-8 text-center">
                  {getMedalEmoji(user.rank)}
                </div>

                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                )}

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>

                <div className="flex items-center gap-6">
                  {activeTab === 'streaks' && (
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-orange-600">{user.currentStreak}</span>
                    </div>
                  )}
                  {(activeTab === 'points' || activeTab === 'monthly') && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{user.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
