import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * Connects to a MongoDB database with retry logic.
 */
export const connectDatabase = async (
  uri: string,
  dbName: string,
  maxRetries: number = 5
): Promise<typeof mongoose> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mongoose.connect(uri, {
        dbName,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`Connected to MongoDB: ${dbName}`);

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error', { error: err.message, db: dbName });
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn(`MongoDB disconnected: ${dbName}`);
      });

      return connection;
    } catch (error) {
      retries++;
      logger.error(
        `Failed to connect to MongoDB (attempt ${retries}/${maxRetries})`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          db: dbName,
        }
      );

      if (retries >= maxRetries) {
        throw new Error(`Could not connect to MongoDB after ${maxRetries} attempts`);
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }

  throw new Error('Database connection failed');
};
