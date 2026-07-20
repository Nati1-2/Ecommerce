import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { emitToUser } from '../services/socket.service';
import { BadRequestError } from '@ecom/common';

/**
 * GET /api/notifications
 * Get the authenticated user's notification history with pagination.
 */
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 20;

  const result = await notificationService.getUserNotifications(userId, page, limit);

  res.status(200).json({
    success: true,
    data: result,
  });
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const { id } = req.params;

  const notification = await notificationService.markAsRead(id, userId);
  if (!notification) {
    throw new BadRequestError('Notification not found or does not belong to user');
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read for the authenticated user.
 */
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const count = await notificationService.markAllAsRead(userId);

  res.status(200).json({
    success: true,
    data: { markedCount: count },
  });
};

/**
 * POST /api/notifications/test
 * Send a test notification (admin only).
 */
export const sendTestNotification = async (req: Request, res: Response): Promise<void> => {
  const { userId, title, message, type } = req.body as {
    userId: string;
    title: string;
    message: string;
    type: string;
  };

  const notification = await notificationService.createAndEmit({
    userId,
    type: type || 'test',
    title: title || 'Test Notification',
    message: message || 'This is a test notification from the admin panel.',
    data: { isTest: true },
  });

  const emitted = emitToUser(userId, {
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: { isTest: true },
    timestamp: notification.createdAt.toISOString(),
  });

  res.status(200).json({
    success: true,
    data: {
      notification,
      realTimeDelivered: emitted,
    },
  });
};
