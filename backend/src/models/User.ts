import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    enrolledCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Course',
      default: [],
    },
    totalStreak: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: 'en' },
    },
  },
  { timestamps: true }
);

userSchema.index({ points: -1 }); // For leaderboard

export default mongoose.model('User', userSchema);
