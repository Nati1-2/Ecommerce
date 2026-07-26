import Stripe from 'stripe';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any
    });
  }
  return stripeClient;
}

export interface CreateCheckoutSessionParams {
  orderId: string;
  userId: string;
  customerEmail?: string;
  amount: number; // In USD / standard units
  currency?: string;
  items?: Array<{ name: string; amount: number; quantity: number }>;
  successUrl?: string;
  cancelUrl?: string;
}

export class StripeService {
  /**
   * Create a Stripe Checkout Session for order payment
   */
  public static async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
    const stripe = getStripeClient();
    const {
      orderId,
      userId,
      customerEmail,
      amount,
      currency = 'usd',
      items,
      successUrl = `${env.FRONTEND_URL}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl = `${env.FRONTEND_URL}/order/failed/${orderId}`
    } = params;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items && items.length > 0
      ? items.map(item => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: item.name },
            unit_amount: Math.round(item.amount * 100)
          },
          quantity: item.quantity
        }))
      : [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Order #${orderId}` },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: orderId,
      metadata: {
        orderId,
        userId
      }
    });

    logger.info(`Created Stripe Checkout Session ${session.id} for Order ${orderId}`);
    return session;
  }

  /**
   * Verify Webhook Signature
   */
  public static constructWebhookEvent(payload: Buffer | string, signature: string): Stripe.Event {
    const stripe = getStripeClient();
    if (!env.STRIPE_WEBHOOK_SECRET) {
      logger.warn('STRIPE_WEBHOOK_SECRET is not configured. Parsing unverified payload...');
      return typeof payload === 'string' ? JSON.parse(payload) : JSON.parse(payload.toString());
    }
    return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  }

  /**
   * Process Refund
   */
  public static async refundPayment(paymentIntentId: string, amount?: number, reason?: string): Promise<Stripe.Refund> {
    const stripe = getStripeClient();
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as any
    });
    logger.info(`Stripe refund created: ${refund.id} for PaymentIntent ${paymentIntentId}`);
    return refund;
  }
}
