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
    logger.info('🐰 Connected to RabbitMQ (Auth Service)');
  } catch (error) {
    logger.warn('⚠️ RabbitMQ connection warning (Will retry upon publish if needed):', error);
  }
};

export const publishUserCreatedEvent = async (user: {
  userId: string;
  email: string;
  role: string;
  createdAt: Date;
}): Promise<void> => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }

    if (channel) {
      const payload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };

      channel.publish(
        EXCHANGE_NAME,
        'user.created',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );

      logger.info(`📢 Published USER_CREATED event for userId: ${user.userId}`);
    }
  } catch (error) {
    logger.error('Failed to publish USER_CREATED event:', error);
  }
};
