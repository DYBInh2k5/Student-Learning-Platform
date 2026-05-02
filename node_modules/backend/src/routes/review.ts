import express from 'express';
import { courseReviewController } from '../controllers/courseReviewController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/my-reviews', authMiddleware, courseReviewController.getMyReviews);
router.get('/:courseId', courseReviewController.getCourseReviews);
router.post('/', authMiddleware, courseReviewController.createReview);
router.put('/:reviewId', authMiddleware, courseReviewController.updateReview);
router.delete('/:reviewId', authMiddleware, courseReviewController.deleteReview);
router.post('/:reviewId/helpful', authMiddleware, courseReviewController.markReviewHelpful);

export default router;
