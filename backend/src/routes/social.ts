import express from 'express';
import { socialController } from '../controllers/socialController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, socialController.createPost);
router.get('/', socialController.getPosts);
router.post('/:id/like', authMiddleware, socialController.likePost);
router.post('/:id/comment', authMiddleware, socialController.addComment);

export default router;
