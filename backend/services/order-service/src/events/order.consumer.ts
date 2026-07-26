import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { OrderService } from '../services/order.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'order_service_queue';

export const startOrderConsumers = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Bind keys
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'inventory.reserved');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'inventory.insufficient');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.completed');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.failed');

    logger.info(`Order Service listening for events on queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      logger.info(`Received event: ${routingKey}`, content);

      try {
        if (routingKey === 'inventory.reserved') {
          const { orderId } = content;
          await OrderService.updateOrderStatus(orderId, 'RESERVED');
        } else if (routingKey === 'inventory.insufficient') {
          const { orderId, reason } = content;
          await OrderService.updateOrderStatus(orderId, 'CANCELLED', reason || 'INSUFFICIENT_STOCK');
        } else if (routingKey === 'payment.completed') {
          const { orderId } = content;
          await OrderService.updateOrderPaymentCompleted(orderId);
        } else if (routingKey === 'payment.failed') {
          const { orderId, reason } = content;
          await OrderService.cancelOrderSystem(orderId, reason || 'PAYMENT_FAILED');
        }

        channel.ack(msg);
      } catch (err) {
        logger.error(`Error processing event ${routingKey}:`, err);
        channel.nack(msg, false, false); // DLQ or discard
      }
    });
  } catch (error) {
    logger.warn('Failed to start RabbitMQ consumer in Order Service:', error);
  }
};
