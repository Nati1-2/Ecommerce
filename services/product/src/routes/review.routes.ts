import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { currentUser, requireAuth, requireRole, validateRequest } from '@ecom/common';
import * as reviewController from '../controllers/review.controller';

const router = Router();

// Public: get reviews for a product
router.get(
  '/:id/reviews',
  validateRequest([
    param('id').isMongoId().withMessage('Invalid product ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ]),
  reviewController.getProductReviews
);

// Protected: add a review (CUSTOMER only)
router.post(
  '/:id/reviews',
  currentUser,
  requireAuth,
  requireRole('CUSTOMER'),
  validateRequest([
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('title')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title must be at most 200 characters'),
    body('comment')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Comment must be at most 2000 characters'),
  ]),
  reviewController.addReview
);

export { router as reviewRoutes };
