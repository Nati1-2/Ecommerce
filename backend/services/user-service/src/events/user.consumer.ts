import amqp from 'amqplib';
import { config } from '../config/env.js';
import { UserProfile } from '../models/UserProfile.js';
import { logger } from '../utils/logger.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'user_service_user_created';

export const startUserConsumer = async (): Promise<void> => {
  try {
    const conn = await amqp.connect(config.rabbitMqUrl);
    const channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'user.created');

    logger.info('🐰 User Service consumer listening for user.created events...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(`📩 Received USER_CREATED event for authUserId: ${content.userId}`);

          const existingProfile = await UserProfile.findOne({ authUserId: content.userId });
          if (!existingProfile) {
            await UserProfile.create({
              authUserId: content.userId,
              firstName: content.firstName || 'New',
              lastName: content.lastName || 'User',
              status: 'ACTIVE'
            });
            logger.info(`✨ Automatically created default UserProfile for authUserId: ${content.userId}`);
          }

          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing USER_CREATED event:', error);
          channel.nack(msg, false, false); // send to DLQ if configured
        }
      }
    });
  } catch (error) {
    logger.warn('⚠️ RabbitMQ Consumer warning (Will retry connecting):', error);
  }
};
