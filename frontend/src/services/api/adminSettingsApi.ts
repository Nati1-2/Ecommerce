import {
  SystemSettingsState,
  IntegrationItem,
  FeatureFlagItem,
  MicroserviceHealthItem,
  SystemBackupItem,
} from "@/types/adminSettings";

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

let mockSettingsFallback: SystemSettingsState = {
  general: {
    platformName: "Nati Multi-Vendor Marketplace Engine",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    websiteUrl: "https://natistore.com",
    defaultLanguage: "English (US)",
    timezone: "UTC-8 (Pacific Time)",
    currency: "USD ($)",
    dateFormat: "YYYY-MM-DD",
  },
  users: {
    userRegistration: true,
    emailVerification: true,
    phoneVerification: false,
    minPasswordLength: 8,
    allowAccountDeletion: true,
  },
  vendors: {
    vendorRegistration: true,
    vendorApprovalRequired: true,
    defaultCommissionPct: 15,
    vendorKYCRequired: true,
    maxProductsPerVendor: 10000,
  },
  products: {
    requireAdminApproval: true,
    enableVariants: true,
    enableDigitalProducts: true,
    enableReviews: true,
    lowStockThreshold: 5,
  },
  orders: {
    autoConfirmation: true,
    allowCancellation: true,
    orderTimeoutHours: 24,
    returnPolicyDays: 30,
    requireRefundApproval: true,
  },
  payments: {
    stripeEnabled: true,
    stripePublicKey: "pk_test_51ThDDICdX0hvCWhczONjNi3TCevUCN7vYmjW5h5KaNeNiyjAAkIG3KL1ZkqSOauu8wIRirZmCuETnr6Xw65tK34T00DDtz8A5O",
    stripeSecretKey: "sk_test_••••••••••••••••••••••••",
    paypalEnabled: true,
    bankTransferEnabled: true,
    maxTransactionLimit: 50000,
  },
  shipping: {
    fedexEnabled: true,
    upsEnabled: true,
    dhlEnabled: true,
    flatRateFee: 15.0,
    freeShippingThreshold: 100.0,
  },
  notifications: {
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    firebaseServerKey: "AAAA-FCM-SERVER-KEY-PROD-90192",
    twilioSid: "AC-TWILIO-SID-890192840",
    maxRatePerMin: 5000,
  },
  security: {
    twoFactorRequired: true,
    sessionTimeoutMins: 30,
    maxLoginAttempts: 5,
    ipWhitelist: ["192.168.1.1", "10.0.0.1"],
    securityScore: 95,
  },
};

let mockIntegrations: IntegrationItem[] = [
  { id: "int_1", name: "Stripe Connect Gateway", description: "Payment processing & seller payouts", iconName: "CreditCard", status: "Connected", configured: true },
  { id: "int_2", name: "MongoDB Database Cluster", description: "Primary database document store", iconName: "Server", status: "Connected", configured: true },
  { id: "int_3", name: "Firebase Cloud Messaging", description: "Push notification dispatch", iconName: "Bell", status: "Connected", configured: true },
];

let mockFeatureFlags: FeatureFlagItem[] = [
  { id: "ff_1", name: "AI Recommendations Engine", description: "ML-driven personalized product recommendations", enabled: true, environment: "Production" },
  { id: "ff_2", name: "Live Customer Chat Support", description: "Realtime WebSocket chat widget on product pages", enabled: true, environment: "Production" },
];

let mockHealth: MicroserviceHealthItem[] = [
  { id: "srv_1", name: "API Gateway Cluster", service: "Gateway Service", status: "Healthy", uptime: "99.99%", latencyMs: 12 },
  { id: "srv_2", name: "Auth & IAM Service", service: "Authentication Service", status: "Healthy", uptime: "99.98%", latencyMs: 18 },
  { id: "srv_3", name: "MongoDB Cluster", service: "Database Layer", status: "Healthy", uptime: "99.99%", latencyMs: 5 },
];

let mockBackups: SystemBackupItem[] = [
  { id: "bak_101", fileName: "backup_prod_db_20260807_0600.sql.gz", sizeGb: 42.5, createdAt: "2026-08-07 06:00 UTC", status: "Completed" },
];

export const adminSettingsApi = {
  getSettings: async (): Promise<SystemSettingsState> => {
    try {
      const data = await apiFetch<{ settings: any }>("/api/admin/settings");
      if (data.settings) {
        return {
          ...mockSettingsFallback,
          general: {
            ...mockSettingsFallback.general,
            platformName: data.settings.general?.siteName || mockSettingsFallback.general.platformName,
          },
        };
      }
      return mockSettingsFallback;
    } catch {
      return mockSettingsFallback;
    }
  },

  updateSettings: async (section: keyof SystemSettingsState, payload: any): Promise<boolean> => {
    await apiFetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({ [section]: payload }),
    });
    return true;
  },

  getIntegrations: async (): Promise<IntegrationItem[]> => {
    return [...mockIntegrations];
  },

  toggleIntegration: async (id: string, status: "Connected" | "Disconnected"): Promise<boolean> => {
    const item = mockIntegrations.find((i) => i.id === id);
    if (item) item.status = status;
    return true;
  },

  getFeatureFlags: async (): Promise<FeatureFlagItem[]> => {
    return [...mockFeatureFlags];
  },

  toggleFeatureFlag: async (id: string, enabled: boolean): Promise<boolean> => {
    const flag = mockFeatureFlags.find((f) => f.id === id);
    if (flag) flag.enabled = enabled;
    return true;
  },

  getSystemHealth: async (): Promise<MicroserviceHealthItem[]> => {
    return [...mockHealth];
  },

  getBackups: async (): Promise<SystemBackupItem[]> => {
    return [...mockBackups];
  },

  clearCache: async (): Promise<boolean> => {
    return true;
  },

  createBackup: async (): Promise<SystemBackupItem> => {
    const newBak: SystemBackupItem = {
      id: `bak_${Math.floor(Math.random() * 1000)}`,
      fileName: `backup_prod_db_${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 12)}.sql.gz`,
      sizeGb: 43.1,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC",
      status: "Completed",
    };
    mockBackups.unshift(newBak);
    return newBak;
  },
};
