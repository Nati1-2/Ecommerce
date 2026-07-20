export type SettingsSection =
  | "general"
  | "users"
  | "vendors"
  | "products"
  | "orders"
  | "payments"
  | "shipping"
  | "notifications"
  | "security"
  | "integrations"
  | "feature-flags"
  | "maintenance"
  | "cache"
  | "database"
  | "health";

export interface GeneralSettingsModel {
  platformName: string;
  logoUrl: string;
  websiteUrl: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

export interface UserSettingsModel {
  userRegistration: boolean;
  emailVerification: boolean;
  phoneVerification: boolean;
  minPasswordLength: number;
  allowAccountDeletion: boolean;
}

export interface VendorSettingsModel {
  vendorRegistration: boolean;
  vendorApprovalRequired: boolean;
  defaultCommissionPct: number;
  vendorKYCRequired: boolean;
  maxProductsPerVendor: number;
}

export interface ProductSettingsModel {
  requireAdminApproval: boolean;
  enableVariants: boolean;
  enableDigitalProducts: boolean;
  enableReviews: boolean;
  lowStockThreshold: number;
}

export interface OrderSettingsModel {
  autoConfirmation: boolean;
  allowCancellation: boolean;
  orderTimeoutHours: number;
  returnPolicyDays: number;
  requireRefundApproval: boolean;
}

export interface PaymentSettingsModel {
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  bankTransferEnabled: boolean;
  maxTransactionLimit: number;
}

export interface ShippingSettingsModel {
  fedexEnabled: boolean;
  upsEnabled: boolean;
  dhlEnabled: boolean;
  flatRateFee: number;
  freeShippingThreshold: number;
}

export interface NotificationGatewaySettingsModel {
  smtpHost: string;
  smtpPort: number;
  firebaseServerKey: string;
  twilioSid: string;
  maxRatePerMin: number;
}

export interface SecuritySettingsModel {
  twoFactorRequired: boolean;
  sessionTimeoutMins: number;
  maxLoginAttempts: number;
  ipWhitelist: string[];
  securityScore: number;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  status: "Connected" | "Disconnected";
  configured: boolean;
}

export interface FeatureFlagItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: "Production" | "Beta";
}

export interface MicroserviceHealthItem {
  id: string;
  name: string;
  service: string;
  status: "Healthy" | "Warning" | "Offline";
  uptime: string;
  latencyMs: number;
}

export interface SystemBackupItem {
  id: string;
  fileName: string;
  sizeGb: number;
  createdAt: string;
  status: "Completed" | "In Progress";
}

export interface SystemSettingsState {
  general: GeneralSettingsModel;
  users: UserSettingsModel;
  vendors: VendorSettingsModel;
  products: ProductSettingsModel;
  orders: OrderSettingsModel;
  payments: PaymentSettingsModel;
  shipping: ShippingSettingsModel;
  notifications: NotificationGatewaySettingsModel;
  security: SecuritySettingsModel;
}
