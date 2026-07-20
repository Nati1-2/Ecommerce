import dotenv from 'dotenv';
dotenv.config();

import { createLogger } from '@ecom/common';
import { app } from './app';

const logger = createLogger('gateway');

const PORT = parseInt(process.env.GATEWAY_PORT || '8000', 10);

const start = async (): Promise<void> => {
  // Validate required environment variables
  if (!process.env.JWT_ACCESS_SECRET) {
    logger.warn('JWT_ACCESS_SECRET is not set. Using fallback secret (NOT for production).');
  }

  app.listen(PORT, () => {
    logger.info(`API Gateway listening on port ${PORT}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start API Gateway', {
    error: err instanceof Error ? err.message : 'Unknown error',
  });
  process.exit(1);
});
