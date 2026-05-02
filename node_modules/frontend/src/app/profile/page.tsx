'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { request } = useApi();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('/auth/profile', 'PUT', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">🎓 LearnHub</Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="flex gap-8 mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl">
              {user?.avatar || '👤'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="text-gray-600 mt-2">{user?.email}</p>
              <div className="mt-4 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{user?.points}</p>
                  <p className="text-gray-600 text-sm">Points</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-500">{user?.badges?.length || 0}</p>
                  <p className="text-gray-600 text-sm">Badges</p>
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 border-t pt-8">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
