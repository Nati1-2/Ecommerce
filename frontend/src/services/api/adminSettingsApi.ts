import {
  SystemSettingsState,
  IntegrationItem,
  FeatureFlagItem,
  MicroserviceHealthItem,
  SystemBackupItem,
} from "@/types/adminSettings";

let mockSettings: SystemSettingsState = {
  general: {
    platformName: "Enterprise Multi-Vendor Marketplace",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    websiteUrl: "https://marketplace.enterprise.com",
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
    defaultCommissionPct: 10,
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
    stripePublicKey: "pk_live_51N8xY2Lkd890192A0912384",
    stripeSecretKey: "sk_live_51N8xY2Lkd890192A0912384_SECRET_MASKED",
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
    securityScore: 92,
  },
};

let mockIntegrations: IntegrationItem[] = [
  { id: "int_1", name: "Stripe Connect Gateway", description: "Payment processing & seller payouts", iconName: "CreditCard", status: "Connected", configured: true },
  { id: "int_2", name: "Google OAuth 2.0", description: "Social login & single sign-on", iconName: "Globe", status: "Connected", configured: true },
  { id: "int_3", name: "Firebase Cloud Messaging", description: "Push notification dispatch", iconName: "Bell", status: "Connected", configured: true },
  { id: "int_4", name: "AWS S3 Media Storage", description: "Product image CDN & asset storage", iconName: "Server", status: "Connected", configured: true },
  { id: "int_5", name: "Meilisearch Search Cluster", description: "High performance product search index", iconName: "Search", status: "Connected", configured: true },
];

let mockFeatureFlags: FeatureFlagItem[] = [
  { id: "ff_1", name: "AI Recommendations Engine", description: "ML-driven personalized product recommendations", enabled: true, environment: "Production" },
  { id: "ff_2", name: "Live Customer Chat Support", description: "Realtime WebSocket chat widget on product pages", enabled: true, environment: "Production" },
  { id: "ff_3", name: "Next-Gen One-Click Checkout", description: "Streamlined 1-step buyer checkout pipeline", enabled: false, environment: "Beta" },
  { id: "ff_4", name: "Beta Seller Analytics Dashboard", description: "Advanced cohort insights for marketplace vendors", enabled: true, environment: "Beta" },
];

let mockHealth: MicroserviceHealthItem[] = [
  { id: "srv_1", name: "API Gateway Cluster", service: "Gateway Service", status: "Healthy", uptime: "99.99%", latencyMs: 12 },
  { id: "srv_2", name: "Auth & IAM Service", service: "Authentication Service", status: "Healthy", uptime: "99.98%", latencyMs: 18 },
  { id: "srv_3", name: "Product Catalog Service", service: "Product Service", status: "Healthy", uptime: "99.95%", latencyMs: 24 },
  { id: "srv_4", name: "Order Processing Engine", service: "Order Service", status: "Healthy", uptime: "99.99%", latencyMs: 15 },
  { id: "srv_5", name: "Stripe Payment Service", service: "Payment Service", status: "Healthy", uptime: "99.99%", latencyMs: 32 },
  { id: "srv_6", name: "Notification Broker (RabbitMQ)", service: "Notification Service", status: "Healthy", uptime: "99.92%", latencyMs: 10 },
  { id: "srv_7", name: "Redis Cache Cluster", service: "Cache Layer", status: "Healthy", uptime: "100.0%", latencyMs: 2 },
  { id: "srv_8", name: "PostgreSQL Master DB", service: "Database Cluster", status: "Healthy", uptime: "99.99%", latencyMs: 8 },
];

let mockBackups: SystemBackupItem[] = [
  { id: "bak_101", fileName: "backup_prod_db_20260719_0600.sql.gz", sizeGb: 42.5, createdAt: "2026-07-19 06:00 UTC", status: "Completed" },
  { id: "bak_102", fileName: "backup_prod_db_20260718_0600.sql.gz", sizeGb: 41.8, createdAt: "2026-07-18 06:00 UTC", status: "Completed" },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminSettingsApi = {
  getSettings: async (): Promise<SystemSettingsState> => {
    await delay(200);
    return { ...mockSettings };
  },

  updateSettings: async (section: keyof SystemSettingsState, payload: any): Promise<boolean> => {
    await delay(350);
    mockSettings[section] = { ...mockSettings[section], ...payload };
    return true;
  },

  getIntegrations: async (): Promise<IntegrationItem[]> => {
    await delay(200);
    return [...mockIntegrations];
  },

  toggleIntegration: async (id: string, status: "Connected" | "Disconnected"): Promise<boolean> => {
    await delay(300);
    const item = mockIntegrations.find((i) => i.id === id);
    if (item) item.status = status;
    return true;
  },

  getFeatureFlags: async (): Promise<FeatureFlagItem[]> => {
    await delay(200);
    return [...mockFeatureFlags];
  },

  toggleFeatureFlag: async (id: string, enabled: boolean): Promise<boolean> => {
    await delay(250);
    const flag = mockFeatureFlags.find((f) => f.id === id);
    if (flag) flag.enabled = enabled;
    return true;
  },

  getSystemHealth: async (): Promise<MicroserviceHealthItem[]> => {
    await delay(200);
    return [...mockHealth];
  },

  getBackups: async (): Promise<SystemBackupItem[]> => {
    await delay(200);
    return [...mockBackups];
  },

  clearCache: async (): Promise<boolean> => {
    await delay(500);
    return true;
  },

  createBackup: async (): Promise<SystemBackupItem> => {
    await delay(600);
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
