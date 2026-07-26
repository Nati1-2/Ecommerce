import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().optional().default('USD'),
  provider: z.enum(['STRIPE', 'PAYPAL', 'MOCK']).optional().default('MOCK'),
  idempotencyKey: z.string().optional()
});

export const webhookPayloadSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['COMPLETED', 'FAILED']),
  failureReason: z.string().optional()
});

export const refundPaymentSchema = z.object({
  reason: z.string().min(1, 'Refund reason is required')
});
