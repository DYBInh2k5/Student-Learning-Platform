import { Request, Response } from 'express';
import User from '../models/User';
import UserProgress from '../models/UserProgress';
import ExerciseSubmission from '../models/ExerciseSubmission';
import { ApiResponse } from '../utils/response';

export const leaderboardController = {
  getGlobalLeaderboard: async (req: Request, res: Response) => {
    try {
      const { limit = 100, page = 1, sortBy = 'points' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const sortField: any = {};
      sortField[sortBy as string] = -1;

      const leaderboard = await User.find({ role: 'student' })
        .select('username firstName lastName avatar points currentStreak followers')
        .sort(sortField)
        .skip(skip)
        .limit(Number(limit));

      const total = await User.countDocuments({ role: 'student' });

      const withRank = leaderboard.map((user, index) => ({
        ...user.toObject(),
        rank: skip + index + 1,
      }));

      return res.json(
        ApiResponse.success({
          leaderboard: withRank,
          total,
          page: Number(page),
          limit: Number(limit),
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch leaderboard', error));
    }
  },

  getUserRank: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const user = await User.findById(userId).select('points currentStreak');
      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const rank =
        (await User.countDocuments({
          role: 'student',
          points: { $gt: user.points },
        })) + 1;

      return res.json(
        ApiResponse.success({
          rank,
          points: user.points,
          streak: user.currentStreak,
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch user rank', error));
    }
  },

  getStreakLeaderboard: async (req: Request, res: Response) => {
    try {
      const { limit = 50, page = 1 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const leaderboard = await User.find({ role: 'student', currentStreak: { $gt: 0 } })
        .select('username firstName lastName avatar currentStreak points')
        .sort({ currentStreak: -1, lastActivityDate: -1 })
        .skip(skip)
        .limit(Number(limit));

      const withRank = leaderboard.map((user, index) => ({
        ...user.toObject(),
        rank: skip + index + 1,
      }));

      return res.json(ApiResponse.success({ leaderboard: withRank }));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch streak leaderboard', error));
    }
  },

  getMonthlyChallengeLeaderboard: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const submissions = await ExerciseSubmission.aggregate([
        {
          $match: {
            status: 'accepted',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: '$userId',
            solvedCount: { $sum: 1 },
            pointsEarned: { $sum: '$score' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 1,
            solvedCount: 1,
            pointsEarned: 1,
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar',
          },
        },
        {
          $sort: { solvedCount: -1, pointsEarned: -1 },
        },
        {
          $limit: 50,
        },
      ]);

      const withRank = submissions.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      return res.json(ApiResponse.success({ leaderboard: withRank }));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch monthly leaderboard', error));
    }
  },
};
