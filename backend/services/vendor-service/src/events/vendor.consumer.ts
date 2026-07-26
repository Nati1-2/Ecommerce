import amqp from 'amqplib';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { VendorService } from '../services/vendor.service.js';

const EXCHANGE_NAME = 'ecommerce_events';
const QUEUE_NAME = 'vendor_service_queue';

export const connectConsumer = async (): Promise<void> => {
  try {
    const conn = await amqp.connect(config.rabbitMqUrl);
    const channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    // Assert queue and bind to routing keys
    const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Bind to order and payment completed events
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'order.completed');
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'order.paid');
    await channel.bindQueue(q.queue, EXCHANGE_NAME, 'payment.completed');

    logger.info(`🐰 Connected to RabbitMQ Consumer. Queue: ${q.queue}`);

    channel.consume(
      q.queue,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const eventData = JSON.parse(content);
          const routingKey = msg.fields.routingKey;

          logger.info(`📥 Received event [${routingKey}] in Vendor Service`);

          // Process order/payment completed events
          await handleOrderCompleted(eventData);

          channel.ack(msg);
        } catch (err) {
          logger.error('Error processing consumed message in Vendor Service:', err);
          // Nack message and requeue if transient error
          channel.nack(msg, false, false); 
        }
      },
      { noAck: false }
    );
  } catch (error) {
    logger.warn('⚠️ RabbitMQ Consumer connection warning in Vendor Service:', error);
  }
};

/**
 * Handles payment or order completed event to calculate commission and record earnings
 */
const handleOrderCompleted = async (orderData: any): Promise<void> => {
  const { orderId, vendorId, amount, totalAmount, items } = orderData;
  const targetOrderId = orderId || orderData.id;
  const baseAmount = amount || totalAmount || 0;

  // Scenario 1: Order has a singular vendorId and amount directly
  if (vendorId && baseAmount > 0 && targetOrderId) {
    logger.info(`Processing commission for single-vendor order ${targetOrderId}, vendor: ${vendorId}, amount: ${baseAmount}`);
    await VendorService.createVendorEarning(vendorId, targetOrderId, baseAmount);
    return;
  }

  // Scenario 2: Multi-vendor order containing items with vendorId
  if (items && Array.isArray(items) && targetOrderId) {
    logger.info(`Processing commission for multi-vendor order ${targetOrderId} with ${items.length} items`);
    
    // Group item totals by vendorId
    const vendorTotals: Record<string, number> = {};
    for (const item of items) {
      const vId = item.vendorId;
      const price = item.price || 0;
      const qty = item.quantity || 1;
      
      if (vId) {
        vendorTotals[vId] = (vendorTotals[vId] || 0) + (price * qty);
      }
    }

    for (const [vId, totalVal] of Object.entries(vendorTotals)) {
      if (totalVal > 0) {
        logger.info(`Recording earning for vendor: ${vId}, amount: ${totalVal} in order ${targetOrderId}`);
        await VendorService.createVendorEarning(vId, targetOrderId, totalVal);
      }
    }
  }
};
