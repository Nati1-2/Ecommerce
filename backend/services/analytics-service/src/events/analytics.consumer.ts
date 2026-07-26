import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AnalyticsService } from '../services/analytics.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'analytics_service_queue';

export const startAnalyticsConsumers = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Bind event keys
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.completed');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.failed');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'inventory.low_stock');

    logger.info(`Analytics Service listening for events on queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      logger.info(`Analytics received event: ${routingKey}`, content);

      try {
        if (routingKey === 'order.created') {
          await AnalyticsService.recordOrderCreated(content);
        } else if (routingKey === 'payment.completed') {
          await AnalyticsService.recordPaymentCompleted(content);
        } else if (routingKey === 'payment.failed') {
          await AnalyticsService.recordPaymentFailed(content);
        } else if (routingKey === 'inventory.low_stock') {
          await AnalyticsService.recordLowStockAlert(content);
        }

        channel.ack(msg);
      } catch (err) {
        logger.error(`Error processing analytics event ${routingKey}:`, err);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    logger.warn('Failed to start RabbitMQ consumer in Analytics Service:', error);
  }
};
