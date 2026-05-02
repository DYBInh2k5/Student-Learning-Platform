import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Post from '../models/Post';
import Message from '../models/Message';
import { ApiResponse } from '../utils/response';

export const adminController = {
  getDashboardStats: async (_req: Request, res: Response) => {
    try {
      const [users, courses, posts, messages] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Post.countDocuments(),
        Message.countDocuments(),
      ]);

      const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]);

      return res.json(
        ApiResponse.success({
          users,
          courses,
          posts,
          messages,
          usersByRole,
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch admin stats', error));
    }
  },

  getUsers: async (_req: Request, res: Response) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(ApiResponse.success(users));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch users', error));
    }
  },

  updateUserRole: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['student', 'instructor', 'admin'].includes(role)) {
        return res.status(400).json(ApiResponse.error('Invalid role'));
      }

      const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      return res.json(ApiResponse.success(user, 'User role updated'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to update user role', error));
    }
  },

  deletePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const deleted = await Post.findByIdAndDelete(postId);
      if (!deleted) {
        return res.status(404).json(ApiResponse.error('Post not found'));
      }

      return res.json(ApiResponse.success(null, 'Post deleted'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to delete post', error));
    }
  },
};
