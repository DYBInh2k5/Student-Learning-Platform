'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket, onEvent, offEvent } from '@/lib/socket';
import { Bell, Trash2, Eye } from 'lucide-react';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  importance: string;
  createdAt: string;
  actor: any;
}

export default function NotificationsPage() {
  const { request } = useApi();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user || !token) return;
    const socket = connectSocket(token);

    const handleNotification = (payload: any) => {
      // payload may be the notification object or { recipientId, notification }
      let notification = payload;
      if (payload && payload.notification) notification = payload.notification;
      const recipientId = payload.recipientId || notification.recipient;
      if (recipientId === user._id) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((c) => c + 1);
      }
    };

    onEvent('notification', handleNotification);
    onEvent('notification-created', handleNotification);

    return () => {
      offEvent('notification', handleNotification);
      offEvent('notification-created', handleNotification);
      // optionally disconnect socket when leaving notifications page
      disconnectSocket();
    };
  }, [user, token]);

  const fetchNotifications = async () => {
    try {
      const response = await request('/api/notifications?limit=50');
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await request(`/api/notifications/${notificationId}/read`, 'PUT', {});
      fetchNotifications();
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await request('/api/notifications/read-all', 'PUT', {});
      fetchNotifications();
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await request(`/api/notifications/${notificationId}`, 'DELETE');
      fetchNotifications();
    } catch (error: any) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      post_liked: '❤️',
      post_commented: '💬',
      user_followed: '👤',
      course_started: '📚',
      exercise_passed: '✅',
      exercise_failed: '❌',
      new_message: '✉️',
      course_review: '⭐',
      achievement_unlocked: '🏆',
    };
    return icons[type] || '🔔';
  };

  const getBackgroundColor = (importance: string) => {
    if (importance === 'high') return 'bg-red-50 border-l-4 border-red-500';
    if (importance === 'normal') return 'bg-blue-50 border-l-4 border-blue-500';
    return 'bg-gray-50 border-l-4 border-gray-300';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Bell className="w-10 h-10 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg p-4 flex items-start gap-4 transition ${getBackgroundColor(
                  notification.importance
                )} ${notification.isRead ? 'opacity-75' : ''}`}
              >
                <div className="text-3xl flex-shrink-0">{getIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete"
                    className="p-2 hover:bg-white rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
