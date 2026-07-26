import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info(`Notification Service connected to MongoDB database at: ${env.MONGODB_URI}`);
  } catch (error) {
    logger.error('Failed to connect to MongoDB in Notification Service:', error);
    process.exit(1);
  }
};
