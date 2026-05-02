import { Request, Response } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';
import { ApiResponse } from '../utils/response';
import { getIO, getSocketId } from '../utils/socket';

export const notificationController = {
  getNotifications: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { skip = 0, limit = 20, unread = false } = req.query;

      const filter: any = { recipient: userId };
      if (unread === 'true') {
        filter.isRead = false;
      }

      const notifications = await Notification.find(filter)
        .populate('actor', 'username firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

      return res.json(
        ApiResponse.success({
          notifications,
          unreadCount,
          total: await Notification.countDocuments(filter),
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch notifications', error));
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      const userId = (req as any).user.userId;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json(ApiResponse.error('Notification not found'));
      }

      return res.json(ApiResponse.success(notification, 'Notification marked as read'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark notification as read', error));
    }
  },

  markAllAsRead: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

      return res.json(ApiResponse.success({}, 'All notifications marked as read'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark all notifications as read', error));
    }
  },

  deleteNotification: async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      const userId = (req as any).user.userId;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      });

      if (!notification) {
        return res.status(404).json(ApiResponse.error('Notification not found'));
      }

      return res.json(ApiResponse.success({}, 'Notification deleted'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to delete notification', error));
    }
  },

  createNotification: async (
    recipientId: string,
    type: string,
    title: string,
    message: string,
    actorId?: string,
    relatedItem?: any,
    importance: string = 'normal'
  ) => {
    try {
      const notification = new Notification({
        recipient: recipientId,
        actor: actorId,
        type,
        title,
        message,
        relatedItem,
        importance,
      });

      await notification.save();
      try {
        const io = getIO();
        if (io) {
          const recipientSocketId = getSocketId(recipientId);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('notification', notification);
          } else {
            // emit a generic event with recipientId so clients can filter
            io.emit('notification-created', { recipientId, notification });
          }
        }
      } catch (emitErr) {
        console.error('Failed to emit notification via socket:', emitErr);
      }
      return notification;
    } catch (error: any) {
      console.error('Failed to create notification:', error);
    }
  },

  getUnreadCount: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

      return res.json(ApiResponse.success({ unreadCount }));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch unread count', error));
    }
  },
};
