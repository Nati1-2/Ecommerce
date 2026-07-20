import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectDatabase, createLogger, messageBroker, EventType, BaseEvent } from '@ecom/common';
import { handleOrderCreated } from './services/payment.service';

const logger = createLogger('payment-service');

const PORT = parseInt(process.env.PAYMENT_SERVICE_PORT || '8007', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.PAYMENT_DB_NAME || 'payment_db';

async function startServer(): Promise<void> {
  try {
    // Validate required Stripe config
    if (!process.env.STRIPE_SECRET_KEY) {
      logger.warn('STRIPE_SECRET_KEY is not set. Stripe operations will fail.');
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.warn('STRIPE_WEBHOOK_SECRET is not set. Webhook verification will fail.');
    }

    // Connect to MongoDB
    await connectDatabase(MONGO_URI, DB_NAME);

    // Connect to RabbitMQ
    await messageBroker.connect();

    // Subscribe to ORDER_CREATED event
    await messageBroker.subscribe(
      'payment-service-order-created',
      EventType.ORDER_CREATED,
      async (event: BaseEvent) => {
        const data = event.data as {
          orderId: string;
          userId: string;
          items: Array<{ productId: string; quantity: number; price: number }>;
          totalAmount: number;
        };
        logger.info('Received ORDER_CREATED event', { orderId: data.orderId });
        await handleOrderCreated(data.orderId, data.userId, data.totalAmount);
      }
    );

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Payment service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start payment service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await messageBroker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await messageBroker.close();
  process.exit(0);
});

startServer();
