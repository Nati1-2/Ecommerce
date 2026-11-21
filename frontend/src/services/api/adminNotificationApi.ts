import type {
  CampaignModel, TemplateModel, NotificationLogItem, ChannelStatus,
  AutomationRule, NotificationStatsData, NotificationSettingsData,
} from "@/types/adminNotification";

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function getNotifications(): Promise<Array<{ id: string; title: string; message: string }>> {
  const data = await apiFetch<{ notifications: Array<{ id: string; title: string; message: string }> }>(
    "/api/admin/notifications"
  );
  return data.notifications;
}

function unsupported(): never {
  throw new Error("This notification feature is not connected to a persistent service.");
}

export const adminNotificationApi = {
  getStats: async (): Promise<NotificationStatsData> => {
    const notifications = await getNotifications();
    return {
      totalSent: notifications.length, totalGrowth: 0, delivered: 0,
      deliveryRate: 0, failed: 0, openRate: 0, clickRate: 0,
    };
  },
  getChannels: async (): Promise<ChannelStatus[]> => [],
  sendNotification: async (payload: unknown): Promise<boolean> => {
    await apiFetch("/api/admin/notifications", { method: "POST", body: JSON.stringify(payload) });
    return true;
  },
  getCampaigns: async (): Promise<CampaignModel[]> => [],
  createCampaign: async (_payload: unknown): Promise<CampaignModel> => unsupported(),
  getTemplates: async (): Promise<TemplateModel[]> => [],
  createTemplate: async (_payload: unknown): Promise<TemplateModel> => unsupported(),
  getLogs: async (): Promise<NotificationLogItem[]> => [],
  getAutomationRules: async (): Promise<AutomationRule[]> => [],
  getSettings: async (): Promise<NotificationSettingsData> => unsupported(),
  updateSettings: async (_settings: NotificationSettingsData): Promise<boolean> => unsupported(),
};
