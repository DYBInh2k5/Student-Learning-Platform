import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'post_liked',
        'post_commented',
        'user_followed',
        'course_started',
        'exercise_passed',
        'exercise_failed',
        'new_message',
        'course_review',
        'achievement_unlocked',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedItem: {
      itemType: {
        type: String,
        enum: ['post', 'course', 'exercise', 'user', 'message'],
      },
      itemId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    importance: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
