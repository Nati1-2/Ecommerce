import { Transaction, ITransaction, TransactionStatus } from '../models/transaction.model';
import {
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  createLogger,
  messageBroker,
  EventType,
} from '@ecom/common';
import {
  createPaymentIntent as stripeCreatePaymentIntent,
  retrievePaymentIntent,
  processRefund as stripeProcessRefund,
  constructWebhookEvent,
} from './stripe.service';
import Stripe from 'stripe';

const logger = createLogger('payment-service');

// ============================================
// Interfaces
// ============================================

interface CreateIntentInput {
  orderId: string;
  amount: number;
  userId: string;
  currency?: string;
}

interface ConfirmPaymentInput {
  paymentIntentId: string;
  userId: string;
}

interface RefundInput {
  orderId: string;
  amount?: number;
  reason?: string;
}

// ============================================
// Service Functions
// ============================================

/**
 * Create a Stripe PaymentIntent and store a pending transaction.
 */
export async function createIntent(input: CreateIntentInput): Promise<{
  transaction: ITransaction;
  clientSecret: string;
}> {
  const { orderId, amount, userId, currency } = input;

  // Check if a transaction already exists for this order
  const existingTransaction = await Transaction.findOne({
    orderId,
    status: { $in: [TransactionStatus.PENDING, TransactionStatus.SUCCEEDED] },
  });

  if (existingTransaction) {
    throw new BadRequestError('A payment intent already exists for this order');
  }

  // Create Stripe PaymentIntent
  const paymentIntent = await stripeCreatePaymentIntent({
    amount,
    currency,
    orderId,
    userId,
  });

  // Store transaction record
  const transaction = new Transaction({
    orderId,
    userId,
    paymentIntentId: paymentIntent.id,
    amount,
    currency: currency || 'usd',
    status: TransactionStatus.PENDING,
    metadata: new Map([
      ['orderId', orderId],
      ['userId', userId],
    ]),
  });

  await transaction.save();

  logger.info('Payment intent created', {
    orderId,
    paymentIntentId: paymentIntent.id,
    amount,
  });

  return {
    transaction,
    clientSecret: paymentIntent.client_secret!,
  };
}

/**
 * Confirm a payment after client-side completion.
 * Retrieves the PaymentIntent from Stripe and updates the transaction.
 */
export async function confirmPayment(input: ConfirmPaymentInput): Promise<ITransaction> {
  const { paymentIntentId, userId } = input;

  const transaction = await Transaction.findOne({ paymentIntentId });

  if (!transaction) {
    throw new NotFoundError('Transaction');
  }

  if (transaction.userId !== userId) {
    throw new NotAuthorizedError();
  }

  // Retrieve latest status from Stripe
  const paymentIntent = await retrievePaymentIntent(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    transaction.status = TransactionStatus.SUCCEEDED;
    transaction.paymentMethod = paymentIntent.payment_method as string;
    await transaction.save();

    // Publish PAYMENT_COMPLETED event
    await messageBroker.publish({
      type: EventType.PAYMENT_COMPLETED,
      data: {
        orderId: transaction.orderId,
        paymentIntentId: transaction.paymentIntentId!,
        amount: transaction.amount,
        userId: transaction.userId,
      },
      timestamp: new Date().toISOString(),
    });

    logger.info('Payment confirmed via client', { paymentIntentId, orderId: transaction.orderId });
  } else if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'canceled') {
    transaction.status = TransactionStatus.FAILED;
    await transaction.save();

    await messageBroker.publish({
      type: EventType.PAYMENT_FAILED,
      data: {
        orderId: transaction.orderId,
        reason: `Payment status: ${paymentIntent.status}`,
        userId: transaction.userId,
      },
      timestamp: new Date().toISOString(),
    });
  }

  return transaction;
}

/**
 * Handle Stripe webhook events.
 */
export async function handleWebhook(
  rawBody: Buffer,
  signature: string
): Promise<{ received: boolean }> {
  const event = constructWebhookEvent(rawBody, signature);

  logger.info('Stripe webhook received', { type: event.type, id: event.id });

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentFailed(paymentIntent);
      break;
    }
    default:
      logger.info('Unhandled webhook event type', { type: event.type });
  }

  return { received: true };
}

