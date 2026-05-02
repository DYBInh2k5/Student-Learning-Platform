'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Search, Users, Heart, MessageCircle } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  points: number;
  followers: any[];
}

export default function DiscoverPage() {
  const { request } = useApi();
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'suggested' | 'all'>('suggested');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (activeTab === 'suggested') {
          const response = await request('/api/users/suggested?limit=12');
          setSuggestedUsers(response || []);
        } else {
          const query = searchQuery ? `?query=${searchQuery}` : '';
          const response = await request(`/api/users/search${query}`);
          setUsers(response.users || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [activeTab, searchQuery]);

  const displayUsers = activeTab === 'suggested' ? suggestedUsers : users;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Users className="w-12 h-12 text-cyan-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Learners</h1>
          <p className="text-gray-600">Connect with fellow programmers and learners</p>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setActiveTab('suggested')}
                className={`py-2 px-6 rounded transition ${
                  activeTab === 'suggested'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Suggested
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-6 rounded transition ${
                  activeTab === 'all'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Search All
              </button>
            </div>

            {activeTab === 'all' && (
              <div className="flex-1 md:flex-none w-full md:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No users found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUsers.map((u: User) => (
              <Link
                key={u._id}
                href={`/user/${u._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-20"></div>

                {/* Avatar */}
                <div className="px-6 pt-0">
                  <div className="flex justify-center -mt-10 mb-4">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.username}
                        className="w-20 h-20 rounded-full border-4 border-white bg-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                        {u.firstName[0]}
                        {u.lastName[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <h3 className="font-bold text-lg text-gray-900 text-center">
                    {u.firstName} {u.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-3">@{u.username}</p>

                  {u.bio && <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2">{u.bio}</p>}

                  <div className="flex justify-around bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Points</p>
                      <p className="font-bold text-lg text-cyan-600">{u.points}</p>
                    </div>
                    <div className="text-center border-l border-r border-gray-200">
                      <p className="text-xs text-gray-600">Followers</p>
                      <p className="font-bold text-lg text-blue-600">{u.followers?.length || 0}</p>
                    </div>
                  </div>

                  <button className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition font-semibold">
                    View Profile
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
