import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { connectRabbitMQ } from './events/product.publisher.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDB();
  await connectRabbitMQ();

  app.listen(config.port, () => {
    logger.info(`🚀 Product Service listening on port ${config.port}`);
  });
};

startServer();
