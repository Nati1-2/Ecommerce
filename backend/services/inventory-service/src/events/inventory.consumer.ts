import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { InventoryService } from '../services/inventory.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'inventory_service_queue';

export const connectConsumer = async (): Promise<void> => {
  try {
    const conn = await amqp.connect(env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    // Assert durable queue
    const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Bind to relevant events
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'order.created');
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'order.cancelled');
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'order.paid');
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'payment.completed');

    logger.info(`🐰 Connected to RabbitMQ Consumer. Queue: ${q.queue}`);

    channel.consume(
      q.queue,
      async (msg) => {
        if (!msg) return;

        const routingKey = msg.fields.routingKey;
        const content = msg.content.toString();
        
        try {
          const eventData = JSON.parse(content);
          logger.info(`📥 Received event [${routingKey}] in Inventory Service`);

          const orderId = eventData.orderId || eventData.id;
          const items = eventData.items;

          if (!orderId || !items || !Array.isArray(items)) {
            logger.warn(`⚠️ Skipped event [${routingKey}] due to missing orderId or items`);
            channel.ack(msg);
            return;
          }

          if (routingKey === 'order.created') {
            try {
              await InventoryService.reserveStock(orderId, items);
              logger.info(`✅ Stock reserved successfully for Order: ${orderId}`);
            } catch (err: any) {
              logger.error(`❌ Failed to reserve stock for Order: ${orderId}. Error: ${err.message}`);
              
              // Publish a reservation failure event back to RabbitMQ so Order Service can cancel/fail the order
              channel.publish(
                EXCHANGE_NAME,
                'inventory.reservation_failed',
                Buffer.from(JSON.stringify({
                  orderId,
                  reason: err.message,
                  timestamp: new Date()
                })),
                { persistent: true }
              );
            }
          } else if (routingKey === 'order.cancelled') {
            await InventoryService.releaseStock(orderId, items);
            logger.info(`✅ Stock released successfully for Order: ${orderId}`);
          } else if (routingKey === 'order.paid' || routingKey === 'payment.completed') {
            await InventoryService.deductStock(orderId, items);
            logger.info(`✅ Stock deducted permanently for Order: ${orderId}`);
          }

          channel.ack(msg);
        } catch (err) {
          logger.error(`Error processing message from routing key [${routingKey}]:`, err);
          // Nack message; do not requeue to prevent infinite loops on malformed JSON
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    logger.warn('⚠️ RabbitMQ Consumer connection warning in Inventory Service:', error);
  }
};
