import Stripe from 'stripe';
import { createLogger, BadRequestError } from '@ecom/common';

const logger = createLogger('stripe-service');

// ============================================
// Stripe Client Singleton
// ============================================

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestError('Stripe secret key is not configured');
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }
  return stripeClient;
}

// ============================================
// Interfaces
// ============================================

interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  orderId: string;
  userId: string;
  customerEmail?: string;
}

interface RefundInput {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

// ============================================
// Service Functions
// ============================================

/**
 * Create a Stripe PaymentIntent.
 * Amount is in the smallest currency unit (e.g., cents for USD).
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  const { amount, currency = 'usd', orderId, userId } = input;

  // Amount must be in cents for USD
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    metadata: {
      orderId,
      userId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  logger.info('PaymentIntent created', {
    paymentIntentId: paymentIntent.id,
    orderId,
    amount: amountInCents,
  });

  return paymentIntent;
}

/**
 * Retrieve a PaymentIntent by ID from Stripe.
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
}

/**
 * Process a refund for a PaymentIntent.
 */
export async function processRefund(
  input: RefundInput
): Promise<Stripe.Refund> {
  const stripe = getStripeClient();
  const { paymentIntentId, amount, reason } = input;

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundParams.amount = Math.round(amount * 100);
  }

  if (reason) {
    // Stripe only accepts specific reason enums; store custom reason in metadata
    refundParams.metadata = { reason };
  }

  const refund = await stripe.refunds.create(refundParams);

  logger.info('Refund processed', {
    refundId: refund.id,
    paymentIntentId,
    amount: refund.amount,
  });

  return refund;
}

/**
 * Verify a Stripe webhook signature and parse the event.
 */
export function constructWebhookEvent(
  rawBody: Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new BadRequestError('Stripe webhook secret is not configured');
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  return event;
}
