import { Request, Response } from 'express';
import User from '../models/User';
import UserProgress from '../models/UserProgress';
import Exercise from '../models/Exercise';
import ExerciseSubmission from '../models/ExerciseSubmission';
import Course from '../models/Course';
import { ApiResponse } from '../utils/response';

export const userProgressController = {
  getCourseProgress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId } = req.params;

      const progress = await UserProgress.findOne({
        userId,
        courseId,
      }).populate('lessonsCompleted exercisesCompleted');

      if (!progress) {
        return res.status(404).json(ApiResponse.error('Progress not found'));
      }

      return res.json(ApiResponse.success(progress));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch progress', error));
    }
  },

  getAllProgress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const progress = await UserProgress.find({ userId })
        .populate('courseId', 'title thumbnail')
        .sort({ lastAccessedAt: -1 });

      return res.json(ApiResponse.success(progress));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch progress', error));
    }
  },

  updateLessonProgress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId, lessonId } = req.body;

      let progress = await UserProgress.findOne({ userId, courseId });

      if (!progress) {
        progress = new UserProgress({
          userId,
          courseId,
        });
      }

      if (!progress.lessonsCompleted.includes(lessonId)) {
        progress.lessonsCompleted.push(lessonId);
      }

      const course = await Course.findById(courseId).populate('lessons');
      if (course) {
        const totalLessons = course.lessons.length;
        const completedLessons = progress.lessonsCompleted.length;
        progress.courseProgress = Math.round((completedLessons / totalLessons) * 100);
      }

      progress.lastAccessedAt = new Date();
      await progress.save();

      return res.json(ApiResponse.success(progress, 'Lesson progress updated'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to update lesson progress', error));
    }
  },

  recordExerciseSubmission: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId, exerciseId } = req.body;

      let progress = await UserProgress.findOne({ userId, courseId });

      if (!progress) {
        progress = new UserProgress({
          userId,
          courseId,
        });
      }

      if (!progress.exercisesSubmitted.includes(exerciseId)) {
        progress.exercisesSubmitted.push(exerciseId);
      }

      progress.lastAccessedAt = new Date();
      await progress.save();

      return res.json(ApiResponse.success(progress, 'Exercise submission recorded'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to record submission', error));
    }
  },

  markExerciseCompleted: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId, exerciseId } = req.body;

      let progress = await UserProgress.findOne({ userId, courseId });

      if (!progress) {
        progress = new UserProgress({
          userId,
          courseId,
        });
      }

      if (!progress.exercisesCompleted.includes(exerciseId)) {
        progress.exercisesCompleted.push(exerciseId);
      }

      progress.lastAccessedAt = new Date();
      await progress.save();

      return res.json(ApiResponse.success(progress, 'Exercise marked as completed'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark exercise as completed', error));
    }
  },

  markCourseCompleted: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId } = req.params;

      const progress = await UserProgress.findOne({ userId, courseId });

      if (!progress) {
        return res.status(404).json(ApiResponse.error('Progress not found'));
      }

      progress.status = 'completed';
      progress.courseProgress = 100;
      progress.completedAt = new Date();
      await progress.save();

      return res.json(ApiResponse.success(progress, 'Course marked as completed'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to mark course as completed', error));
    }
  },

  getCourseStats: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { courseId } = req.params;

      const progress = await UserProgress.findOne({ userId, courseId });
      const submissions = await ExerciseSubmission.find({
        userId,
      }).populate('exerciseId');

      const courseExercises = submissions.filter((s: any) =>
        s.exerciseId?.courseId?.toString() === courseId
      );

      const acceptedSubmissions = courseExercises.filter(
        (s: any) => s.status === 'accepted'
      );
      const totalPoints = courseExercises.reduce((sum: number, s: any) => sum + s.score, 0);

      return res.json(
        ApiResponse.success({
          progress,
          totalSubmissions: courseExercises.length,
          acceptedSubmissions: acceptedSubmissions.length,
          totalPoints,
          successRate:
            courseExercises.length > 0
              ? Math.round((acceptedSubmissions.length / courseExercises.length) * 100)
              : 0,
        })
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch course stats', error));
    }
  },
};
