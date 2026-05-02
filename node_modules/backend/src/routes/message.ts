import express from 'express';
import { messageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/conversations', authMiddleware, messageController.getConversations);
router.post('/send', authMiddleware, messageController.sendMessage);
router.get('/:userId', authMiddleware, messageController.getMessages);
router.post('/read', authMiddleware, messageController.markAsRead);

export default router;
