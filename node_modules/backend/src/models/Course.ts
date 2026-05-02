import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: Number,
      default: 0,
    },
    lessons: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Lesson',
      default: [],
    },
    exercises: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Exercise',
      default: [],
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
