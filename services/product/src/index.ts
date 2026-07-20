import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { createLogger, connectDatabase, messageBroker } from '@ecom/common';
import { app } from './app';

const logger = createLogger('product-service');

const PORT = process.env.PRODUCT_SERVICE_PORT || 8003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.PRODUCT_DB_NAME || 'product_db';

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase(MONGO_URI, DB_NAME);
    logger.info(`Connected to MongoDB database: ${DB_NAME}`);

    // Connect to RabbitMQ
    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    // Start HTTP server
    app.listen(Number(PORT), () => {
      logger.info(`Product service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start product service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down product service...');
  await messageBroker.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
