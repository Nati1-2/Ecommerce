import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectRabbitMQ } from './events/payment.publisher.js';
import { startPaymentConsumers } from './events/payment.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDatabase();
  await connectRabbitMQ();
  await startPaymentConsumers();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Payment Service running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to bootstrap Payment Service:', err);
  process.exit(1);
});
