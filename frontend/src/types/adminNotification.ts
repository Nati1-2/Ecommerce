export type NotificationChannel = "Email" | "Push" | "SMS" | "Realtime";

export type NotificationStatus = "Sent" | "Delivered" | "Failed" | "Pending" | "Scheduled" | "Draft";

export interface AdminNotificationModel {
  id: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  audience: string;
  status: NotificationStatus;
  scheduledAt?: string;
  createdAt: string;
}

export interface CampaignModel {
  id: string;
  name: string;
  channel: NotificationChannel | "Multi-Channel";
  audience: string;
  status: "Draft" | "Scheduled" | "Running" | "Completed";
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

export interface TemplateModel {
  id: string;
  name: string;
  type: string;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  updatedAt: string;
}

export interface NotificationLogItem {
  id: string;
  recipientName: string;
  recipientEmail: string;
  channel: NotificationChannel;
  messageSnippet: string;
  status: NotificationStatus;
  sentTime: string;
  deliveredTime: string;
}

export interface ChannelStatus {
  id: string;
  name: string;
  type: NotificationChannel;
  status: "Active" | "Degraded" | "Disabled";
  sentTotal: number;
  successRate: number;
  iconName: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  actionChannel: NotificationChannel;
  templateName: string;
  status: "Active" | "Paused";
}

export interface NotificationStatsData {
  totalSent: number;
  totalGrowth: number;
  delivered: number;
  deliveryRate: number;
  failed: number;
  openRate: number;
  clickRate: number;
}

export interface NotificationSettingsData {
  smtpHost: string;
  smtpPort: number;
  firebaseServerKey: string;
  twilioAccountSid: string;
  rateLimitPerMin: number;
  retryAttempts: number;
}
