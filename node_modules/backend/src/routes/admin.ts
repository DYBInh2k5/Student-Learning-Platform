import express from 'express';
import { adminController } from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.put('/users/:userId/role', authMiddleware, adminMiddleware, adminController.updateUserRole);
router.delete('/posts/:postId', authMiddleware, adminMiddleware, adminController.deletePost);

export default router;
