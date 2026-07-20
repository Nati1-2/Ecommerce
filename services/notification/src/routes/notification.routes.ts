import { Router } from 'express';
import { query, body, param } from 'express-validator';
import { currentUser, requireAuth, requireRole, validateRequest } from '@ecom/common';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  sendTestNotification,
} from '../controllers/notification.controller';

const router = Router();

// All notification routes require authentication
router.use(currentUser, requireAuth);

/**
 * GET /api/notifications
 * Get authenticated user's notifications with pagination.
 */
router.get(
  '/',
  validateRequest([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit must be between 1 and 100'),
  ]),
  getUserNotifications
);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 * NOTE: This must come before /:id/read to avoid route conflict.
 */
router.patch('/read-all', markAllAsRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
router.patch(
  '/:id/read',
  validateRequest([
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID'),
  ]),
  markAsRead
);

/**
 * POST /api/notifications/test
 * Send a test notification (admin only).
 */
router.post(
  '/test',
  requireRole('ADMIN'),
  validateRequest([
    body('userId')
      .notEmpty()
      .isString()
      .withMessage('userId is required'),
    body('title')
      .optional()
      .isString()
      .withMessage('title must be a string'),
    body('message')
      .optional()
      .isString()
      .withMessage('message must be a string'),
    body('type')
      .optional()
      .isString()
      .withMessage('type must be a string'),
  ]),
  sendTestNotification
);

export { router as notificationRoutes };
