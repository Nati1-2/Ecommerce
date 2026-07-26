import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'ORDER_CONFIRMATION'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ORDER_SHIPPED'
  | 'LOW_STOCK_ALERT'
  | 'SYSTEM_NOTICE';

export type NotificationChannel = 'EMAIL' | 'IN_APP' | 'SMS';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface INotification extends Document {
  notificationId: string;
  recipientId: string;
  recipientEmail?: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  subject: string;
  body: string;
  metadata?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  notificationId: { type: String, required: true, unique: true, index: true },
  recipientId: { type: String, required: true, index: true },
  recipientEmail: { type: String },
  type: {
    type: String,
    enum: [
      'ORDER_CONFIRMATION',
      'PAYMENT_SUCCESS',
      'PAYMENT_FAILED',
      'ORDER_SHIPPED',
      'LOW_STOCK_ALERT',
      'SYSTEM_NOTICE'
    ],
    required: true
  },
  channel: {
    type: String,
    enum: ['EMAIL', 'IN_APP', 'SMS'],
    default: 'IN_APP',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'SENT',
    required: true
  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
