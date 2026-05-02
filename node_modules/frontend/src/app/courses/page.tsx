'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  enrollmentCount: number;
  rating: number;
  instructor: { username: string };
}

export default function CoursesPage() {
  const { request } = useApi();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let endpoint = '/courses?limit=20';
        if (category) endpoint += `&category=${category}`;
        if (level) endpoint += `&level=${level}`;

        const data = await request(endpoint);
        setCourses(data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, level, request]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">🎓 LearnHub</Link>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="ReactJS">ReactJS</option>
                <option value="Web Design">Web Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <p className="text-gray-600 text-center py-12">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{course.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">👨‍🏫 {course.instructor?.username}</span>
                  <span className="text-yellow-500">★ {course.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">{course.enrollmentCount} students</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
