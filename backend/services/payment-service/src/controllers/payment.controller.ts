import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { PaymentService } from '../services/payment.service.js';
import { StripeService } from '../services/stripe.service.js';
import { createPaymentIntentSchema, webhookPayloadSchema, refundPaymentSchema } from '../validators/payment.validator.js';
import { logger } from '../utils/logger.js';

export class PaymentController {
  /**
   * Creates a Stripe Checkout Session for order payment
   */
  public static async createCheckoutSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { orderId, amount, currency, items, successUrl, cancelUrl } = req.body;
      if (!orderId || !amount) {
        res.status(400).json({ success: false, message: 'orderId and amount are required' });
        return;
      }

      const result = await PaymentService.createStripeCheckoutSession({
        orderId,
        userId: req.user.id,
        customerEmail: req.user.email,
        amount: Number(amount),
        currency: currency || 'USD',
        items,
        successUrl,
        cancelUrl
      });

      res.status(200).json({
        success: true,
        message: 'Stripe checkout session created',
        data: {
          checkoutUrl: result.checkoutUrl,
          sessionId: result.sessionId,
          payment: result.payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public Stripe Webhook Callback endpoint with Signature Verification
   */
  public static async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sig = req.headers['stripe-signature'] as string;
      let event: any;

      if (sig) {
        try {
          event = StripeService.constructWebhookEvent(req.body, sig);
        } catch (err: any) {
          logger.error(`Webhook Signature Verification Failed: ${err.message}`);
          res.status(400).send(`Webhook Signature Error: ${err.message}`);
          return;
        }
      } else {
        event = req.body;
      }

      const payment = await PaymentService.handleStripeWebhookEvent(event);

      res.status(200).json({
        received: true,
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Legacy / Generic Webhook Handler
   */
  public static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = webhookPayloadSchema.parse(req.body);
      const payment = await PaymentService.processWebhook(validated);

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Initializes a payment intent
   */
  public static async createIntent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const validated = createPaymentIntentSchema.parse(req.body);
      const payment = await PaymentService.createPaymentIntent({
        customerId: req.user.id,
        ...validated
      });

      res.status(201).json({
        success: true,
        message: 'Payment intent created successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetches payment record for an order
   */
  public static async getPaymentByOrderId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrderId(orderId as string);

      if (!payment) {
        res.status(404).json({ success: false, message: 'Payment record not found for this order' });
        return;
      }

      res.status(200).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refunds a payment
   */
  public static async refundPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentId } = req.params;
      const validated = refundPaymentSchema.parse(req.body);

      const payment = await PaymentService.refundPayment(paymentId as string, validated.reason);

      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Paginated list of all system payments (Admin)
   */
  public static async getAllPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await PaymentService.getAllPayments(page, limit);

      res.status(200).json({
        success: true,
        data: result.payments,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
