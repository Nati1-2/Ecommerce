import dotenv from 'dotenv';
dotenv.config();

import { createLogger, connectDatabase, messageBroker } from '@ecom/common';
import { app } from './app';

const logger = createLogger('auth-service');

const PORT = parseInt(process.env.AUTH_SERVICE_PORT || '8001', 10);

const start = async (): Promise<void> => {
  // ── Validate required env vars ──────────────────────
  if (!process.env.JWT_ACCESS_SECRET) {
    logger.warn('JWT_ACCESS_SECRET is not set. Using fallback secret (NOT for production).');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    logger.warn('JWT_REFRESH_SECRET is not set. Using fallback secret (NOT for production).');
  }

  // ── Connect to MongoDB ──────────────────────────────
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  const dbName = process.env.AUTH_DB_NAME || 'auth_db';
  await connectDatabase(mongoUri, dbName);

  // ── Connect to RabbitMQ ─────────────────────────────
  await messageBroker.connect();
  logger.info('Connected to RabbitMQ');

  // ── Start HTTP Server ───────────────────────────────
  app.listen(PORT, () => {
    logger.info(`Auth Service listening on port ${PORT}`);
  });

  // ── Graceful Shutdown ───────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    await messageBroker.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((err) => {
  logger.error('Failed to start Auth Service', {
    error: err instanceof Error ? err.message : 'Unknown error',
  });
  process.exit(1);
});
