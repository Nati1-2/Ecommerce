import { Request, Response } from 'express';
import {
  createIntent,
  confirmPayment,
  handleWebhook,
  getUserTransactions,
  getTransactionById,
  processRefund,
} from '../services/payment.service';

/**
 * POST /api/payments/create-intent
 * Create a Stripe PaymentIntent
 */
export async function createPaymentIntentHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const { orderId, amount, currency } = req.body;

  const result = await createIntent({
    orderId,
    amount,
    userId,
    currency,
  });

  res.status(201).json({
    message: 'Payment intent created successfully',
    transaction: result.transaction,
    clientSecret: result.clientSecret,
  });
}

/**
 * POST /api/payments/confirm
 * Confirm payment after client-side completion
 */
export async function confirmPaymentHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const { paymentIntentId } = req.body;

  const transaction = await confirmPayment({
    paymentIntentId,
    userId,
  });

  res.status(200).json({
    message: 'Payment confirmation processed',
    transaction,
  });
}

/**
 * POST /api/payments/webhook
 * Stripe webhook handler (no auth, uses Stripe signature)
 */
export async function webhookHandler(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  const result = await handleWebhook(req.body as Buffer, signature);

  res.status(200).json(result);
}

/**
 * GET /api/payments/transactions
 * Get user's transaction history
 */
export async function getTransactionsHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  const result = await getUserTransactions(userId, page, limit);

  res.status(200).json(result);
}

/**
 * GET /api/payments/transactions/:id
 * Get transaction details
 */
export async function getTransactionByIdHandler(req: Request, res: Response): Promise<void> {
  const userId = req.currentUser!.id;
  const { id } = req.params;

  const transaction = await getTransactionById(id, userId);

  res.status(200).json({ transaction });
}

/**
 * POST /api/payments/refund
 * Process refund for an order (admin only)
 */
export async function refundHandler(req: Request, res: Response): Promise<void> {
  const { orderId, amount, reason } = req.body;

  const transaction = await processRefund({
    orderId,
    amount,
    reason,
  });

  res.status(200).json({
    message: 'Refund processed successfully',
    transaction,
  });
}
