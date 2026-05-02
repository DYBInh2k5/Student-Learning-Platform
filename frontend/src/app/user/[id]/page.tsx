'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, UserCheck, Mail, Heart, Code, Zap } from 'lucide-react';

export default function UserProfilePage() {
  const { request } = useApi();
  const currentUser = useAuthStore((state) => state.user);
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await request(`/api/users/profile/${userId}`);
        setUser(response);

        // Check if following
        if (currentUser) {
          const followResponse = await request(`/api/users/profile/${userId}`);
          setIsFollowing(followResponse.followers?.some((f: any) => f._id === currentUser._id));
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      await request(`/api/users/${userId}/follow`, 'POST', {});
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      console.error('Failed to follow user:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600">User not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 pb-6 border-b border-gray-200">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white bg-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xl text-gray-600 mb-3">@{user.username}</p>
                {user.bio && <p className="text-gray-700">{user.bio}</p>}
              </div>

              {currentUser && currentUser._id !== userId && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-5 h-5" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Follow
                      </>
                    )}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                    <Mail className="w-5 h-5" />
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-b border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Points</p>
                <p className="text-2xl font-bold text-purple-600">{user.points}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="text-2xl font-bold text-blue-600">{user.followers?.length || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Following</p>
                <p className="text-2xl font-bold text-pink-600">{user.following?.length || 0}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-gray-600 text-sm">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{user.currentStreak || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Courses</p>
                <p className="text-2xl font-bold text-green-600">{user.enrolledCourses?.length || 0}</p>
              </div>
            </div>

            {/* User Stats */}
            {user.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">Submissions</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{user.stats.submissions}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-gray-700">Accepted</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{user.stats.acceptedSubmissions}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{user.stats.successRate}%</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Achievements</p>
                  <p className="text-3xl font-bold text-yellow-600">{user.stats.achievements}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Courses */}
        {user.enrolledCourses && user.enrolledCourses.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.enrolledCourses.map((course: any) => (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
