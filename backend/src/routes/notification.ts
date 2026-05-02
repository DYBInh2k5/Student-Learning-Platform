import express from 'express';
import { notificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, notificationController.getNotifications);
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

// Dev helper: create a notification (only for authenticated testing)
router.post('/dev/create', authMiddleware, async (req, res) => {
	try {
		const { recipientId, type, title, message, importance } = req.body;
		if (!recipientId || !type || !title) return res.status(400).json({ success: false, message: 'recipientId, type and title required' });
		const notification = await notificationController.createNotification(recipientId, type, title, message || '', (req as any).user.userId, null, importance || 'normal');
		return res.json({ success: true, data: notification });
	} catch (err: any) {
		console.error('dev create notification failed', err);
		return res.status(500).json({ success: false, message: err.message });
	}
});

export default router;
