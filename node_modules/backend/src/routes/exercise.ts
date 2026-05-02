import express from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware, instructorMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, exerciseController.getExercises);
router.get('/my-submissions', authMiddleware, exerciseController.getMySubmissions);
router.get('/:id', authMiddleware, exerciseController.getExerciseById);
router.post('/', authMiddleware, instructorMiddleware, exerciseController.createExercise);
router.post('/:id/submit', authMiddleware, exerciseController.submitExercise);

export default router;
