import { Request, Response } from 'express';
import Message from '../models/Message';
import { ApiResponse } from '../utils/response';

export const messageController = {
  getConversations: async (req: Request, res: Response) => {
    try {
      const currentUserId = (req as any).user.userId;

      const messages = await Message.find({
        $or: [{ sender: currentUserId }, { recipient: currentUserId }],
      })
        .populate('sender', 'username firstName lastName avatar')
        .populate('recipient', 'username firstName lastName avatar')
        .sort({ createdAt: -1 });

      const conversationMap = new Map<string, any>();

      for (const message of messages) {
        const sender = message.sender as any;
        const recipient = message.recipient as any;
        const isSender = sender?._id?.toString() === currentUserId;
        const otherUser = isSender ? recipient : sender;

        if (!otherUser?._id) {
          continue;
        }

        const otherUserId = otherUser._id.toString();
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            username: otherUser.username,
            avatar: otherUser.avatar,
            lastMessage: message.content,
            lastMessageTime: message.createdAt,
          });
        }
      }

      return res.json(ApiResponse.success([...conversationMap.values()]));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch conversations', error));
    }
  },

  sendMessage: async (req: Request, res: Response) => {
    try {
      const { receiverId, content } = req.body;
      const message = new Message({
        sender: (req as any).user.userId,
        recipient: receiverId,
        content,
      });

      await message.save();
      await message.populate('sender', 'username firstName lastName avatar');
      await message.populate('recipient', 'username firstName lastName avatar');

      try {
        const { notificationController } = require('./notificationController');
        const senderUsername = (message.sender as any)?.username || 'Someone';
        notificationController.createNotification(
          receiverId,
          'new_message',
          'New message',
          `${senderUsername} sent you a message: ${String(message.content).slice(0, 120)}`,
          (req as any).user.userId,
          { type: 'message', id: message._id },
          'high'
        );
      } catch (err) {
        console.error('Failed to create message notification:', err);
      }

      return res.status(201).json(ApiResponse.success(message, 'Message sent'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to send message', error));
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const currentUserId = (req as any).user.userId;

      const messages = await Message.find({
        $or: [
          { sender: currentUserId, recipient: userId },
          { sender: userId, recipient: currentUserId },
        ],
      })
        .populate('sender', 'username firstName lastName avatar')
        .populate('recipient', 'username firstName lastName avatar')
        .sort({ createdAt: 1 });

      return res.json(ApiResponse.success(messages));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch messages', error));
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { messageId } = req.body;
      const currentUserId = (req as any).user.userId;

      const message = await Message.findOneAndUpdate(
        { _id: messageId, recipient: currentUserId },
        { isRead: true },
        { new: true }
      );

      if (!message) {
        return res.status(404).json(ApiResponse.error('Message not found or access denied'));
      }

      return res.json(ApiResponse.success(message));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark message as read', error));
    }
  },
};
