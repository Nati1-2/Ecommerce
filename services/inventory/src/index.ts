import dotenv from 'dotenv';
dotenv.config();

import { createLogger, connectDatabase, messageBroker } from '@ecom/common';
import { app } from './app';
import { connectRedis } from './utils/redis';
import { setupEventSubscriptions } from './services/inventory.service';

const logger = createLogger('inventory-startup');

const PORT = parseInt(process.env.INVENTORY_SERVICE_PORT || '8004', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.INVENTORY_DB_NAME || 'inventory_db';

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase(MONGO_URI, DB_NAME);
    logger.info('MongoDB connected for Inventory service');

    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected for Inventory service');

    // Connect to RabbitMQ and set up event subscriptions
    await messageBroker.connect();
    await setupEventSubscriptions();
    logger.info('RabbitMQ connected and event subscriptions established');

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Inventory service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Inventory service', {
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
