'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
}

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  author: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function FeedPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { request } = useApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await request('/posts?limit=20');
        setPosts(data?.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [request, router, user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) {
      return;
    }

    setPosting(true);
    try {
      const created = await request('/posts', 'POST', { content: newPost.trim(), attachments: [] });
      setPosts((prev) => [created, ...prev]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const updated = await request(`/posts/${postId}/like`, 'POST');
      setPosts((prev) => prev.map((post) => (post._id === postId ? updated : post)));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    const content = (commentInputs[postId] || '').trim();
    if (!content) {
      return;
    }

    try {
      const updated = await request(`/posts/${postId}/comment`, 'POST', { content });
      setPosts((prev) => prev.map((post) => (post._id === postId ? updated : post)));
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">LearnHub</Link>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Feed</h1>

        <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your progress, ask a question, or post a coding tip..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={posting || !newPost.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-gray-600">Loading feed...</p>
        ) : posts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
            No posts yet. Be the first one to share something.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post._id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{post.author?.username || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Like ({post.likes?.length || 0})
                  </button>
                  <span className="text-gray-500">Comments: {post.comments?.length || 0}</span>
                </div>

                <div className="mt-4 space-y-2">
                  {post.comments?.slice(-3).map((comment) => (
                    <div key={comment._id} className="text-sm bg-gray-50 rounded p-2">
                      <span className="font-medium">{comment.author?.username || 'User'}:</span> {comment.content}
                    </div>
                  ))}

                  <div className="flex gap-2 mt-2">
                    <input
                      value={commentInputs[post._id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-black"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
