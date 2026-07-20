import dotenv from 'dotenv';
dotenv.config();

import { createLogger, messageBroker } from '@ecom/common';
import { app } from './app';
import { connectRedis } from './utils/redis';

const logger = createLogger('cart-startup');

const PORT = parseInt(process.env.CART_SERVICE_PORT || '8005', 10);

const start = async (): Promise<void> => {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected for Cart service');

    // Connect to RabbitMQ (for future event publishing if needed)
    await messageBroker.connect();
    logger.info('RabbitMQ connected for Cart service');

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Cart service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Cart service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down gracefully');
  await messageBroker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received — shutting down gracefully');
  await messageBroker.close();
  process.exit(0);
});

start();
