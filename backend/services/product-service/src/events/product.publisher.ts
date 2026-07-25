import amqp from 'amqplib';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let channel: amqp.Channel | null = null;
const EXCHANGE_NAME = 'ecommerce_events';

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const conn = await amqp.connect(config.rabbitMqUrl);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    logger.info('🐰 Connected to RabbitMQ (Product Service Publisher)');
  } catch (error) {
    logger.warn('⚠️ RabbitMQ connection warning in Product Service:', error);
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
      logger.info(`📢 Published event [${routingKey}] for productId: ${payload.productId || payload.id}`);
    }
  } catch (error) {
    logger.error(`Failed to publish event [${routingKey}]:`, error);
  }
};

export const publishProductCreated = async (product: {
  productId: string;
  vendorId: string;
  name: string;
  categoryId: string;
  price: number;
  createdAt: Date;
}): Promise<void> => {
  await publishEvent('product.created', product);
};

export const publishProductUpdated = async (product: {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  status: string;
  updatedAt: Date;
}): Promise<void> => {
  await publishEvent('product.updated', product);
};

export const publishProductDeleted = async (productId: string): Promise<void> => {
  await publishEvent('product.deleted', { productId });
};
