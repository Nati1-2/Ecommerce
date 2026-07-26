import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { NotificationService } from '../services/notification.service.js';
import { sendDirectNotificationSchema } from '../validators/notification.validator.js';

export class NotificationController {
  /**
   * Retrieves notifications for logged in user
   */
  public static async getMyNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const notifications = await NotificationService.getNotificationsByRecipient(req.user.id);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks a notification as read
   */
  public static async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id as string, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin direct notification dispatch
   */
  public static async sendDirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = sendDirectNotificationSchema.parse(req.body);
      const notification = await NotificationService.createNotification(validated);

      res.status(201).json({
        success: true,
        message: 'Notification sent successfully',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Paginated list of all system notifications (Admin)
   */
  public static async getAllNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await NotificationService.getAllNotifications(page, limit);

      res.status(200).json({
        success: true,
        data: result.notifications,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
