import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        likes: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'User',
          default: [],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
