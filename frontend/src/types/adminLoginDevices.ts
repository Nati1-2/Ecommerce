export type AdminDeviceStatus = "CURRENT" | "ACTIVE" | "IDLE" | "REVOKED" | "EXPIRED";

export type AdminDeviceType = "Desktop" | "Mobile" | "Tablet" | "Workstation";

export interface AdminLoginLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  isp: string;
}

export interface AdminLoginDevice {
  id: string;
  sessionId: string;
  adminEmail: string;
  adminName: string;
  role: string;
  deviceModel: string;
  deviceBrand: string;
  deviceType: AdminDeviceType;
  os: string;
  browser: string;
  ip: string;
  location: AdminLoginLocation;
  status: AdminDeviceStatus;
  loginTime: string;
  lastActive: string;
  is2FAVerified: boolean;
  isCurrentDevice: boolean;
  authMethod: "Password + JWT" | "Hardware FIDO2" | "Authenticator App" | "Session Cookie";
  userAgent: string;
}

export type AdminActivityCategory =
  | "security"
  | "catalog"
  | "vendor"
  | "system"
  | "finance"
  | "auth";

export type AdminActivitySeverity = "critical" | "high" | "medium" | "low";

export interface AdminActivityItem {
  id: string;
  action: string;
  title: string;
  category: AdminActivityCategory;
  details: string;
  targetResource: string;
  adminActor: {
    name: string;
    email: string;
    role: string;
  };
  deviceUsed: string;
  ip: string;
  flag: string;
  timestamp: string;
  severity: AdminActivitySeverity;
  status: "SUCCESS" | "BLOCKED" | "WARNING";
}

export interface AdminLoginStats {
  activeAdminSessions: number;
  totalDevicesCount: number;
  trustedDevicesCount: number;
  failedLoginsToday: number;
  totalAdminActions24h: number;
  mfaEnforcementRate: number;
}

export interface AdminLoginDevicesResponse {
  success: boolean;
  stats: AdminLoginStats;
  devices: AdminLoginDevice[];
  activities: AdminActivityItem[];
}
