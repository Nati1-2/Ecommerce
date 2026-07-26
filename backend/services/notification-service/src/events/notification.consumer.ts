import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { NotificationService } from '../services/notification.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'notification_service_queue';

export const startNotificationConsumers = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Bind event keys
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.completed');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'payment.failed');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.status_updated');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'inventory.low_stock');

    logger.info(`Notification Service listening for events on queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      logger.info(`Received event: ${routingKey}`, content);

      try {
        if (routingKey === 'order.created') {
          const { orderId, customerId, totalAmount } = content;
          await NotificationService.createNotification({
            recipientId: customerId,
            type: 'ORDER_CONFIRMATION',
            subject: `Order Placed Successfully (#${orderId})`,
            body: `Your order #${orderId} for $${totalAmount} has been placed and stock has been reserved.`,
            metadata: { orderId, totalAmount }
          });
        } else if (routingKey === 'payment.completed') {
          const { orderId, customerId, amount, transactionId } = content;
          await NotificationService.createNotification({
            recipientId: customerId,
            type: 'PAYMENT_SUCCESS',
            subject: `Payment Receipt for Order #${orderId}`,
            body: `We have received your payment of $${amount} (Txn: ${transactionId}). Your order is being processed for shipping!`,
            metadata: { orderId, transactionId, amount }
          });
        } else if (routingKey === 'payment.failed') {
          const { orderId, customerId, reason } = content;
          await NotificationService.createNotification({
            recipientId: customerId,
            type: 'PAYMENT_FAILED',
            subject: `Payment Issue for Order #${orderId}`,
            body: `Your payment for order #${orderId} was declined. Reason: ${reason}. Please update your payment method.`,
            metadata: { orderId, reason }
          });
        } else if (routingKey === 'order.status_updated') {
          const { orderId, newStatus } = content;
          if (newStatus === 'SHIPPED') {
            await NotificationService.createNotification({
              recipientId: 'order-owner',
              type: 'ORDER_SHIPPED',
              subject: `Your Order #${orderId} Has Shipped!`,
              body: `Great news! Order #${orderId} is on its way. Track your delivery in your account orders dashboard.`,
              metadata: { orderId, status: newStatus }
            });
          }
        } else if (routingKey === 'inventory.low_stock') {
          const { productId, availableStock, threshold } = content;
          await NotificationService.createNotification({
            recipientId: 'vendor-admin',
            type: 'LOW_STOCK_ALERT',
            subject: `⚠️ Low Stock Alert: Product ${productId}`,
            body: `Stock for product ${productId} has fallen to ${availableStock} (Threshold: ${threshold}). Please replenish inventory soon.`,
            metadata: { productId, availableStock, threshold }
          });
        }

        channel.ack(msg);
      } catch (err) {
        logger.error(`Error processing notification event ${routingKey}:`, err);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    logger.warn('Failed to start RabbitMQ consumer in Notification Service:', error);
  }
};
