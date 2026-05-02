import { Request, Response } from 'express';
import User from '../models/User';
import UserAchievement from '../models/UserAchievement';
import ExerciseSubmission from '../models/ExerciseSubmission';
import { ApiResponse } from '../utils/response';

export const userController = {
  searchUsers: async (req: Request, res: Response) => {
    try {
      const { query, skip = 0, limit = 10 } = req.query;

      const filter: any = {};
      if (query) {
        filter.$or = [
          { username: { $regex: query, $options: 'i' } },
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
        ];
      }

      const users = await User.find(filter)
        .select('username firstName lastName avatar bio role points followers currentStreak')
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await User.countDocuments(filter);

      return res.json(
        ApiResponse.success({
          users,
          total,
          skip: Number(skip),
          limit: Number(limit),
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to search users', error));
    }
  },

  getUserProfile: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId)
        .select('-password')
        .populate('followers', 'username firstName lastName avatar')
        .populate('following', 'username firstName lastName avatar')
        .populate('enrolledCourses', 'title thumbnail');

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const achievements = await UserAchievement.find({ userId }).populate('achievementId');
      const submissions = await ExerciseSubmission.countDocuments({ userId });
      const acceptedSubmissions = await ExerciseSubmission.countDocuments({
        userId,
        status: 'accepted',
      });

      return res.json(
        ApiResponse.success({
          ...user.toObject(),
          stats: {
            submissions,
            acceptedSubmissions,
            successRate:
              submissions > 0 ? Math.round((acceptedSubmissions / submissions) * 100) : 0,
            achievements: achievements.length,
          },
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch profile', error));
    }
  },

  followUser: async (req: Request, res: Response) => {
    try {
      const currentUserId = (req as any).user.userId;
      const { targetUserId } = req.params;

      if (currentUserId === targetUserId) {
        return res.status(400).json(ApiResponse.error('Cannot follow yourself'));
      }

      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (!currentUser || !targetUser) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const isFollowing = currentUser.following.some((id: any) => id.toString() === targetUserId);

      if (isFollowing) {
        currentUser.following = currentUser.following.filter((id: any) => id.toString() !== targetUserId.toString());
        targetUser.followers = targetUser.followers.filter((id: any) => id.toString() !== currentUserId.toString());
      } else {
        currentUser.following.push(new (require('mongoose').Types.ObjectId)(targetUserId));
        targetUser.followers.push(new (require('mongoose').Types.ObjectId)(currentUserId));
      }

      await currentUser.save();
      await targetUser.save();

      try {
        const { notificationController } = require('./notificationController');
        if (!isFollowing) {
          // notify the target user
          notificationController.createNotification(
            targetUserId,
            'user_followed',
            'New follower',
            `${currentUser.username} started following you.`,
            currentUserId,
            { type: 'user', id: currentUserId },
            'normal'
          );
        }
      } catch (err) {
        console.error('Failed to send follow notification:', err);
      }

      return res.json(
        ApiResponse.success(
          { isFollowing: !isFollowing },
          isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
        )
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to follow user', error));
    }
  },

  getActivity: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      const submissions = await ExerciseSubmission.find({ userId, status: 'accepted' })
        .populate('exerciseId', 'title courseId')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      const activity = submissions.map((sub: any) => ({
        type: 'exercise_solved',
        timestamp: sub.createdAt,
        data: {
          exerciseTitle: sub.exerciseId?.title,
          points: sub.score,
        },
      }));

      return res.json(ApiResponse.success(activity));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch activity', error));
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { bio, avatar, firstName, lastName, preferences } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          ...(bio !== undefined && { bio }),
          ...(avatar !== undefined && { avatar }),
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(preferences !== undefined && { preferences }),
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      return res.json(ApiResponse.success(user, 'Profile updated successfully'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to update profile', error));
    }
  },

  getUserStats: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const totalSubmissions = await ExerciseSubmission.countDocuments({ userId });
      const acceptedSubmissions = await ExerciseSubmission.countDocuments({
        userId,
        status: 'accepted',
      });
      const totalPoints = await ExerciseSubmission.aggregate([
        { $match: { userId, status: 'accepted' } },
        { $group: { _id: null, total: { $sum: '$score' } } },
      ]);

      const achievements = await UserAchievement.countDocuments({ userId });

      return res.json(
        ApiResponse.success({
          totalSubmissions,
          acceptedSubmissions,
          successRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
          totalPoints: totalPoints[0]?.total || 0,
          achievements,
          followers: user.followers.length,
          following: user.following.length,
          streak: user.currentStreak,
          totalStreak: user.totalStreak,
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch user stats', error));
    }
  },

  getSuggestedUsers: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { limit = 10 } = req.query;

      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const suggested = await User.find({
        _id: {
          $nin: [userId, ...currentUser.following],
        },
        role: 'student',
      })
        .select('username firstName lastName avatar bio points followers')
        .sort({ followers: -1, points: -1 })
        .limit(Number(limit));

      return res.json(ApiResponse.success(suggested));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch suggested users', error));
    }
  },
};
