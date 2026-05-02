import mongoose from 'mongoose';
import { config } from './index';

let mongod: any = null;

export const connectDB = async () => {
  try {
    // Try connecting to configured URI first
    await mongoose.connect(config.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    return;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    // Fallback to in-memory Mongo for development
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✓ MongoDB (memory) connected for dev');
      return;
    } catch (memErr) {
      console.error('✗ In-memory MongoDB failed to start:', memErr);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
  }
};
