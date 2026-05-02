import express from 'express';
import { achievementController } from '../controllers/achievementController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', achievementController.getAllAchievements);
router.get('/user/my-achievements', authMiddleware, achievementController.getUserAchievements);
router.get('/leaderboard', achievementController.getLeaderboardByAchievements);
router.post('/', authMiddleware, adminMiddleware, achievementController.createAchievement);

export default router;
