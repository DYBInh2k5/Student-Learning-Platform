import { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import { ApiResponse } from '../utils/response';

export const courseController = {
  createCourse: async (req: Request, res: Response) => {
    try {
      const { title, description, category, level } = req.body;
      const course = new Course({
        title,
        description,
        category,
        level,
        instructor: (req as any).user.userId,
      });

      await course.save();
      return res.status(201).json(ApiResponse.success(course, 'Course created'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to create course', error));
    }
  },

  getCourses: async (req: Request, res: Response) => {
    try {
      const { skip = 0, limit = 10, category, level } = req.query;
      const filter: any = {};
      if (category) filter.category = category;
      if (level) filter.level = level;

      const courses = await Course.find(filter)
        .populate('instructor', 'username firstName lastName avatar')
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await Course.countDocuments(filter);

      return res.json(
        ApiResponse.success(
          {
            courses,
            total,
            skip: Number(skip),
            limit: Number(limit),
          },
          'Courses fetched'
        )
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch courses', error));
    }
  },

  getCourseById: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id)
        .populate('instructor', 'username firstName lastName avatar')
        .populate('lessons')
        .populate('exercises');

      if (!course) {
        return res.status(404).json(ApiResponse.error('Course not found'));
      }

      return res.json(ApiResponse.success(course));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch course', error));
    }
  },

  enrollCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json(ApiResponse.error('Course not found'));
      }

      const userId = (req as any).user.userId;
      const alreadyEnrolled = course.students.some((studentId: any) => studentId.toString() === userId);

      if (alreadyEnrolled) {
        return res.status(400).json(ApiResponse.error('Already enrolled in this course'));
      }

      course.students.push(userId);
      course.enrollmentCount += 1;
      await course.save();

      try {
        const User = require('../models/User').default;
        const { notificationController } = require('./notificationController');
        const userDoc = await User.findById(userId);
        const instructorId = course.instructor as any;
        if (instructorId) {
          notificationController.createNotification(
            String(instructorId),
            'course_started',
            'Student enrolled in your course',
            `${userDoc?.username || 'Someone'} enrolled in your course: ${course.title}`,
            userId,
            { type: 'course', id: course._id },
            'normal'
          );
        }
      } catch (err) {
        console.error('Failed to send enrollment notification:', err);
      }

      return res.json(ApiResponse.success(course, 'Enrolled successfully'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to enroll', error));
    }
  },

  addLesson: async (req: Request, res: Response) => {
    try {
      const { courseId, title, description, content, order } = req.body;
      const lesson = new Lesson({
        courseId,
        title,
        description,
        content,
        order,
      });

      await lesson.save();
      await Course.findByIdAndUpdate(courseId, {
        $push: { lessons: lesson._id },
      });

      return res.status(201).json(ApiResponse.success(lesson, 'Lesson added'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to add lesson', error));
    }
  },
};
