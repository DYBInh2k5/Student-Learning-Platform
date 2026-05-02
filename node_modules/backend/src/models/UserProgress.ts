import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonsCompleted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Lesson',
      default: [],
    },
    exercisesSubmitted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Exercise',
      default: [],
    },
    exercisesCompleted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Exercise',
      default: [],
    },
    courseProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

userProgressSchema.index({ userId: 1, courseId: 1 });

export default mongoose.model('UserProgress', userProgressSchema);
