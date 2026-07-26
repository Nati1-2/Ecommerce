import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let channel: amqp.Channel | null = null;
const EXCHANGE_NAME = 'ecommerce_events';

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    logger.info('Payment Service connected to RabbitMQ exchange:', EXCHANGE_NAME);
  } catch (error) {
    logger.warn('RabbitMQ connection warning in Payment Service Publisher:', error);
  }
};

export const publishPaymentCompleted = async (paymentData: {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  provider: string;
  transactionId?: string;
}): Promise<void> => {
  if (!channel) {
    logger.warn('RabbitMQ channel not ready. Skipping publishPaymentCompleted');
    return;
  }
  const routingKey = 'payment.completed';
  const message = Buffer.from(JSON.stringify({ ...paymentData, timestamp: new Date() }));
  channel.publish(EXCHANGE_NAME, routingKey, message);
  logger.info(`Published event: ${routingKey} for order ${paymentData.orderId}`);
};

export const publishPaymentFailed = async (paymentData: {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  reason: string;
}): Promise<void> => {
  if (!channel) {
    logger.warn('RabbitMQ channel not ready. Skipping publishPaymentFailed');
    return;
  }
  const routingKey = 'payment.failed';
  const message = Buffer.from(JSON.stringify({ ...paymentData, timestamp: new Date() }));
  channel.publish(EXCHANGE_NAME, routingKey, message);
  logger.info(`Published event: ${routingKey} for order ${paymentData.orderId}`);
};
