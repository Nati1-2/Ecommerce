import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`Inventory Service Database Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to Inventory database:', error);
    process.exit(1);
  }
};
