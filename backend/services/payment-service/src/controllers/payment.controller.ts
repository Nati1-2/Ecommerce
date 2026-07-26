import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { PaymentService } from '../services/payment.service.js';
import { createPaymentIntentSchema, webhookPayloadSchema, refundPaymentSchema } from '../validators/payment.validator.js';

export class PaymentController {
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
   * Public webhook callback endpoint for payment gateways
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

      const isOwner = req.user?.id === payment.customerId;
      const isAdmin = req.user?.role.toLowerCase() === 'admin';

      if (!isOwner && !isAdmin) {
        res.status(403).json({ success: false, message: 'Forbidden: Access denied to this payment record' });
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
