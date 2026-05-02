import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { ApiResponse } from '../utils/response';

export const socialController = {
  createPost: async (req: Request, res: Response) => {
    try {
      const { content, attachments } = req.body;
      const post = new Post({
        author: (req as any).user.userId,
        content,
        attachments,
      });

      await post.save();
      await post.populate('author', 'username firstName lastName avatar');

      return res.status(201).json(ApiResponse.success(post, 'Post created'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to create post', error));
    }
  },

  getPosts: async (req: Request, res: Response) => {
    try {
      const { skip = 0, limit = 10 } = req.query;
      const posts = await Post.find()
        .populate('author', 'username firstName lastName avatar')
        .populate('comments.author', 'username firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await Post.countDocuments();

      return res.json(
        ApiResponse.success({
          posts,
          total,
          skip: Number(skip),
          limit: Number(limit),
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch posts', error));
    }
  },

  likePost: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json(ApiResponse.error('Post not found'));
      }

      const userId = (req as any).user.userId;
      const likeIndex = post.likes.indexOf(userId);

      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
      }

      await post.save();

      try {
        const { notificationController } = require('./notificationController');
        const userId = (req as any).user.userId;
        const author = post.author as any;
        if (likeIndex === -1 && author && author.toString() !== userId) {
          const userDoc = await User.findById(userId);
          notificationController.createNotification(
            String(author),
            'post_liked',
            'Your post got a like',
            `${userDoc?.username || 'Someone'} liked your post`,
            userId,
            { type: 'post', id: post._id },
            'normal'
          );
        }
      } catch (err) {
        console.error('Failed to send like notification:', err);
      }

      return res.json(ApiResponse.success(post, 'Post liked/unliked'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to like post', error));
    }
  },

  addComment: async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json(ApiResponse.error('Post not found'));
      }

      post.comments.push({
        author: (req as any).user.userId,
        content,
        likes: [],
        createdAt: new Date(),
      });

      await post.save();
      await post.populate('comments.author', 'username firstName lastName avatar');

      try {
        const { notificationController } = require('./notificationController');
        const userId = (req as any).user.userId;
        const author = post.author as any;
        const userDoc = await User.findById(userId);
        if (author && author.toString() !== userId) {
          notificationController.createNotification(
            String(author),
            'post_commented',
            'New comment on your post',
            `${userDoc?.username || 'Someone'} commented: ${String(content).slice(0, 100)}`,
            userId,
            { type: 'post', id: post._id },
            'normal'
          );
        }
      } catch (err) {
        console.error('Failed to send comment notification:', err);
      }

      return res.json(ApiResponse.success(post, 'Comment added'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to add comment', error));
    }
  },
};
