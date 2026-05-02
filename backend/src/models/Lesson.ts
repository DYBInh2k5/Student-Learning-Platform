import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