/**
 * Handle payment_intent.succeeded webhook event.
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const transaction = await Transaction.findOne({ paymentIntentId: paymentIntent.id });

  if (!transaction) {
    logger.warn('No transaction found for succeeded payment intent', {
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  transaction.status = TransactionStatus.SUCCEEDED;
  transaction.paymentMethod = paymentIntent.payment_method as string;
  await transaction.save();

  // Publish PAYMENT_COMPLETED event
  await messageBroker.publish({
    type: EventType.PAYMENT_COMPLETED,
    data: {
      orderId: transaction.orderId,
      paymentIntentId: paymentIntent.id,
      amount: transaction.amount,
      userId: transaction.userId,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('Payment succeeded via webhook', {
    paymentIntentId: paymentIntent.id,
    orderId: transaction.orderId,
  });
}

/**
 * Handle payment_intent.payment_failed webhook event.
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const transaction = await Transaction.findOne({ paymentIntentId: paymentIntent.id });

  if (!transaction) {
    logger.warn('No transaction found for failed payment intent', {
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  const failureMessage =
    paymentIntent.last_payment_error?.message || 'Payment failed';

  transaction.status = TransactionStatus.FAILED;
  await transaction.save();

  // Publish PAYMENT_FAILED event
  await messageBroker.publish({
    type: EventType.PAYMENT_FAILED,
    data: {
      orderId: transaction.orderId,
      reason: failureMessage,
      userId: transaction.userId,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('Payment failed via webhook', {
    paymentIntentId: paymentIntent.id,
    orderId: transaction.orderId,
    reason: failureMessage,
  });
}

/**
 * Get paginated transactions for a user.
 */
export async function getUserTransactions(
  userId: string,
  page: number,
  limit: number
): Promise<{ transactions: ITransaction[]; total: number; page: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ITransaction[]>(),
    Transaction.countDocuments({ userId }),
  ]);

  return {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single transaction by ID. Validates ownership.
 */
export async function getTransactionById(
  transactionId: string,
  userId: string
): Promise<ITransaction> {
  const transaction = await Transaction.findById(transactionId).lean<ITransaction>();

  if (!transaction) {
    throw new NotFoundError('Transaction');
  }

  if (transaction.userId !== userId) {
    throw new NotAuthorizedError();
  }

  return transaction;
}

/**
 * Process a refund for an order (admin only).
 */
export async function processRefund(input: RefundInput): Promise<ITransaction> {
  const { orderId, amount, reason } = input;

  const transaction = await Transaction.findOne({
    orderId,
    status: TransactionStatus.SUCCEEDED,
  });

  if (!transaction) {
    throw new NotFoundError('Successful transaction for this order');
  }

  if (!transaction.paymentIntentId) {
    throw new BadRequestError('Transaction has no payment intent ID for refund');
  }

  // Process refund via Stripe
  const refund = await stripeProcessRefund({
    paymentIntentId: transaction.paymentIntentId,
    amount,
    reason,
  });

  // Update transaction record
  transaction.status = TransactionStatus.REFUNDED;
  transaction.refundId = refund.id;
  transaction.refundReason = reason || 'Refund requested by admin';
  await transaction.save();

  logger.info('Refund processed', {
    orderId,
    refundId: refund.id,
    amount: refund.amount,
  });

  return transaction;
}

/**
 * Handle ORDER_CREATED event: create a pending transaction record.
 */
export async function handleOrderCreated(
  orderId: string,
  userId: string,
  totalAmount: number
): Promise<void> {
  // Check if transaction already exists
  const existing = await Transaction.findOne({ orderId });
  if (existing) {
    logger.info('Transaction already exists for order, skipping', { orderId });
    return;
  }

  const transaction = new Transaction({
    orderId,
    userId,
    amount: totalAmount,
    currency: 'usd',
    status: TransactionStatus.PENDING,
    metadata: new Map([
      ['orderId', orderId],
      ['userId', userId],
      ['source', 'ORDER_CREATED_EVENT'],
    ]),
  });

  await transaction.save();
  logger.info('Pending transaction created from ORDER_CREATED event', { orderId });
}
