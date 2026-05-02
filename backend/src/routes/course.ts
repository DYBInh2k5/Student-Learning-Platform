import express from 'express';
import { courseController } from '../controllers/courseController';
import { authMiddleware, instructorMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, instructorMiddleware, courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/:id/enroll', authMiddleware, courseController.enrollCourse);
router.post('/lessons', authMiddleware, instructorMiddleware, courseController.addLesson);

export default router;
