import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { connectRabbitMQ } from './events/vendor.publisher.js';
import { connectConsumer } from './events/vendor.consumer.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDB();
  
  // Establish RabbitMQ connections
  await connectRabbitMQ();
  await connectConsumer();

  app.listen(config.port, () => {
    logger.info(`🚀 Vendor Service listening on port ${config.port}`);
  });
};

startServer();
