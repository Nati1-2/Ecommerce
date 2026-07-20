import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  currentUser,
  requireAuth,
  requireRole,
  validateRequest,
} from '@ecom/common';
import {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderByIdHandler,
  cancelOrderHandler,
  updateOrderStatusHandler,
  getAllOrdersHandler,
  getVendorOrdersHandler,
} from '../controllers/order.controller';
import { OrderStatus } from '../models/order.model';

const router = Router();

// ============================================
// All routes require currentUser extraction
// ============================================
router.use(currentUser);

// ============================================
// Admin routes (must be defined BEFORE /:orderId)
// ============================================

/**
 * GET /api/orders/admin/all
 * Get all orders with optional filters (admin only)
 */
router.get('/admin/all', requireAuth, requireRole('ADMIN'), getAllOrdersHandler);

/**
 * GET /api/orders/vendor/orders
 * Get orders containing vendor's products
 */
router.get('/vendor/orders', requireAuth, requireRole('VENDOR'), getVendorOrdersHandler);

// ============================================
// Authenticated user routes
// ============================================

/**
 * POST /api/orders
 * Create a new order
 */
router.post(
  '/',
  requireAuth,
  validateRequest([
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items must be a non-empty array'),
    body('items.*.productId')
      .isString()
      .notEmpty()
      .withMessage('Product ID is required for each item'),
    body('items.*.name')
      .isString()
      .notEmpty()
      .withMessage('Product name is required for each item'),
    body('items.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.image')
      .isString()
      .notEmpty()
      .withMessage('Image is required for each item'),
    body('shippingAddress.street')
      .isString()
      .notEmpty()
      .withMessage('Street is required'),
    body('shippingAddress.city')
      .isString()
      .notEmpty()
      .withMessage('City is required'),
    body('shippingAddress.state')
      .isString()
      .notEmpty()
      .withMessage('State is required'),
    body('shippingAddress.zipCode')
      .isString()
      .notEmpty()
      .withMessage('Zip code is required'),
    body('shippingAddress.country')
      .isString()
      .notEmpty()
      .withMessage('Country is required'),
    body('totalAmount')
      .isFloat({ min: 0 })
      .withMessage('Total amount must be a non-negative number'),
    body('shippingCost')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Shipping cost must be a non-negative number'),
    body('tax')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Tax must be a non-negative number'),
    body('grandTotal')
      .isFloat({ min: 0 })
      .withMessage('Grand total must be a non-negative number'),
    body('notes')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
  ]),
  createOrderHandler
);

/**
 * GET /api/orders
 * Get authenticated user's order history with pagination
 */
router.get('/', requireAuth, getUserOrdersHandler);

/**
 * GET /api/orders/:orderId
 * Get order details (owner or admin)
 */
router.get(
  '/:orderId',
  requireAuth,
  validateRequest([
    param('orderId').isString().notEmpty().withMessage('Order ID is required'),
  ]),
  getOrderByIdHandler
);

/**
 * PUT /api/orders/:orderId/cancel
 * Cancel an order (owner only, PENDING or PAYMENT_PENDING)
 */
router.put(
  '/:orderId/cancel',
  requireAuth,
  validateRequest([
    param('orderId').isString().notEmpty().withMessage('Order ID is required'),
    body('cancelReason')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Cancel reason cannot exceed 500 characters'),
  ]),
  cancelOrderHandler
);

/**
 * PUT /api/orders/:orderId/status
 * Update order status (admin or vendor)
 */
router.put(
  '/:orderId/status',
  requireAuth,
  requireRole('ADMIN', 'VENDOR'),
  validateRequest([
    param('orderId').isString().notEmpty().withMessage('Order ID is required'),
    body('status')
      .isIn(Object.values(OrderStatus))
      .withMessage(`Status must be one of: ${Object.values(OrderStatus).join(', ')}`),
    body('trackingNumber')
      .optional()
      .isString()
      .withMessage('Tracking number must be a string'),
    body('estimatedDelivery')
      .optional()
      .isISO8601()
      .withMessage('Estimated delivery must be a valid ISO 8601 date'),
  ]),
  updateOrderStatusHandler
);

export { router as orderRouter };
