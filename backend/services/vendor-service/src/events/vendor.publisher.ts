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
    logger.info('🐰 Connected to RabbitMQ (Vendor Service Publisher)');
  } catch (error) {
    logger.warn('⚠️ RabbitMQ connection warning in Vendor Service Publisher:', error);
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
      logger.info(`📢 Published event [${routingKey}] for vendorId: ${payload.vendorId}`);
    }
  } catch (error) {
    logger.error(`Failed to publish event [${routingKey}]:`, error);
  }
};

export const publishVendorCreated = async (vendor: {
  vendorId: string;
  userId: string;
  businessName: string;
  createdAt: Date;
}): Promise<void> => {
  await publishEvent('vendor.created', vendor);
};

export const publishVendorApproved = async (vendor: {
  vendorId: string;
  status: string;
  approvedAt: Date;
}): Promise<void> => {
  await publishEvent('vendor.approved', vendor);
};
