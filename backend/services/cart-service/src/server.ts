import app from './app.js';
import { env } from './config/env.js';
import { connectRedis } from './config/redis.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  connectRedis();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Cart Service running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to bootstrap Cart Service:', err);
  process.exit(1);
});
