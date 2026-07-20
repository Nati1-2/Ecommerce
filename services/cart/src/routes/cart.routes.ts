import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  currentUser,
  requireAuth,
  validateRequest,
} from '@ecom/common';
import * as cartController from '../controllers/cart.controller';

const router = Router();

// All cart routes require authentication
router.use(currentUser, requireAuth);

// GET /api/cart — get the authenticated user's cart
router.get('/', cartController.getCart);

// POST /api/cart/items — add an item to the cart
router.post(
  '/items',
  validateRequest([
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ]),
  cartController.addItem
);

// PUT /api/cart/items/:productId — update item quantity
router.put(
  '/items/:productId',
  validateRequest([
    param('productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
  ]),
  cartController.updateItemQuantity
);

// DELETE /api/cart/items/:productId — remove an item from the cart
router.delete(
  '/items/:productId',
  validateRequest([
    param('productId')
      .notEmpty()
      .withMessage('Product ID is required'),
  ]),
  cartController.removeItem
);

// DELETE /api/cart — clear the entire cart
router.delete('/', cartController.clearCart);

export { router as cartRoutes };
