import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { startUserConsumer } from './events/user.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDB();
  await startUserConsumer();

  app.listen(config.port, () => {
    logger.info(`🚀 User Service listening on port ${config.port}`);
  });
};

startServer();
