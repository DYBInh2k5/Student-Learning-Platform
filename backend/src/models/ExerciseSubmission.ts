import mongoose from 'mongoose';

const exerciseSubmissionSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    resultOutput: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'error'],
      default: 'pending',
    },
    score: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

exerciseSubmissionSchema.index({ exerciseId: 1, userId: 1, createdAt: -1 });

export default mongoose.model('ExerciseSubmission', exerciseSubmissionSchema);
