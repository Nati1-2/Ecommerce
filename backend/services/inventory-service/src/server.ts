import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { connectRedis, getRedisClient } from './config/redis.js';
import { connectRabbitMQ } from './events/inventory.publisher.js';
import { connectConsumer } from './events/inventory.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Connect Redis
    connectRedis();

    // 3. Connect RabbitMQ Event Broker
    await connectRabbitMQ();
    await connectConsumer();

    // 4. Start HTTP Server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Inventory Service listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful Shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down Inventory Service gracefully...');
      
      server.close(() => {
        logger.info('HTTP server closed.');
      });

      try {
        const redisClient = getRedisClient();
        await redisClient.quit();
        logger.info('Redis connection closed.');
      } catch (err) {
        logger.error('Error closing Redis connection:', err);
      }

      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start Inventory Service server:', error);
    process.exit(1);
  }
};

startServer();
