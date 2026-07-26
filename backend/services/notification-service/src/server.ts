import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { startNotificationConsumers } from './events/notification.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDatabase();
  await startNotificationConsumers();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Notification Service running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to bootstrap Notification Service:', err);
  process.exit(1);
});
