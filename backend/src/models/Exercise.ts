import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false },
      },
    ],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    points: {
      type: Number,
      default: 10,
    },
    language: {
      type: String,
      default: 'javascript',
    },
    starterCode: {
      type: String,
      default: '',
    },
    hints: [
      {
        title: String,
        content: String,
        unlockAfterAttempts: { type: Number, default: 0 },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    timeLimit: {
      type: Number, // in seconds
      default: 3600,
    },
    submissions: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

exerciseSchema.index({ courseId: 1, difficulty: 1 });
exerciseSchema.index({ tags: 1 });

export default mongoose.model('Exercise', exerciseSchema);
