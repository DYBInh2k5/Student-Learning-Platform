import { Request, Response } from 'express';
import User from '../models/User';
import UserAchievement from '../models/UserAchievement';
import Achievement from '../models/Achievement';
import ExerciseSubmission from '../models/ExerciseSubmission';
import { ApiResponse } from '../utils/response';

export const achievementController = {
  getAllAchievements: async (req: Request, res: Response) => {
    try {
      const achievements = await Achievement.find().sort({ category: 1, rarity: 1 });

      return res.json(ApiResponse.success(achievements));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch achievements', error));
    }
  },

  getUserAchievements: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const userAchievements = await UserAchievement.find({ userId })
        .populate('achievementId')
        .sort({ unlockedAt: -1 });

      const unlockedIds = userAchievements.map((ua) => ua.achievementId);

      const lockedAchievements = await Achievement.find({
        _id: { $nin: unlockedIds },
      });

      return res.json(
        ApiResponse.success({
          unlocked: userAchievements,
          locked: lockedAchievements,
          totalUnlocked: userAchievements.length,
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch achievements', error));
    }
  },

  unlockAchievement: async (userId: string, achievementId: string) => {
    try {
      const existing = await UserAchievement.findOne({ userId, achievementId });
      if (!existing) {
        const achievement = new UserAchievement({
          userId,
          achievementId,
        });
        await achievement.save();
        return achievement;
      }
    } catch (error: any) {
      console.error('Failed to unlock achievement:', error);
    }
  },

  checkAndUnlockAchievements: async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const achievements = (await Achievement.find()) as any[];

      for (const achievement of achievements) {
        const achievementId = String(achievement._id);

        const unlocked = await UserAchievement.findOne({
          userId,
          achievementId,
        });

        if (unlocked) continue;

        let shouldUnlock = false;

        if (achievement.name === 'First Steps') {
          shouldUnlock = true;
        } else if (achievement.name === 'Century Club') {
          shouldUnlock = user.points >= 100;
        } else if (achievement.name === 'Thousand Points') {
          shouldUnlock = user.points >= 1000;
        } else if (achievement.name === 'Week Warrior') {
          shouldUnlock = user.currentStreak >= 7;
        } else if (achievement.name === 'Month Master') {
          shouldUnlock = user.currentStreak >= 30;
        } else if (achievement.name === 'Social Butterfly') {
          shouldUnlock = user.followers.length >= 10;
        } else if (achievement.name === 'Exercise Master') {
          const submissions = await ExerciseSubmission.countDocuments({
            userId,
            status: 'accepted',
          });
          shouldUnlock = submissions >= 50;
        }

        if (shouldUnlock) {
          const unlocked = await achievementController.unlockAchievement(userId, achievementId);
          try {
            if (unlocked) {
              const { notificationController } = require('./notificationController');
              notificationController.createNotification(
                userId,
                'achievement_unlocked',
                'Achievement unlocked',
                `You unlocked "${achievement.name}"!`,
                null,
                { type: 'achievement', id: achievementId },
                'normal'
              );
            }
          } catch (err) {
            console.error('Failed to send achievement notification:', err);
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to check achievements:', error);
    }
  },

  createAchievement: async (req: Request, res: Response) => {
    try {
      const { name, description, icon, condition, category, rarity } = req.body;

      const achievement = new Achievement({
        name,
        description,
        icon,
        condition,
        category,
        rarity: rarity || 'common',
      });

      await achievement.save();
      return res.status(201).json(ApiResponse.success(achievement, 'Achievement created'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to create achievement', error));
    }
  },

  getLeaderboardByAchievements: async (req: Request, res: Response) => {
    try {
      const { limit = 50 } = req.query;

      const leaderboard = await UserAchievement.aggregate([
        {
          $group: {
            _id: '$userId',
            unlockedCount: { $sum: 1 },
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
            unlockedCount: 1,
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar',
            points: '$user.points',
          },
        },
        {
          $sort: { unlockedCount: -1, points: -1 },
        },
        {
          $limit: Number(limit),
        },
      ]);

      const withRank = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      return res.json(ApiResponse.success({ leaderboard: withRank }));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch achievements leaderboard', error));
    }
  },
};
