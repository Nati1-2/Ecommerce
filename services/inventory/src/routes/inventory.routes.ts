import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  currentUser,
  requireAuth,
  requireRole,
  validateRequest,
} from '@ecom/common';
import * as inventoryController from '../controllers/inventory.controller';

const router = Router();

// GET /api/inventory/low-stock — must be before /:productId to avoid route conflict
router.get(
  '/low-stock',
  currentUser,
  requireAuth,
  requireRole('VENDOR', 'ADMIN'),
  inventoryController.getLowStockItems
);

// GET /api/inventory/movements/:productId
router.get(
  '/movements/:productId',
  validateRequest([
    param('productId').notEmpty().withMessage('Product ID is required'),
  ]),
  inventoryController.getStockMovements
);

// GET /api/inventory/:productId
router.get(
  '/:productId',
  validateRequest([
    param('productId').notEmpty().withMessage('Product ID is required'),
  ]),
  inventoryController.getInventory
);

// PUT /api/inventory/:productId/restock
router.put(
  '/:productId/restock',
  currentUser,
  requireAuth,
  requireRole('VENDOR', 'ADMIN'),
  validateRequest([
    param('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ]),
  inventoryController.restockProduct
);

// PUT /api/inventory/:productId/adjust
router.put(
  '/:productId/adjust',
  currentUser,
  requireAuth,
  requireRole('ADMIN'),
  validateRequest([
    param('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity')
      .isInt()
      .withMessage('Quantity must be an integer (positive or negative)'),
    body('reason')
      .notEmpty()
      .withMessage('Reason is required for manual adjustments'),
  ]),
  inventoryController.adjustStock
);

export { router as inventoryRoutes };
