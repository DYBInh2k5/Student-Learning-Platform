'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

interface AdminStats {
  users: number;
  courses: number;
  posts: number;
  messages: number;
  usersByRole: Array<{ _id: string; count: number }>;
}

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
  points: number;
}

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { request } = useApi();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          request('/admin/stats'),
          request('/admin/users'),
        ]);

        setStats(statsData);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, router, request]);

  const updateRole = async (userId: string, role: 'student' | 'instructor' | 'admin') => {
    try {
      const updated = await request(`/admin/users/${userId}/role`, 'PUT', { role });
      setUsers((prev) => prev.map((item) => (item._id === userId ? updated : item)));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">LearnHub Admin</Link>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        {loading ? (
          <p className="text-gray-600">Loading admin data...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md"><p className="text-sm text-gray-500">Users</p><p className="text-2xl font-bold">{stats?.users ?? 0}</p></div>
              <div className="bg-white p-4 rounded-lg shadow-md"><p className="text-sm text-gray-500">Courses</p><p className="text-2xl font-bold">{stats?.courses ?? 0}</p></div>
              <div className="bg-white p-4 rounded-lg shadow-md"><p className="text-sm text-gray-500">Posts</p><p className="text-2xl font-bold">{stats?.posts ?? 0}</p></div>
              <div className="bg-white p-4 rounded-lg shadow-md"><p className="text-sm text-gray-500">Messages</p><p className="text-2xl font-bold">{stats?.messages ?? 0}</p></div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-3">User Management</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Username</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Points</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-2">{item.username}</td>
                      <td className="py-2">{item.email}</td>
                      <td className="py-2">{item.role}</td>
                      <td className="py-2">{item.points}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button onClick={() => updateRole(item._id, 'student')} className="px-2 py-1 border rounded">Student</button>
                          <button onClick={() => updateRole(item._id, 'instructor')} className="px-2 py-1 border rounded">Instructor</button>
                          <button onClick={() => updateRole(item._id, 'admin')} className="px-2 py-1 border rounded">Admin</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
