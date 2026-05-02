// User Types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'student' | 'instructor' | 'admin';
  points: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile extends Omit<IUser, 'password'> {
  followerCount: number;
  followingCount: number;
  coursesEnrolled: string[];
}

// Course Types
export interface ICourse {
  _id: string;
  title: string;
  description: string;
  instructor: string; // User ID
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  lessons: ILesson[];
  exercises: IExercise[];
  students: string[]; // User IDs
  rating: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  content: string; // HTML or Markdown
  videoUrl?: string;
  order: number;
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// Exercise Types
export interface IExercise {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  problem: string;
  testCases: ITestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface IExerciseSubmission {
  _id: string;
  exerciseId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected' | 'error';
  results: ITestResult[];
  points: number;
  submittedAt: Date;
}

export interface ITestResult {
  testCase: number;
  passed: boolean;
  output?: string;
  error?: string;
}

// Social Features Types
export interface IPost {
  _id: string;
  author: string; // User ID
  content: string;
  attachments?: string[];
  likes: string[]; // User IDs
  comments: IComment[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  author: string; // User ID
  content: string;
  likes: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

// Messaging Types
export interface IMessage {
  _id: string;
  sender: string; // User ID
  recipient: string; // User ID
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  _id: string;
  participants: string[]; // User IDs
  lastMessage?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}

// Gamification Types
export interface IBadge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  createdAt: Date;
}

// API Response Types
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Authentication Types
export interface IAuthPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}
