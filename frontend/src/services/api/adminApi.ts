import {
  PlatformStats,
  SystemStatus,
  AdminVendor,
  AdminProduct,
  AdminOrder,
  AdminPayment,
  ActivityItem,
  MarketplaceHealthData,
  AdminAnalyticsData,
} from "@/types/admin";

// Helper: get auth token from localStorage
function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

// Helper: authenticated fetch with error handling
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

export const adminApi = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    const data = await apiFetch<{ stats: PlatformStats }>("/api/admin/stats");
    return data.stats;
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    const data = await apiFetch<{ status: SystemStatus }>("/api/admin/system-status");
    return data.status;
  },

  getMarketplaceHealth: async (): Promise<MarketplaceHealthData> => {
    const data = await apiFetch<{ health: MarketplaceHealthData }>("/api/admin/marketplace-health");
    return data.health;
  },

  getVendors: async (): Promise<AdminVendor[]> => {
    const data = await apiFetch<{ vendors: AdminVendor[] }>("/api/admin/vendors");
    return data.vendors;
  },

  getProducts: async (): Promise<AdminProduct[]> => {
    const data = await apiFetch<{ products: AdminProduct[] }>("/api/admin/products");
    return data.products;
  },

  getOrders: async (): Promise<AdminOrder[]> => {
    const data = await apiFetch<{ orders: AdminOrder[] }>("/api/admin/orders");
    return data.orders;
  },

  getPayments: async (): Promise<AdminPayment> => {
    const data = await apiFetch<{ payments: AdminPayment }>("/api/admin/payments");
    return data.payments;
  },

  getActivityLogs: async (): Promise<ActivityItem[]> => {
    const data = await apiFetch<{ activities: ActivityItem[] }>("/api/admin/activities");
    return data.activities;
  },

  getAnalytics: async (timeframe: string): Promise<AdminAnalyticsData> => {
    const data = await apiFetch<{ analytics: AdminAnalyticsData }>(`/api/admin/analytics?timeframe=${timeframe}`);
    return data.analytics;
  },

  approveVendor: async (id: string): Promise<boolean> => {
    const data = await apiFetch<{ success: boolean }>(`/api/admin/vendors/${id}/approve`, {
      method: "POST"
    });
    return data.success;
  },

  approveProduct: async (id: string): Promise<boolean> => {
    const data = await apiFetch<{ success: boolean }>(`/api/admin/products/${id}/approve`, {
      method: "POST"
    });
    return data.success;
  },

  broadcastAnnouncement: async (message: string): Promise<boolean> => {
    const data = await apiFetch<{ success: boolean }>("/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify({ message })
    });
    return data.success;
  },
};
