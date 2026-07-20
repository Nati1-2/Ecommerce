import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  currentUser,
  requireAuth,
  requireRole,
  validateRequest,
} from '@ecom/common';
import {
  createPaymentIntentHandler,
  confirmPaymentHandler,
  webhookHandler,
  getTransactionsHandler,
  getTransactionByIdHandler,
  refundHandler,
} from '../controllers/payment.controller';

const router = Router();

// ============================================
// Webhook route MUST come BEFORE json body parser
// (handled in app.ts with raw body)
// ============================================

/**
 * POST /api/payments/webhook
 * Stripe webhook handler - no auth, raw body, signature verification
 */
router.post('/webhook', webhookHandler);

// ============================================
// All remaining routes require currentUser
// ============================================
router.use(currentUser);

/**
 * POST /api/payments/create-intent
 * Create a Stripe PaymentIntent
 */
router.post(
  '/create-intent',
  requireAuth,
  validateRequest([
    body('orderId')
      .isString()
      .notEmpty()
      .withMessage('Order ID is required'),
    body('amount')
      .isFloat({ min: 0.50 })
      .withMessage('Amount must be at least 0.50'),
    body('currency')
      .optional()
      .isString()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be a 3-letter ISO code'),
  ]),
  createPaymentIntentHandler
);

/**
 * POST /api/payments/confirm
 * Confirm payment after client-side Stripe.js completion
 */
router.post(
  '/confirm',
  requireAuth,
  validateRequest([
    body('paymentIntentId')
      .isString()
      .notEmpty()
      .withMessage('Payment intent ID is required'),
  ]),
  confirmPaymentHandler
);

/**
 * GET /api/payments/transactions
 * Get user's transaction history
 */
router.get('/transactions', requireAuth, getTransactionsHandler);

/**
 * GET /api/payments/transactions/:id
 * Get single transaction details
 */
router.get(
  '/transactions/:id',
  requireAuth,
  validateRequest([
    param('id').isMongoId().withMessage('Invalid transaction ID'),
  ]),
  getTransactionByIdHandler
);

/**
 * POST /api/payments/refund
 * Process refund (admin only)
 */
router.post(
  '/refund',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest([
    body('orderId')
      .isString()
      .notEmpty()
      .withMessage('Order ID is required'),
    body('amount')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Refund amount must be positive'),
    body('reason')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters'),
  ]),
  refundHandler
);

export { router as paymentRouter };
