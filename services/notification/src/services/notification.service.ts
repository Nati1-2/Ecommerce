import { createLogger } from '@ecom/common';
import { Notification, INotification } from '../models/notification.model';
import { emitToUser, NotificationPayload } from './socket.service';
import { sendEmail } from './email.service';

const logger = createLogger('notification-service');

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  /**
   * Creates a notification in the database and emits it in real-time via Socket.IO.
   */
  async createAndEmit(input: CreateNotificationInput): Promise<INotification> {
    // Persist to database
    const notification = await Notification.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data ? new Map(Object.entries(input.data)) : new Map(),
    });

    // Emit real-time notification
    const payload: NotificationPayload = {
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data,
      timestamp: notification.createdAt.toISOString(),
    };

    emitToUser(input.userId, payload);

    logger.info('Notification created and emitted', {
      notificationId: notification.id,
      userId: input.userId,
      type: input.type,
    });

    return notification;
  }

  /**
   * Sends an email and creates a persisted notification + real-time push.
   */
  async sendEmailAndNotify(
    userEmail: string,
    emailSubject: string,
    emailHtml: string,
    notificationInput: CreateNotificationInput
  ): Promise<void> {
    // Send email (best-effort)
    await sendEmail({
      to: userEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    // Persist + real-time notify
    await this.createAndEmit(notificationInput);
  }

  /**
   * Get paginated notification history for a user.
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: INotification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<INotification[]>(),
      Notification.countDocuments({ userId }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.modifiedCount;
  }
}

export const notificationService = new NotificationService();
