'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useApi } from '@/hooks/useApi';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  _id: string;
  sender: { _id: string; username: string; avatar?: string };
  recipient: { _id: string; username: string };
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface RealtimeMessagePayload {
  messageId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt?: string;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { request } = useApi();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchConversations = async () => {
      try {
        const data = await request('/messages/conversations');
        setConversations(data || []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, request, router]);

  useEffect(() => {
    if (socket && user) {
      socket.on('receive-message', (data: RealtimeMessagePayload) => {
        const shouldAppend = selectedConversation === data.senderId;
        if (!shouldAppend) {
          return;
        }

        const activeConversation = conversations.find((conversation) => conversation.userId === data.senderId);
        const normalizedMessage: Message = {
          _id: data.messageId || `${data.senderId}-${Date.now()}`,
          sender: {
            _id: data.senderId,
            username: activeConversation?.username || 'User',
          },
          recipient: {
            _id: data.recipientId,
            username: user.username,
          },
          content: data.content,
          isRead: false,
          createdAt: data.createdAt || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, normalizedMessage]);
      });

      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, user, selectedConversation, conversations]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const sentMessage = await request('/messages/send', 'POST', {
        receiverId: selectedConversation,
        content: messageText,
      });

      setMessages((prev) => [...prev, sentMessage]);
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.userId === selectedConversation
            ? { ...conversation, lastMessage: messageText, lastMessageTime: new Date().toISOString() }
            : conversation
        )
      );

      if (socket) {
        socket.emit('send-message', {
          recipientId: selectedConversation,
          content: messageText,
          messageId: sentMessage?._id,
        });
      }

      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const openConversation = async (conversationUserId: string) => {
    setSelectedConversation(conversationUserId);
    try {
      const data = await request(`/messages/${conversationUserId}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">🎓 LearnHub</Link>
        </div>
      </nav>

      <div className="container py-8">
        <div className="grid grid-cols-3 gap-6 h-96">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {loading ? (
                <p className="p-4 text-gray-500 text-center">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No conversations yet</p>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => openConversation(conversation.userId)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{conversation.username}</p>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-2 bg-white rounded-lg shadow-md flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900">
                    {conversations.find((c) => c.userId === selectedConversation)?.username}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender._id === user?._id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
