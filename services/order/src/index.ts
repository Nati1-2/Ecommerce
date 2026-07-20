import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectDatabase, createLogger, messageBroker, EventType, BaseEvent } from '@ecom/common';
import { handlePaymentCompleted, handlePaymentFailed } from './services/order.service';

const logger = createLogger('order-service');

const PORT = parseInt(process.env.ORDER_SERVICE_PORT || '8006', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.ORDER_DB_NAME || 'order_db';

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase(MONGO_URI, DB_NAME);

    // Connect to RabbitMQ
    await messageBroker.connect();

    // Subscribe to payment events
    await messageBroker.subscribe(
      'order-service-payment-completed',
      EventType.PAYMENT_COMPLETED,
      async (event: BaseEvent) => {
        const data = event.data as {
          orderId: string;
          paymentIntentId: string;
          amount: number;
          userId: string;
        };
        logger.info('Received PAYMENT_COMPLETED event', { orderId: data.orderId });
        await handlePaymentCompleted(data.orderId, data.paymentIntentId);
      }
    );

    await messageBroker.subscribe(
      'order-service-payment-failed',
      EventType.PAYMENT_FAILED,
      async (event: BaseEvent) => {
        const data = event.data as {
          orderId: string;
          reason: string;
          userId: string;
        };
        logger.info('Received PAYMENT_FAILED event', { orderId: data.orderId });
        await handlePaymentFailed(data.orderId, data.reason);
      }
    );

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Order service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start order service', {
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
