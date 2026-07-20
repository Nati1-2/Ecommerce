import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { app } from './app';
import {
  createLogger,
  connectDatabase,
  messageBroker,
  EventType,
  BaseEvent,
} from '@ecom/common';
import { initSocketServer } from './services/socket.service';
import { initEmailTransporter, sendEmail } from './services/email.service';
import { notificationService } from './services/notification.service';
import {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  paymentSuccessTemplate,
  orderShippedTemplate,
} from './templates/email-templates';

const logger = createLogger('notification-service');
const PORT = parseInt(process.env.NOTIFICATION_SERVICE_PORT || '8009', 10);

const setupEventSubscriptions = async (): Promise<void> => {
  // USER_CREATED — send welcome email
  await messageBroker.subscribe(
    'notification_user_created',
    EventType.USER_CREATED,
    async (event: BaseEvent) => {
      const data = event.data as {
        userId: string;
        email: string;
        role: string;
      };

      logger.info('Processing USER_CREATED event', { userId: data.userId });

      const template = welcomeEmailTemplate(data.email);
      await sendEmail({
        to: data.email,
        subject: template.subject,
        html: template.html,
      });

      logger.info('Welcome email sent', { userId: data.userId, email: data.email });
    }
  );

  // ORDER_CREATED — send order confirmation email + real-time notification
  await messageBroker.subscribe(
    'notification_order_created',
    EventType.ORDER_CREATED,
    async (event: BaseEvent) => {
      const data = event.data as {
        orderId: string;
        userId: string;
        items: Array<{ productId: string; quantity: number; price: number }>;
        totalAmount: number;
      };

      logger.info('Processing ORDER_CREATED event', {
        orderId: data.orderId,
        userId: data.userId,
      });

      // Generate email template
      const template = orderConfirmationTemplate(data.orderId, data.totalAmount, data.items);

      // Send email + persist notification + real-time push
      await notificationService.sendEmailAndNotify(
        data.userId, // In production, resolve userId -> email via User service
        template.subject,
        template.html,
        {
          userId: data.userId,
          type: 'order_created',
          title: 'Order Placed Successfully',
          message: `Your order #${data.orderId} has been placed. Total: $${data.totalAmount.toFixed(2)}`,
          data: {
            orderId: data.orderId,
            totalAmount: data.totalAmount,
            itemCount: data.items.length,
          },
        }
      );
    }
  );

  // PAYMENT_COMPLETED — send payment success email + real-time notification
  await messageBroker.subscribe(
    'notification_payment_completed',
    EventType.PAYMENT_COMPLETED,
    async (event: BaseEvent) => {
      const data = event.data as {
        orderId: string;
        paymentIntentId: string;
        amount: number;
        userId: string;
      };

      logger.info('Processing PAYMENT_COMPLETED event', {
        orderId: data.orderId,
        userId: data.userId,
      });

      const template = paymentSuccessTemplate(data.orderId, data.amount, data.paymentIntentId);

      await notificationService.sendEmailAndNotify(
        data.userId,
        template.subject,
        template.html,
        {
          userId: data.userId,
          type: 'payment_completed',
          title: 'Payment Received',
          message: `Payment of $${data.amount.toFixed(2)} received for order #${data.orderId}.`,
          data: {
            orderId: data.orderId,
            amount: data.amount,
            paymentIntentId: data.paymentIntentId,
          },
        }
      );
    }
  );

  // ORDER_SHIPPED — send shipping update email + real-time notification
  await messageBroker.subscribe(
    'notification_order_shipped',
    EventType.ORDER_SHIPPED,
    async (event: BaseEvent) => {
      const data = event.data as {
        orderId: string;
        userId: string;
      };

      logger.info('Processing ORDER_SHIPPED event', {
        orderId: data.orderId,
        userId: data.userId,
      });

      const template = orderShippedTemplate(data.orderId);

      await notificationService.sendEmailAndNotify(
        data.userId,
        template.subject,
        template.html,
        {
          userId: data.userId,
          type: 'order_shipped',
          title: 'Order Shipped',
          message: `Your order #${data.orderId} has been shipped and is on its way!`,
          data: {
            orderId: data.orderId,
          },
        }
      );
    }
  );
};

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const dbName = process.env.NOTIFICATION_DB_NAME || 'notification_db';
    await connectDatabase(mongoUri, dbName);
    logger.info('Connected to MongoDB', { database: dbName });

    // Initialize email transporter
    initEmailTransporter();
    logger.info('Email transporter initialized');

    // Connect to RabbitMQ
    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    // Set up event subscriptions
    await setupEventSubscriptions();
    logger.info('Event subscriptions established');

    // Create HTTP server and attach Socket.IO
    const httpServer = http.createServer(app);
    initSocketServer(httpServer);
    logger.info('Socket.IO server initialized');

    // Start HTTP + WebSocket server
    httpServer.listen(PORT, () => {
      logger.info(`Notification service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start notification service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down notification service...');
  await messageBroker.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
