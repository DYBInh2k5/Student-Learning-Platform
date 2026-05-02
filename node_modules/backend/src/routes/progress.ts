import express from 'express';
import { userProgressController } from '../controllers/userProgressController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, userProgressController.getAllProgress);
router.get('/course/:courseId', authMiddleware, userProgressController.getCourseProgress);
router.post('/lesson', authMiddleware, userProgressController.updateLessonProgress);
router.post('/exercise-submit', authMiddleware, userProgressController.recordExerciseSubmission);
router.post('/exercise-complete', authMiddleware, userProgressController.markExerciseCompleted);
router.post('/course/:courseId/complete', authMiddleware, userProgressController.markCourseCompleted);
router.get('/stats/:courseId', authMiddleware, userProgressController.getCourseStats);

export default router;
