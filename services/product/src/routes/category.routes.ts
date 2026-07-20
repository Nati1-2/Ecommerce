import { Router } from 'express';
import { body } from 'express-validator';
import { currentUser, requireAuth, requireRole, validateRequest } from '@ecom/common';
import * as categoryController from '../controllers/category.controller';

const router = Router();

// Public: list categories
router.get('/', categoryController.listCategories);

// Protected: create category (ADMIN only)
router.post(
  '/',
  currentUser,
  requireAuth,
  requireRole('ADMIN'),
  validateRequest([
    body('name')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Name is required and must be at most 100 characters'),
    body('slug')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug must be lowercase alphanumeric with hyphens'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Description must be at most 500 characters'),
    body('image')
      .optional()
      .isString()
      .withMessage('Image must be a valid URL string'),
    body('parentCategory')
      .optional()
      .isMongoId()
      .withMessage('Parent category must be a valid ID'),
  ]),
  categoryController.createCategory
);

export { router as categoryRoutes };
