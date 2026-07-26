import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('🍃 Vendor Service MongoDB connected successfully (vendor_db)');
  } catch (error) {
    logger.error('❌ MongoDB connection error in Vendor Service:', error);
    process.exit(1);
  }
};
