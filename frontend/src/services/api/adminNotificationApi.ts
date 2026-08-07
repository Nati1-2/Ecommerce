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

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

let mockChannels: ChannelStatus[] = [
  { id: "ch_1", name: "Transactional SMTP Email", type: "Email", status: "Active", sentTotal: 850000, successRate: 99.2, iconName: "Mail" },
  { id: "ch_2", name: "Firebase Cloud Messaging (FCM)", type: "Push", status: "Active", sentTotal: 450000, successRate: 98.4, iconName: "Bell" },
  { id: "ch_3", name: "Twilio SMS Gateway", type: "SMS", status: "Active", sentTotal: 120000, successRate: 99.8, iconName: "Smartphone" },
  { id: "ch_4", name: "Socket.IO Realtime Bus", type: "Realtime", status: "Active", sentTotal: 80000, successRate: 100.0, iconName: "Zap" },
];

let mockCampaigns: CampaignModel[] = [
  { id: "camp_501", name: "Summer Electronics Mega Sale", channel: "Multi-Channel", audience: "All Verified Customers", status: "Running", sentCount: 450000, openRate: 78.4, clickRate: 38.2, createdAt: "2026-07-15" },
  { id: "camp_502", name: "Inactive Sellers Reactivation", channel: "Email", audience: "Inactive Vendors (>30 Days)", status: "Scheduled", sentCount: 0, openRate: 0, clickRate: 0, createdAt: "2026-07-18" },
];

let mockTemplates: TemplateModel[] = [
  { id: "tpl_101", name: "Welcome Customer Email", type: "Onboarding", channel: "Email", subject: "Welcome to Marketplace, {{username}}!", content: "<p>Hello {{username}}, welcome aboard!</p>", updatedAt: "2026-07-01" },
  { id: "tpl_102", name: "Order Confirmation Receipt", type: "Transactional", channel: "Email", subject: "Order #{{order_id}} Confirmed", content: "<h3>Your order {{order_id}} has been received!</h3>", updatedAt: "2026-07-05" },
];

let mockLogs: NotificationLogItem[] = [
  { id: "log_901", recipientName: "Sarah Connor", recipientEmail: "sarah.c@gmail.com", channel: "Email", messageSnippet: "Order #ord_90101 has been dispatched via FedEx", status: "Delivered", sentTime: "2026-08-06 14:23 UTC", deliveredTime: "2026-08-06 14:24 UTC" },
  { id: "log_902", recipientName: "John Connor", recipientEmail: "john.c@gmail.com", channel: "Push", messageSnippet: "Payment authorized via Stripe", status: "Delivered", sentTime: "2026-08-06 02:10 UTC", deliveredTime: "2026-08-06 02:10 UTC" },
];

let mockAutomationRules: AutomationRule[] = [
  { id: "rule_1", name: "Order Receipt Dispatch", triggerEvent: "ORDER_CREATED", actionChannel: "Email", templateName: "Order Confirmation Receipt", status: "Active" },
  { id: "rule_2", name: "Shipping FCM Notification", triggerEvent: "ORDER_SHIPPED", actionChannel: "Push", templateName: "FCM Push Dispatch Alert", status: "Active" },
];

let mockSettings: NotificationSettingsData = {
  smtpHost: "smtp.sendgrid.net",
  smtpPort: 587,
  firebaseServerKey: "AAAA-FCM-SERVER-KEY-PROD-90192",
  twilioAccountSid: "AC-TWILIO-SID-890192840",
  rateLimitPerMin: 5000,
  retryAttempts: 3,
};

export const adminNotificationApi = {
  getStats: async (): Promise<NotificationStatsData> => {
    try {
      const data = await apiFetch<{ notifications: any[] }>("/api/admin/notifications");
      const list = data.notifications || [];
      return {
        totalSent: list.length,
        totalGrowth: 0,
        delivered: list.length,
        deliveryRate: 100,
        failed: 0,
        openRate: 0,
        clickRate: 0,
      };
    } catch {
      return {
        totalSent: 0,
        totalGrowth: 0,
        delivered: 0,
        deliveryRate: 0,
        failed: 0,
        openRate: 0,
        clickRate: 0,
      };
    }
  },

  getChannels: async (): Promise<ChannelStatus[]> => {
    return [...mockChannels];
  },

  sendNotification: async (payload: any): Promise<boolean> => {
    await apiFetch("/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return true;
  },

  getCampaigns: async (): Promise<CampaignModel[]> => {
    return [...mockCampaigns];
  },

  createCampaign: async (payload: any): Promise<CampaignModel> => {
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
    return [...mockTemplates];
  },

  createTemplate: async (payload: any): Promise<TemplateModel> => {
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
    return [...mockLogs];
  },

  getAutomationRules: async (): Promise<AutomationRule[]> => {
    return [...mockAutomationRules];
  },

  getSettings: async (): Promise<NotificationSettingsData> => {
    return { ...mockSettings };
  },

  updateSettings: async (settings: NotificationSettingsData): Promise<boolean> => {
    mockSettings = { ...settings };
    return true;
  },
};
