import { Notification, INotification, NotificationType, NotificationChannel } from '../models/Notification.js';
import { logger } from '../utils/logger.js';

export interface CreateNotificationPayload {
  recipientId: string;
  recipientEmail?: string;
  type: NotificationType;
  channel?: NotificationChannel;
  subject: string;
  body: string;
  metadata?: any;
}

export class NotificationService {
  /**
   * Generates a unique notification ID (e.g. NOTIF-20260726-3841)
   */
  private static generateNotificationId(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `NOTIF-${dateStr}-${randomSuffix}`;
  }

  /**
   * Creates a notification record and dispatches mock email/in-app alert
   */
  public static async createNotification(payload: CreateNotificationPayload): Promise<INotification> {
    const { recipientId, recipientEmail, type, channel = 'IN_APP', subject, body, metadata } = payload;
    const notificationId = this.generateNotificationId();

    const notification = await Notification.create({
      notificationId,
      recipientId,
      recipientEmail,
      type,
      channel,
      status: 'SENT',
      subject,
      body,
      metadata,
      isRead: false
    });

    logger.info(`[${channel}] Notification sent to ${recipientId} (${type}): "${subject}"`);
    return notification;
  }

  /**
   * Fetches notifications for a specific user
   */
  public static async getNotificationsByRecipient(recipientId: string): Promise<INotification[]> {
    return Notification.find({ recipientId }).sort({ createdAt: -1 });
  }

  /**
   * Marks a notification as read
   */
  public static async markAsRead(notificationId: string, recipientId: string): Promise<INotification> {
    const notification = await Notification.findOne({ notificationId });
    if (!notification) {
      throw new Error(`Notification not found: ${notificationId}`);
    }

    if (notification.recipientId !== recipientId && recipientId !== 'admin') {
      throw new Error('Forbidden: You cannot modify notifications belonging to another user');
    }

    notification.isRead = true;
    await notification.save();

    logger.info(`Notification ${notificationId} marked as READ by ${recipientId}`);
    return notification;
  }

  /**
   * Returns a paginated list of all system notifications (Admin)
   */
  public static async getAllNotifications(page = 1, limit = 20): Promise<{ notifications: INotification[]; total: number }> {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments()
    ]);
    return { notifications, total };
  }
}
