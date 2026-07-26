import { Payment, IPayment, PaymentProvider } from '../models/Payment.js';
import { publishPaymentCompleted, publishPaymentFailed } from '../events/payment.publisher.js';
import { StripeService, CreateCheckoutSessionParams } from './stripe.service.js';
import { logger } from '../utils/logger.js';
import Stripe from 'stripe';

export interface CreatePaymentIntentPayload {
  orderId: string;
  customerId: string;
  amount: number;
  currency?: string;
  provider?: PaymentProvider;
  idempotencyKey?: string;
}

export class PaymentService {
  /**
   * Generates a unique payment ID (e.g. PAY-20260726-9912)
   */
  private static generatePaymentId(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `PAY-${dateStr}-${randomSuffix}`;
  }

  /**
   * Initializes Stripe Checkout Session & creates local PENDING payment record
   */
  public static async createStripeCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ checkoutUrl: string | null; sessionId: string; payment: IPayment }> {
    const session = await StripeService.createCheckoutSession(params);
    
    let payment = await Payment.findOne({ orderId: params.orderId });
    if (!payment) {
      payment = await Payment.create({
        paymentId: this.generatePaymentId(),
        orderId: params.orderId,
        customerId: params.userId,
        userId: params.userId,
        amount: params.amount,
        currency: (params.currency || 'USD').toUpperCase(),
        provider: 'STRIPE',
        status: 'PENDING',
        stripeSessionId: session.id
      });
    } else {
      payment.stripeSessionId = session.id;
      payment.provider = 'STRIPE';
      await payment.save();
    }

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      payment
    };
  }

  /**
   * Handles verified Stripe Webhook Events
   */
  public static async handleStripeWebhookEvent(event: Stripe.Event): Promise<IPayment | null> {
    logger.info(`Processing Stripe Webhook Event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
        
        if (!orderId) {
          logger.warn(`Stripe session ${session.id} missing orderId metadata.`);
          return null;
        }

        return this.processWebhook({
          event: event.type,
          transactionId: paymentIntentId || session.id,
          orderId,
          status: 'COMPLETED',
          stripeSessionId: session.id,
          stripePaymentIntentId: paymentIntentId
        });
      }

      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        if (!orderId) return null;

        return this.processWebhook({
          event: event.type,
          transactionId: intent.id,
          orderId,
          status: 'COMPLETED',
          stripePaymentIntentId: intent.id
        });
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        if (!orderId) return null;

        return this.processWebhook({
          event: event.type,
          transactionId: intent.id,
          orderId,
          status: 'FAILED',
          failureReason: intent.last_payment_error?.message || 'Payment intent failed',
          stripePaymentIntentId: intent.id
        });
      }

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
        return null;
    }
  }

  /**
   * Initializes a payment intent (Idempotent)
   */
  public static async createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<IPayment> {
    const { orderId, customerId, amount, currency = 'USD', provider = 'STRIPE', idempotencyKey } = payload;

    if (idempotencyKey) {
      const existingKeyPayment = await Payment.findOne({ idempotencyKey });
      if (existingKeyPayment) {
        logger.info(`Returning existing payment for idempotency key: ${idempotencyKey}`);
        return existingKeyPayment;
      }
    }

    const existingOrderPayment = await Payment.findOne({ orderId, status: { $in: ['PENDING', 'COMPLETED'] } });
    if (existingOrderPayment) {
      logger.info(`Payment already exists for order ${orderId}`);
      return existingOrderPayment;
    }

    const paymentId = this.generatePaymentId();
    const payment = await Payment.create({
      paymentId,
      orderId,
      customerId,
      userId: customerId,
      amount,
      currency,
      provider,
      status: 'PENDING',
      idempotencyKey: idempotencyKey || `IK-${paymentId}`
    });

    logger.info(`Payment intent created: ${payment.paymentId} for Order: ${orderId} (Amount: $${amount})`);
    return payment;
  }

  /**
   * Processes asynchronous gateway webhooks and publishes RabbitMQ events
   */
  public static async processWebhook(payload: {
    event: string;
    transactionId: string;
    orderId: string;
    status: 'COMPLETED' | 'FAILED';
    failureReason?: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
  }): Promise<IPayment> {
    const { transactionId, orderId, status, failureReason, stripeSessionId, stripePaymentIntentId } = payload;

    let payment = await Payment.findOne({ orderId });
    if (!payment) {
      logger.warn(`No payment record found for order ${orderId} during webhook processing. Creating default...`);
      payment = await Payment.create({
        paymentId: this.generatePaymentId(),
        orderId,
        customerId: 'unknown-customer',
        userId: 'unknown-customer',
        amount: 0,
        currency: 'USD',
        provider: 'STRIPE',
        status: 'PENDING'
      });
    }

    payment.transactionId = transactionId;
    if (stripeSessionId) payment.stripeSessionId = stripeSessionId;
    if (stripePaymentIntentId) payment.stripePaymentIntentId = stripePaymentIntentId;
    payment.rawWebhookPayload = payload;

    if (status === 'COMPLETED') {
      payment.status = 'COMPLETED';
      await payment.save();

      logger.info(`Payment COMPLETED for Order: ${orderId} (Txn: ${transactionId})`);

      await publishPaymentCompleted({
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        customerId: payment.customerId,
        userId: payment.userId || payment.customerId,
        amount: payment.amount,
        provider: payment.provider,
        transactionId: payment.transactionId
      });
    } else {
      payment.status = 'FAILED';
      payment.failureReason = failureReason || 'Gateway payment declined';
      await payment.save();

      logger.warn(`Payment FAILED for Order: ${orderId}. Reason: ${payment.failureReason}`);

      await publishPaymentFailed({
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        customerId: payment.customerId,
        userId: payment.userId || payment.customerId,
        amount: payment.amount,
        reason: payment.failureReason
      });
    }

    return payment;
  }

  /**
   * Fetches payment details by orderId
   */
  public static async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    return Payment.findOne({ orderId });
  }

  /**
   * Processes a refund for a completed payment via Stripe API & DB
   */
  public static async refundPayment(paymentId: string, reason: string): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    if (payment.status !== 'COMPLETED') {
      throw new Error(`Cannot refund payment ${paymentId} because status is ${payment.status}`);
    }

    if (payment.stripePaymentIntentId && payment.provider === 'STRIPE') {
      await StripeService.refundPayment(payment.stripePaymentIntentId, payment.amount, reason);
    }

    payment.status = 'REFUNDED';
    payment.refundReason = reason;
    await payment.save();

    logger.info(`Payment ${paymentId} REFUNDED. Reason: ${reason}`);
    return payment;
  }

  /**
   * Auto-initializes payment record when order is created
   */
  public static async handleOrderCreatedEvent(orderId: string, customerId: string, totalAmount: number): Promise<void> {
    await this.createPaymentIntent({
      orderId,
      customerId,
      amount: totalAmount
    });
  }

  /**
   * Marks pending payment as failed when order is cancelled
   */
  public static async handleOrderCancelledEvent(orderId: string, reason: string): Promise<void> {
    const payment = await Payment.findOne({ orderId, status: 'PENDING' });
    if (payment) {
      payment.status = 'FAILED';
      payment.failureReason = `Order cancelled: ${reason}`;
      await payment.save();
      logger.info(`Pending payment for order ${orderId} set to FAILED due to order cancellation`);
    }
  }

  /**
   * Paginated list of all system payment transactions (Admin)
   */
  public static async getAllPayments(page = 1, limit = 20): Promise<{ payments: IPayment[]; total: number }> {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments()
    ]);
    return { payments, total };
  }
}
