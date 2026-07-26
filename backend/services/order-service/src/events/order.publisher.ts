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
    logger.info('Order Service connected to RabbitMQ exchange:', EXCHANGE_NAME);
  } catch (error) {
    logger.warn('RabbitMQ connection warning in Order Service Publisher:', error);
  }
};

export const publishOrderCreated = async (orderData: {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
  totalAmount: number;
}): Promise<void> => {
  if (!channel) {
    logger.warn('RabbitMQ channel not ready. Skipping publishOrderCreated');
    return;
  }
  const routingKey = 'order.created';
  const message = Buffer.from(JSON.stringify({ ...orderData, timestamp: new Date() }));
  channel.publish(EXCHANGE_NAME, routingKey, message);
  logger.info(`Published event: ${routingKey} for order ${orderData.orderId}`);
};

export const publishOrderCancelled = async (
  orderId: string,
  items: Array<{ productId: string; quantity: number }>,
  reason: string
): Promise<void> => {
  if (!channel) {
    logger.warn('RabbitMQ channel not ready. Skipping publishOrderCancelled');
    return;
  }
  const routingKey = 'order.cancelled';
  const message = Buffer.from(JSON.stringify({ orderId, items, reason, timestamp: new Date() }));
  channel.publish(EXCHANGE_NAME, routingKey, message);
  logger.info(`Published event: ${routingKey} for order ${orderId}`);
};

export const publishOrderStatusUpdated = async (
  orderId: string,
  previousStatus: string,
  newStatus: string
): Promise<void> => {
  if (!channel) return;
  const routingKey = 'order.status_updated';
  const message = Buffer.from(JSON.stringify({ orderId, previousStatus, newStatus, timestamp: new Date() }));
  channel.publish(EXCHANGE_NAME, routingKey, message);
  logger.info(`Published event: ${routingKey} for order ${orderId}`);
};
