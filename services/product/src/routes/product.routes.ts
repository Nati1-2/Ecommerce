import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { currentUser, requireAuth, requireRole, validateRequest } from '@ecom/common';
import * as productController from '../controllers/product.controller';

const router = Router();

// ============================================
// Public Routes
// ============================================

router.get(
  '/',
  validateRequest([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
    query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('minRating must be between 0 and 5'),
    query('sortBy').optional().isIn(['createdAt', 'price', 'rating', 'name']).withMessage('Invalid sortBy field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
    query('search').optional().isString().trim(),
    query('brand').optional().isString().trim(),
    query('sellerId').optional().isString().trim(),
  ]),
  productController.listProducts
);

router.get(
  '/:id',
  validateRequest([
    param('id').isMongoId().withMessage('Invalid product ID'),
  ]),
  productController.getProduct
);

// ============================================
// Protected Routes (VENDOR / ADMIN)
// ============================================

router.post(
  '/',
  currentUser,
  requireAuth,
  requireRole('VENDOR', 'ADMIN'),
  validateRequest([
    body('name')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Name is required and must be at most 200 characters'),
    body('description')
      .notEmpty()
      .isString()
      .withMessage('Description is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    body('compareAtPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Compare-at price must be a non-negative number'),
    body('category')
      .notEmpty()
      .isString()
      .trim()
      .withMessage('Category is required'),
    body('subcategory')
      .optional()
      .isString()
      .trim(),
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),
    body('images.*')
      .optional()
      .isString()
      .withMessage('Each image must be a string URL'),
    body('variants')
      .optional()
      .isArray()
      .withMessage('Variants must be an array'),
    body('variants.*.name')
      .optional()
      .isString()
      .withMessage('Variant name must be a string'),
    body('variants.*.options')
      .optional()
      .isArray()
      .withMessage('Variant options must be an array'),
    body('variants.*.priceModifier')
      .optional()
      .isFloat()
      .withMessage('Price modifier must be a number'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('brand')
      .optional()
      .isString()
      .trim(),
    body('sku')
      .optional()
      .isString()
      .trim(),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a non-negative number'),
    body('dimensions')
      .optional()
      .isObject()
      .withMessage('Dimensions must be an object'),
    body('dimensions.length')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Dimension length must be non-negative'),
    body('dimensions.width')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Dimension width must be non-negative'),
    body('dimensions.height')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Dimension height must be non-negative'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ]),
  productController.createProduct
);

router.put(
  '/:id',
  currentUser,
  requireAuth,
  requireRole('VENDOR', 'ADMIN'),
  validateRequest([
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Name must be at most 200 characters'),
    body('description')
      .optional()
      .isString(),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    body('compareAtPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Compare-at price must be non-negative'),
    body('category')
      .optional()
      .isString()
      .trim(),
    body('subcategory')
      .optional()
      .isString()
      .trim(),
    body('images')
      .optional()
      .isArray(),
    body('variants')
      .optional()
      .isArray(),
    body('tags')
      .optional()
      .isArray(),
    body('brand')
      .optional()
      .isString()
      .trim(),
    body('sku')
      .optional()
      .isString()
      .trim(),
    body('weight')
      .optional()
      .isFloat({ min: 0 }),
    body('dimensions')
      .optional()
      .isObject(),
    body('stock')
      .optional()
      .isInt({ min: 0 }),
    body('isActive')
      .optional()
      .isBoolean(),
  ]),
  productController.updateProduct
);

router.delete(
  '/:id',
  currentUser,
  requireAuth,
  requireRole('VENDOR', 'ADMIN'),
  validateRequest([
    param('id').isMongoId().withMessage('Invalid product ID'),
  ]),
  productController.deleteProduct
);

export { router as productRoutes };
