import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('🍃 User Service MongoDB connected successfully (user_db)');
  } catch (error) {
    logger.error('❌ MongoDB connection error in User Service:', error);
    process.exit(1);
  }
};
