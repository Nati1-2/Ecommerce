import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let channel: amqp.Channel | null = null;
const EXCHANGE_NAME = 'ecommerce_events';

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const conn = await amqp.connect(env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    logger.info('🐰 Connected to RabbitMQ (Inventory Service Publisher)');
  } catch (error) {
    logger.warn('⚠️ RabbitMQ connection warning in Inventory Service Publisher:', error);
  }
};

const publishEvent = async (routingKey: string, payload: any): Promise<void> => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }

    if (channel) {
      channel.publish(
        EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      logger.info(`📢 Published event [${routingKey}] for productId/orderId: ${payload.productId || payload.orderId}`);
    }
  } catch (error) {
    logger.error(`Failed to publish event [${routingKey}]:`, error);
  }
};

export const publishInventoryReserved = async (orderId: string, items: Array<{ productId: string; quantity: number }>): Promise<void> => {
  await publishEvent('inventory.reserved', { orderId, items, timestamp: new Date() });
};

export const publishInventoryLowStock = async (productId: string, availableStock: number, threshold: number): Promise<void> => {
  await publishEvent('inventory.low_stock', { productId, availableStock, threshold, timestamp: new Date() });
};
