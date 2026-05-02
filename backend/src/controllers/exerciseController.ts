import { Request, Response } from 'express';
import Exercise from '../models/Exercise';
import ExerciseSubmission from '../models/ExerciseSubmission';
import User from '../models/User';
import { ApiResponse } from '../utils/response';

const normalize = (value: string) => value.trim().replace(/\r\n/g, '\n');

export const exerciseController = {
  createExercise: async (req: Request, res: Response) => {
    try {
      const { courseId, title, description, problem, testCases, difficulty, points, language } = req.body;

      const exercise = new Exercise({
        courseId,
        title,
        description,
        problem,
        testCases: testCases || [],
        difficulty: difficulty || 'easy',
        points: points || 10,
        language: language || 'javascript',
      });

      await exercise.save();
      return res.status(201).json(ApiResponse.success(exercise, 'Exercise created'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to create exercise', error));
    }
  },

  getExercises: async (req: Request, res: Response) => {
    try {
      const { courseId, difficulty } = req.query;
      const filter: Record<string, unknown> = {};

      if (courseId) {
        filter.courseId = courseId;
      }
      if (difficulty) {
        filter.difficulty = difficulty;
      }

      const exercises = await Exercise.find(filter).sort({ createdAt: -1 });
      return res.json(ApiResponse.success(exercises));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch exercises', error));
    }
  },

  getExerciseById: async (req: Request, res: Response) => {
    try {
      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        return res.status(404).json(ApiResponse.error('Exercise not found'));
      }

      return res.json(ApiResponse.success(exercise));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch exercise', error));
    }
  },

  submitExercise: async (req: Request, res: Response) => {
    try {
      const { code, resultOutput } = req.body;
      const exerciseId = req.params.id;
      const userId = (req as any).user.userId;

      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json(ApiResponse.error('Exercise not found'));
      }

      const testCases = exercise.testCases || [];
      const expectedOutput = testCases.map((test: any) => test.expectedOutput).join('\n');
      const passed = normalize(resultOutput || '') === normalize(expectedOutput);

      const submission = new ExerciseSubmission({
        exerciseId,
        userId,
        code: code || '',
        resultOutput: resultOutput || '',
        status: passed ? 'accepted' : 'rejected',
        score: passed ? exercise.points : 0,
        totalTests: testCases.length,
        passedTests: passed ? testCases.length : 0,
        feedback: passed
          ? 'Great job! All test cases passed.'
          : 'Output does not match expected test results. Try again.',
      });

      await submission.save();

      if (passed) {
        await User.findByIdAndUpdate(userId, { $inc: { points: exercise.points } });
      }

      return res.status(201).json(ApiResponse.success(submission, 'Submission recorded'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to submit exercise', error));
    }
  },

  getMySubmissions: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const submissions = await ExerciseSubmission.find({ userId })
        .populate('exerciseId', 'title difficulty points')
        .sort({ createdAt: -1 });

      return res.json(ApiResponse.success(submissions));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch submissions', error));
    }
  },
};
