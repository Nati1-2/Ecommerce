import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { createLogger, connectDatabase, messageBroker, EventType } from '@ecom/common';
import { app } from './app';
import { createInitialProfile } from './services/user.service';

const logger = createLogger('user-service');

const PORT = process.env.USER_SERVICE_PORT || 8002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.USER_DB_NAME || 'user_db';

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase(MONGO_URI, DB_NAME);
    logger.info(`Connected to MongoDB database: ${DB_NAME}`);

    // Connect to RabbitMQ
    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    // Subscribe to USER_CREATED events to auto-create profiles
    await messageBroker.subscribe(
      'user-service:user-created',
      EventType.USER_CREATED,
      async (event) => {
        const { userId } = event.data as { userId: string };
        logger.info('Received USER_CREATED event', { userId });
        await createInitialProfile(userId);
        logger.info('Created initial profile for user', { userId });
      }
    );

    // Start HTTP server
    app.listen(Number(PORT), () => {
      logger.info(`User service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start user service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down user service...');
  await messageBroker.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
