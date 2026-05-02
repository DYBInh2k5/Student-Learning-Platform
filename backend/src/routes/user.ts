import express from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/search', userController.searchUsers);
router.get('/suggested', authMiddleware, userController.getSuggestedUsers);
router.get('/profile/:userId', userController.getUserProfile);
router.get('/activity/:userId', userController.getActivity);
router.post('/:targetUserId/follow', authMiddleware, userController.followUser);
router.get('/stats', authMiddleware, userController.getUserStats);
router.put('/profile', authMiddleware, userController.updateProfile);

export default router;
