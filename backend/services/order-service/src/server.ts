import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectRabbitMQ } from './events/order.publisher.js';
import { startOrderConsumers } from './events/order.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDatabase();
  await connectRabbitMQ();
  await startOrderConsumers();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Order Service running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to bootstrap Order Service:', err);
  process.exit(1);
});
