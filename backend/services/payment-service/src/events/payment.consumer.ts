import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { PaymentService } from '../services/payment.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'payment_service_queue';

export const startPaymentConsumers = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Bind keys
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.cancelled');

    logger.info(`Payment Service listening for events on queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      logger.info(`Received event: ${routingKey}`, content);

      try {
        if (routingKey === 'order.created') {
          const { orderId, customerId, totalAmount } = content;
          await PaymentService.handleOrderCreatedEvent(orderId, customerId, totalAmount);
        } else if (routingKey === 'order.cancelled') {
          const { orderId, reason } = content;
          await PaymentService.handleOrderCancelledEvent(orderId, reason);
        }

        channel.ack(msg);
      } catch (err) {
        logger.error(`Error processing event ${routingKey}:`, err);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    logger.warn('Failed to start RabbitMQ consumer in Payment Service:', error);
  }
};
