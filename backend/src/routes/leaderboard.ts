import express from 'express';
import { leaderboardController } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', leaderboardController.getGlobalLeaderboard);
router.get('/streaks', leaderboardController.getStreakLeaderboard);
router.get('/monthly-challenge', leaderboardController.getMonthlyChallengeLeaderboard);
router.get('/my-rank', authMiddleware, leaderboardController.getUserRank);

export default router;
