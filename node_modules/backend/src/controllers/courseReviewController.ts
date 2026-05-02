import { Request, Response } from 'express';
import Course from '../models/Course';
import CourseReview from '../models/CourseReview';
import User from '../models/User';
import { ApiResponse } from '../utils/response';

export const courseReviewController = {
  createReview: async (req: Request, res: Response) => {
    try {
      const { courseId, rating, title, content } = req.body;
      const userId = (req as any).user.userId;

      if (rating < 1 || rating > 5) {
        return res.status(400).json(ApiResponse.error('Rating must be between 1 and 5'));
      }

      if (!title || !content) {
        return res.status(400).json(ApiResponse.error('Title and content are required'));
      }

      const existingReview = await CourseReview.findOne({ courseId, author: userId });
      if (existingReview) {
        return res.status(400).json(ApiResponse.error('You have already reviewed this course'));
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json(ApiResponse.error('Course not found'));
      }

      const review = new CourseReview({
        courseId,
        author: userId,
        rating,
        title,
        content,
        isVerifiedPurchase: course.students.includes(userId),
      });

      await review.save();

      // Update course rating
      const allReviews = await CourseReview.find({ courseId });
      const averageRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Course.findByIdAndUpdate(courseId, { rating: Math.round(averageRating * 10) / 10 });

      await review.populate('author', 'username firstName lastName avatar');

      return res.status(201).json(ApiResponse.success(review, 'Review created successfully'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to create review', error));
    }
  },

  getCourseReviews: async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { skip = 0, limit = 10, sortBy = 'helpful' } = req.query;

      const sort: any = {};
      if (sortBy === 'helpful') {
        sort.$expr = {
          $subtract: [{ $size: '$helpful' }, { $size: '$unhelpful' }],
        };
      } else if (sortBy === 'recent') {
        sort.createdAt = -1;
      } else if (sortBy === 'rating') {
        sort.rating = -1;
      }

      const reviews = await CourseReview.find({ courseId })
        .populate('author', 'username firstName lastName avatar')
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await CourseReview.countDocuments({ courseId });
      const ratingBreakdown = await CourseReview.aggregate([
        { $match: { courseId: require('mongoose').Types.ObjectId(courseId) } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]);

      return res.json(
        ApiResponse.success({
          reviews,
          total,
          ratingBreakdown,
          skip: Number(skip),
          limit: Number(limit),
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch reviews', error));
    }
  },

  markReviewHelpful: async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { helpful } = req.body;
      const userId = (req as any).user.userId;

      const review = await CourseReview.findById(reviewId);
      if (!review) {
        return res.status(404).json(ApiResponse.error('Review not found'));
      }

      if (helpful) {
        if (!review.helpful.includes(userId)) {
          review.helpful.push(userId);
        }
        const unhelpfulIndex = review.unhelpful.indexOf(userId);
        if (unhelpfulIndex > -1) {
          review.unhelpful.splice(unhelpfulIndex, 1);
        }
      } else {
        if (!review.unhelpful.includes(userId)) {
          review.unhelpful.push(userId);
        }
        const helpfulIndex = review.helpful.indexOf(userId);
        if (helpfulIndex > -1) {
          review.helpful.splice(helpfulIndex, 1);
        }
      }

      await review.save();
      return res.json(ApiResponse.success(review, 'Review feedback recorded'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark review helpful', error));
    }
  },

  updateReview: async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { rating, title, content } = req.body;
      const userId = (req as any).user.userId;

      const review = await CourseReview.findOne({ _id: reviewId, author: userId });
      if (!review) {
        return res.status(404).json(ApiResponse.error('Review not found or unauthorized'));
      }

      if (rating) review.rating = rating;
      if (title) review.title = title;
      if (content) review.content = content;

      await review.save();
      return res.json(ApiResponse.success(review, 'Review updated successfully'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to update review', error));
    }
  },

  deleteReview: async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;
      const userId = (req as any).user.userId;

      const review = await CourseReview.findOneAndDelete({
        _id: reviewId,
        author: userId,
      });

      if (!review) {
        return res.status(404).json(ApiResponse.error('Review not found or unauthorized'));
      }

      // Recalculate course rating
      const allReviews = await CourseReview.find({ courseId: review.courseId });
      const averageRating =
        allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          : 0;
      await Course.findByIdAndUpdate(review.courseId, {
        rating: allReviews.length > 0 ? Math.round(averageRating * 10) / 10 : 0,
      });

      return res.json(ApiResponse.success({}, 'Review deleted successfully'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to delete review', error));
    }
  },

  getMyReviews: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const reviews = await CourseReview.find({ author: userId })
        .populate('courseId', 'title thumbnail')
        .sort({ createdAt: -1 });

      return res.json(ApiResponse.success(reviews));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch my reviews', error));
    }
  },
};
