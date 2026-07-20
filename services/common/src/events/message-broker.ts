import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { logger } from '../utils/logger';

/**
 * Event types used across the platform for inter-service communication.
 */
export enum EventType {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  PRODUCT_CREATED = 'product.created',
  PRODUCT_UPDATED = 'product.updated',
  PRODUCT_DELETED = 'product.deleted',
  ORDER_CREATED = 'order.created',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_DELIVERED = 'order.delivered',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  INVENTORY_UPDATED = 'inventory.updated',
  INVENTORY_RESERVED = 'inventory.reserved',
  INVENTORY_RELEASED = 'inventory.released',
}

/**
 * Base event interface — all events must have a type and data payload.
 */
export interface BaseEvent {
  type: EventType;
  data: Record<string, unknown>;
  timestamp: string;
  correlationId?: string;
}

// ============================================
// Event Definitions
// ============================================

export interface UserCreatedEvent extends BaseEvent {
  type: EventType.USER_CREATED;
  data: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface ProductCreatedEvent extends BaseEvent {
  type: EventType.PRODUCT_CREATED;
  data: {
    productId: string;
    name: string;
    price: number;
    category: string;
    sellerId: string;
    description: string;
    images: string[];
  };
}

export interface ProductUpdatedEvent extends BaseEvent {
  type: EventType.PRODUCT_UPDATED;
  data: {
    productId: string;
    [key: string]: unknown;
  };
}

export interface ProductDeletedEvent extends BaseEvent {
  type: EventType.PRODUCT_DELETED;
  data: {
    productId: string;
  };
}

export interface OrderCreatedEvent extends BaseEvent {
  type: EventType.ORDER_CREATED;
  data: {
    orderId: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
  };
}

export interface OrderCancelledEvent extends BaseEvent {
  type: EventType.ORDER_CANCELLED;
  data: {
    orderId: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    reason?: string;
  };
}

export interface PaymentCompletedEvent extends BaseEvent {
  type: EventType.PAYMENT_COMPLETED;
  data: {
    orderId: string;
    paymentIntentId: string;
    amount: number;
    userId: string;
  };
}

export interface PaymentFailedEvent extends BaseEvent {
  type: EventType.PAYMENT_FAILED;
  data: {
    orderId: string;
    reason: string;
    userId: string;
  };
}

export interface InventoryUpdatedEvent extends BaseEvent {
  type: EventType.INVENTORY_UPDATED;
  data: {
    productId: string;
    stock: number;
    reservedStock: number;
  };
}

// ============================================
// RabbitMQ Broker Client
// ============================================

const EXCHANGE_NAME = 'ecommerce_events';
const EXCHANGE_TYPE = 'topic';

class MessageBroker {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnected = false;

  async connect(url?: string): Promise<void> {
    const rabbitmqUrl = url || process.env.RABBITMQ_URL || 'amqp://localhost:5672';

    try {
      this.connection = await amqplib.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Declare the main exchange for topic-based routing
      await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
        durable: true,
      });

      this.isConnected = true;
      logger.info('Connected to RabbitMQ');

      // Handle disconnections gracefully
      this.connection.on('close', () => {
        this.isConnected = false;
        logger.warn('RabbitMQ connection closed. Attempting reconnect...');
        setTimeout(() => this.connect(rabbitmqUrl), 5000);
      });

      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error', { error: err.message });
      });
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Retry after delay
      setTimeout(() => this.connect(rabbitmqUrl), 5000);
    }
  }

  /**
   * Publish an event to the exchange with the event type as routing key.
   */
  async publish(event: BaseEvent): Promise<void> {
    if (!this.channel || !this.isConnected) {
      logger.warn('RabbitMQ not connected. Cannot publish event.', { type: event.type });
      return;
    }

    const message = Buffer.from(
      JSON.stringify({
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
      })
    );

    this.channel.publish(EXCHANGE_NAME, event.type, message, {
      persistent: true,
      contentType: 'application/json',
    });

    logger.info('Event published', { type: event.type });
  }

  /**
   * Subscribe to events by routing key pattern.
   * @param queueName - Unique queue name for this service's subscription
   * @param routingKey - Event type or pattern to subscribe to (e.g. 'order.*')
   * @param callback  - Handler function for received messages
   */
  async subscribe(
    queueName: string,
    routingKey: string,
    callback: (event: BaseEvent) => Promise<void>
  ): Promise<void> {
    if (!this.channel || !this.isConnected) {
      logger.warn('RabbitMQ not connected. Cannot subscribe.', { queueName, routingKey });
      return;
    }

    // Create a durable queue
    await this.channel.assertQueue(queueName, { durable: true });

    // Bind queue to the exchange with the routing key
    await this.channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);

    // Prefetch 1 message at a time for fair dispatching
    await this.channel.prefetch(1);

    this.channel.consume(queueName, async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString()) as BaseEvent;
        await callback(event);
        this.channel!.ack(msg);
      } catch (error) {
        logger.error('Error processing message', {
          queue: queueName,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        // Negative acknowledge — requeue for retry
        this.channel!.nack(msg, false, true);
      }
    });

    logger.info('Subscribed to events', { queueName, routingKey });
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.isConnected = false;
    logger.info('RabbitMQ connection closed');
  }
}

// Export singleton instance
export const messageBroker = new MessageBroker();
