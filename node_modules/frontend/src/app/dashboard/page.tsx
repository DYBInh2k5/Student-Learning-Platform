'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  enrollmentCount: number;
  instructor: { username: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { request } = useApi();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const data = await request('/courses?limit=6');
        setCourses(data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, request, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-blue-600">🎓 LearnHub</h1>
          <div className="flex gap-2 md:gap-4 items-center flex-wrap justify-center md:justify-start">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Courses</Link>
            <Link href="/exercises" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Exercises</Link>
            <Link href="/feed" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Feed</Link>
            <Link href="/discover" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Discover</Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Leaderboard</Link>
            <Link href="/achievements" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Achievements</Link>
            <Link href="/notifications" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Notifications</Link>
            <Link href="/messages" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Messages</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 text-sm md:text-base">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600">Points: <span className="font-bold text-blue-600">{user?.points}</span></p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600">{user?.points}</div>
            <p className="text-gray-600 mt-2">Your Points</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600">5</div>
            <p className="text-gray-600 mt-2">Courses Enrolled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-pink-600">2</div>
            <p className="text-gray-600 mt-2">Badges Earned</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600">12</div>
            <p className="text-gray-600 mt-2">Exercises Solved</p>
          </div>
        </div>

        {/* Featured Courses */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h3>
        {loading ? (
          <p className="text-gray-600">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-900 flex-1">{course.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{course.level}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.instructor?.username}</span>
                  <span>{course.enrollmentCount} students</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
