import {
  AdminNotificationModel,
  CampaignModel,
  TemplateModel,
  NotificationLogItem,
  ChannelStatus,
  AutomationRule,
  NotificationStatsData,
  NotificationSettingsData,
} from "@/types/adminNotification";

let mockStats: NotificationStatsData = {
  totalSent: 1500000,
  totalGrowth: 14.5,
  delivered: 1420000,
  deliveryRate: 94.6,
  failed: 8000,
  openRate: 72,
  clickRate: 35,
};

let mockChannels: ChannelStatus[] = [
  { id: "ch_1", name: "Transactional SMTP Email", type: "Email", status: "Active", sentTotal: 850000, successRate: 99.2, iconName: "Mail" },
  { id: "ch_2", name: "Firebase Cloud Messaging (FCM)", type: "Push", status: "Active", sentTotal: 450000, successRate: 98.4, iconName: "Bell" },
  { id: "ch_3", name: "Twilio SMS Gateway", type: "SMS", status: "Active", sentTotal: 120000, successRate: 99.8, iconName: "Smartphone" },
  { id: "ch_4", name: "Socket.IO Realtime Bus", type: "Realtime", status: "Active", sentTotal: 80000, successRate: 100.0, iconName: "Zap" },
];

let mockCampaigns: CampaignModel[] = [
  { id: "camp_501", name: "Summer Electronics Mega Sale", channel: "Multi-Channel", audience: "All Verified Customers", status: "Running", sentCount: 450000, openRate: 78.4, clickRate: 38.2, createdAt: "2026-07-15" },
  { id: "camp_502", name: "Inactive Sellers Reactivation", channel: "Email", audience: "Inactive Vendors (>30 Days)", status: "Scheduled", sentCount: 0, openRate: 0, clickRate: 0, createdAt: "2026-07-18" },
  { id: "camp_503", name: "Flash Cyber Monday Promo", channel: "Push", audience: "Mobile App Users", status: "Completed", sentCount: 320000, openRate: 82.1, clickRate: 41.5, createdAt: "2026-07-10" },
];

let mockTemplates: TemplateModel[] = [
  { id: "tpl_101", name: "Welcome Customer Email", type: "Onboarding", channel: "Email", subject: "Welcome to Marketplace, {{username}}!", content: "<p>Hello {{username}}, welcome aboard!</p>", updatedAt: "2026-07-01" },
  { id: "tpl_102", name: "Order Confirmation Receipt", type: "Transactional", channel: "Email", subject: "Order #{{order_id}} Confirmed", content: "<h3>Your order {{order_id}} has been received!</h3>", updatedAt: "2026-07-05" },
  { id: "tpl_103", name: "FCM Push Dispatch Alert", type: "Order Update", channel: "Push", subject: "Package Shipped!", content: "Your item from {{vendor_name}} is on the way!", updatedAt: "2026-07-12" },
];

let mockLogs: NotificationLogItem[] = [
  { id: "log_901", recipientName: "Sarah Jenkins", recipientEmail: "sarah.j@techcorp.com", channel: "Email", messageSnippet: "Order #ord_90101 has been dispatched via FedEx", status: "Delivered", sentTime: "2026-07-18 14:23 UTC", deliveredTime: "2026-07-18 14:24 UTC" },
  { id: "log_902", recipientName: "Michael Chen", recipientEmail: "mchen@horizon.dev", channel: "Push", messageSnippet: "Payment of $699.00 authorized via Apple Pay", status: "Delivered", sentTime: "2026-07-19 02:10 UTC", deliveredTime: "2026-07-19 02:10 UTC" },
  { id: "log_903", recipientName: "Marcus Sterling", recipientEmail: "marcus@luminavision.com", channel: "SMS", messageSnippet: "Verification code: 890123 for Marketplace login", status: "Delivered", sentTime: "2026-07-19 00:45 UTC", deliveredTime: "2026-07-19 00:45 UTC" },
  { id: "log_904", recipientName: "Bot Account 902", recipientEmail: "cheap_deals@spambot.net", channel: "Email", messageSnippet: "Account warning issued for spam review attempt", status: "Failed", sentTime: "2026-07-19 03:00 UTC", deliveredTime: "N/A (Bounced)" },
];

let mockAutomationRules: AutomationRule[] = [
  { id: "rule_1", name: "Order Receipt Dispatch", triggerEvent: "ORDER_CREATED", actionChannel: "Email", templateName: "Order Confirmation Receipt", status: "Active" },
  { id: "rule_2", name: "Shipping FCM Notification", triggerEvent: "ORDER_SHIPPED", actionChannel: "Push", templateName: "FCM Push Dispatch Alert", status: "Active" },
  { id: "rule_3", name: "Vendor Store Approved Alert", triggerEvent: "VENDOR_APPROVED", actionChannel: "Email", templateName: "Vendor Store Approval", status: "Active" },
];

let mockSettings: NotificationSettingsData = {
  smtpHost: "smtp.sendgrid.net",
  smtpPort: 587,
  firebaseServerKey: "AAAA-FCM-SERVER-KEY-PROD-90192",
  twilioAccountSid: "AC-TWILIO-SID-890192840",
  rateLimitPerMin: 5000,
  retryAttempts: 3,
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminNotificationApi = {
  getStats: async (): Promise<NotificationStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getChannels: async (): Promise<ChannelStatus[]> => {
    await delay(200);
    return [...mockChannels];
  },

  sendNotification: async (payload: any): Promise<boolean> => {
    await delay(400);
    return true;
  },

  getCampaigns: async (): Promise<CampaignModel[]> => {
    await delay(250);
    return [...mockCampaigns];
  },

  createCampaign: async (payload: any): Promise<CampaignModel> => {
    await delay(350);
    const newCamp: CampaignModel = {
      id: `camp_${Math.floor(Math.random() * 1000)}`,
      name: payload.name || "New Marketing Campaign",
      channel: payload.channel || "Multi-Channel",
      audience: payload.audience || "All Verified Customers",
      status: "Running",
      sentCount: 15000,
      openRate: 65.0,
      clickRate: 30.0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockCampaigns.unshift(newCamp);
    return newCamp;
  },

  getTemplates: async (): Promise<TemplateModel[]> => {
    await delay(200);
    return [...mockTemplates];
  },

  createTemplate: async (payload: any): Promise<TemplateModel> => {
    await delay(300);
    const newTpl: TemplateModel = {
      id: `tpl_${Math.floor(Math.random() * 1000)}`,
      name: payload.name,
      type: payload.type,
      channel: payload.channel,
      subject: payload.subject,
      content: payload.content,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    mockTemplates.unshift(newTpl);
    return newTpl;
  },

  getLogs: async (): Promise<NotificationLogItem[]> => {
    await delay(250);
    return [...mockLogs];
  },

  getAutomationRules: async (): Promise<AutomationRule[]> => {
    await delay(200);
    return [...mockAutomationRules];
  },

  getSettings: async (): Promise<NotificationSettingsData> => {
    await delay(200);
    return { ...mockSettings };
  },

  updateSettings: async (settings: NotificationSettingsData): Promise<boolean> => {
    await delay(300);
    mockSettings = { ...settings };
    return true;
  },
};
