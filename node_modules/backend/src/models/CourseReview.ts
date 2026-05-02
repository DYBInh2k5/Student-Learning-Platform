import mongoose from 'mongoose';

const courseReviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    helpful: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    unhelpful: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

courseReviewSchema.index({ courseId: 1, createdAt: -1 });
courseReviewSchema.index({ author: 1 });

export default mongoose.model('CourseReview', courseReviewSchema);
