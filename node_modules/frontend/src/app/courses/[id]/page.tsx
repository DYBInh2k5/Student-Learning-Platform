'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  enrollmentCount: number;
  rating: number;
  lessons: Lesson[];
  instructor: { username: string; firstName: string };
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { request } = useApi();
  const user = useAuthStore((state) => state.user);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const data = await request(`/courses/${params.id}`);
        setCourse(data);
        setEnrolled(data.students?.includes(user._id) || false);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params, user, request, router]);

  const handleEnroll = async () => {
    try {
      await request(`/courses/${params.id}/enroll`, 'POST');
      setEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">🎓 LearnHub</Link>
          <Link href="/courses" className="text-blue-600 hover:text-blue-700">Back to Courses</Link>
        </div>
      </nav>

      <div className="container py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg mb-4">{course.description}</p>
          <div className="flex gap-8 text-sm">
            <div>
              <span className="font-semibold">Instructor:</span> {course.instructor?.firstName}
            </div>
            <div>
              <span className="font-semibold">Level:</span> {course.level}
            </div>
            <div>
              <span className="font-semibold">Duration:</span> {course.duration} hours
            </div>
            <div>
              <span className="font-semibold">Students:</span> {course.enrollmentCount}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              
              <div className="space-y-4">
                {course.lessons?.map((lesson, index) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{lesson.order}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                        <p className="text-gray-500 text-xs mt-2">⏱ {lesson.duration} min</p>
                      </div>
                      {enrolled && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-md sticky top-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">Free</div>
                <div className="text-gray-600 mb-4">or paid version available</div>
                
                {!enrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg mb-4"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg mb-4 opacity-75 cursor-not-allowed"
                  >
                    ✓ Enrolled
                  </button>
                )}

                <div className="border-t pt-6 mt-6">
                  <div className="text-left space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📚</span> {course.lessons?.length || 0} Lessons
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span> {course.enrollmentCount} Students
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⭐</span> {course.rating.toFixed(1)} Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
