import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { startAnalyticsConsumers } from './events/analytics.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDatabase();
  await startAnalyticsConsumers();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Analytics Service running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to bootstrap Analytics Service:', err);
  process.exit(1);
});
