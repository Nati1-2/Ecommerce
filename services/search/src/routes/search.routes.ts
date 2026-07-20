import { Router } from 'express';
import { query } from 'express-validator';
import { currentUser, requireAuth, requireRole, validateRequest } from '@ecom/common';
import { searchProducts, autocomplete, reindex } from '../controllers/search.controller';

const router = Router();

/**
 * GET /api/search/products
 * Full-text search with optional filtering, sorting, and pagination.
 */
router.get(
  '/products',
  validateRequest([
    query('q').optional().isString().withMessage('q must be a string'),
    query('category').optional().isString().withMessage('category must be a string'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('minPrice must be a non-negative number'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('maxPrice must be a non-negative number'),
    query('sort')
      .optional()
      .isIn(['price_asc', 'price_desc', 'rating_desc', 'newest'])
      .withMessage('sort must be one of: price_asc, price_desc, rating_desc, newest'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit must be between 1 and 100'),
  ]),
  searchProducts
);

/**
 * GET /api/search/autocomplete
 * Autocomplete suggestions based on partial query.
 */
router.get(
  '/autocomplete',
  validateRequest([
    query('q')
      .notEmpty()
      .isString()
      .withMessage('q is required and must be a string'),
  ]),
  autocomplete
);

/**
 * POST /api/search/reindex
 * Trigger full reindex — restricted to ADMIN users.
 */
router.post(
  '/reindex',
  currentUser,
  requireAuth,
  requireRole('ADMIN'),
  reindex
);

export { router as searchRoutes };
