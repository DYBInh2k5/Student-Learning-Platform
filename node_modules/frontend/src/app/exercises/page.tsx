'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

interface Exercise {
  _id: string;
  title: string;
  description: string;
  problem: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  language: string;
  testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean }>;
}

interface Submission {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'error';
  score: number;
  feedback: string;
  passedTests: number;
  totalTests: number;
}

export default function ExercisesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { request } = useApi();
  const [courseId, setCourseId] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('// Write your solution here');
  const [resultOutput, setResultOutput] = useState('');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setCourseId(params.get('courseId'));
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchExercises = async () => {
      try {
        const endpoint = courseId ? `/exercises?courseId=${courseId}` : '/exercises';
        const data = await request(endpoint);
        setExercises(data || []);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user, router, request, courseId]);

  const handleSelectExercise = async (exerciseId: string) => {
    try {
      const detail = await request(`/exercises/${exerciseId}`);
      setSelectedExercise(detail);
      setSubmission(null);
      setCode('// Write your solution here');
      setResultOutput('');
    } catch (error) {
      console.error('Failed to load exercise:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExercise) {
      return;
    }

    setSubmitting(true);
    try {
      const data = await request(`/exercises/${selectedExercise._id}/submit`, 'POST', {
        code,
        resultOutput,
      });
      setSubmission(data);
    } catch (error) {
      console.error('Failed to submit exercise:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">LearnHub</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
            <Link href="/feed" className="text-gray-700 hover:text-blue-600">Feed</Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Practice Exercises</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white rounded-lg shadow-md p-4 lg:col-span-1 h-fit">
            <h2 className="text-lg font-semibold mb-3">Exercise List</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : exercises.length === 0 ? (
              <p className="text-gray-500">No exercises available.</p>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise) => (
                  <button
                    key={exercise._id}
                    onClick={() => handleSelectExercise(exercise._id)}
                    className={`w-full text-left p-3 rounded border ${
                      selectedExercise?._id === exercise._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{exercise.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{exercise.difficulty} • {exercise.points} pts</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-md p-5 lg:col-span-2">
            {!selectedExercise ? (
              <p className="text-gray-500">Select an exercise to start.</p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">{selectedExercise.title}</h2>
                <p className="text-gray-600 mt-2">{selectedExercise.description}</p>
                <div className="mt-4 p-4 bg-gray-50 rounded border text-sm text-gray-800 whitespace-pre-wrap">
                  {selectedExercise.problem}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Code</label>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      rows={10}
                      className="w-full border border-gray-300 rounded p-3 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Output</label>
                    <textarea
                      value={resultOutput}
                      onChange={(e) => setResultOutput(e.target.value)}
                      rows={10}
                      className="w-full border border-gray-300 rounded p-3 font-mono text-sm"
                      placeholder="Paste output from your code execution"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Solution'}
                  </button>
                </div>

                {submission && (
                  <div className={`mt-4 p-4 rounded border ${submission.status === 'accepted' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="font-semibold">Result: {submission.status.toUpperCase()}</p>
                    <p className="text-sm">Score: {submission.score}</p>
                    <p className="text-sm">Tests: {submission.passedTests}/{submission.totalTests}</p>
                    <p className="text-sm mt-1">{submission.feedback}</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
