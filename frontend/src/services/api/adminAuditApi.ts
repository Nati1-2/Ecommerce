import {
  AuditLogModel,
  SecurityEventModel,
  LoginActivityItem,
  SecurityAlertItem,
  AuditStatsData,
} from "@/types/adminAudit";

let mockStats: AuditStatsData = {
  totalEvents: 25000000,
  todayEvents: 120000,
  failedLogins: 450,
  securityAlerts: 35,
  adminActions: 5000,
};

let mockLogs: AuditLogModel[] = [
  {
    id: "evt_10928301",
    user: "Alexander Vance",
    userEmail: "a.vance@enterprise.com",
    role: "Admin",
    action: "VENDOR_COMMISSION_UPDATED",
    resource: "Vendor: TechLabs Store (vnd_8901)",
    severity: "High",
    ip: "192.168.1.105",
    location: "San Francisco, USA",
    device: "MacBook Pro M3",
    browser: "Chrome 126.0",
    createdAt: "2026-07-19 01:42:10 UTC",
    diff: [
      { field: "commissionPercentage", oldValue: 5, newValue: 10, changedBy: "Alexander Vance" },
    ],
    rawPayload: {
      event_type: "VENDOR_COMMISSION_UPDATED",
      vendor_id: "vnd_8901",
      old_pct: 5,
      new_pct: 10,
      admin_id: "usr_admin_01",
    },
  },
  {
    id: "evt_10928302",
    user: "Elena Rostova",
    userEmail: "elena@luminavision.io",
    role: "Vendor",
    action: "PRODUCT_PUBLISHED",
    resource: "Product: Lumina 4K OLED Monitor (prd_4401)",
    severity: "Low",
    ip: "82.102.21.44",
    location: "Berlin, Germany",
    device: "Windows 11 Workstation",
    browser: "Firefox 127.0",
    createdAt: "2026-07-19 01:35:22 UTC",
    rawPayload: {
      event_type: "PRODUCT_PUBLISHED",
      product_id: "prd_4401",
      price: 1299.00,
      seller_id: "vnd_8901",
    },
  },
  {
    id: "evt_10928303",
    user: "Botnet IP 185.220.101.5",
    userEmail: "unknown_attacker@darkweb.org",
    role: "Customer",
    action: "FAILED_LOGIN_ATTEMPT",
    resource: "Auth: /api/v1/auth/login",
    severity: "Critical",
    ip: "185.220.101.5",
    location: "Moscow, Russia",
    device: "Linux x86_64",
    browser: "Python Requests 2.31",
    createdAt: "2026-07-19 01:30:00 UTC",
    rawPayload: {
      event_type: "FAILED_LOGIN_ATTEMPT",
      target_account: "admin@marketplace.com",
      attempts: 45,
      waf_rule_triggered: "BRUTE_FORCE_RATE_LIMIT",
    },
  },
  {
    id: "evt_10928304",
    user: "Sarah Jenkins",
    userEmail: "sarah.j@techcorp.com",
    role: "Admin",
    action: "ORDER_REFUND_APPROVED",
    resource: "Order: #ord_90101",
    severity: "Medium",
    ip: "192.168.1.110",
    location: "Seattle, USA",
    device: "MacBook Air M2",
    browser: "Safari 17.4",
    createdAt: "2026-07-19 01:15:45 UTC",
    diff: [
      { field: "paymentStatus", oldValue: "Paid", newValue: "Refunded", changedBy: "Sarah Jenkins" },
      { field: "refundAmount", oldValue: 0, newValue: 699.00, changedBy: "Sarah Jenkins" },
    ],
  },
];

let mockSecurityEvents: SecurityEventModel[] = [
  { id: "sec_1", type: "BRUTE_FORCE_ATTACK", description: "45 failed login attempts in 60s from IP 185.220.101.5", severity: "Critical", status: "Open", detectedAt: "2026-07-19 01:30 UTC", ip: "185.220.101.5", actor: "Unknown IP" },
  { id: "sec_2", type: "UNUSUAL_GEO_LOCATION", description: "Admin logged in from new country (Singapore)", severity: "Warning", status: "Investigating", detectedAt: "2026-07-19 00:15 UTC", ip: "118.200.12.8", actor: "Marcus Sterling" },
];

let mockLoginHistory: LoginActivityItem[] = [
  { id: "log_1", user: "Alexander Vance", userEmail: "a.vance@enterprise.com", role: "Admin", device: "MacBook Pro", browser: "Chrome", location: "San Francisco, USA", ip: "192.168.1.105", status: "Successful", timestamp: "2026-07-19 01:40 UTC" },
  { id: "log_2", user: "Unknown Attacker", userEmail: "admin@marketplace.com", role: "Customer", device: "Linux Scripts", browser: "Python", location: "Moscow, Russia", ip: "185.220.101.5", status: "Blocked", timestamp: "2026-07-19 01:30 UTC" },
];

let mockAlerts: SecurityAlertItem[] = [
  { id: "alt_101", title: "Multiple Failed Payments Detected", description: "Card testing bot pattern detected on checkout endpoint", severity: "Critical", status: "Active", createdAt: "2026-07-19 01:25 UTC" },
  { id: "alt_102", title: "Unusual Commission Change", description: "Vendor commission modified to 10% by admin user", severity: "Medium", status: "Active", createdAt: "2026-07-19 01:42 UTC" },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminAuditApi = {
  getStats: async (): Promise<AuditStatsData> => {
    await delay(200);
    return { ...mockStats };
  },

  getLogs: async (): Promise<AuditLogModel[]> => {
    await delay(250);
    return [...mockLogs];
  },

  getSecurityEvents: async (): Promise<SecurityEventModel[]> => {
    await delay(200);
    return [...mockSecurityEvents];
  },

  getLoginHistory: async (): Promise<LoginActivityItem[]> => {
    await delay(200);
    return [...mockLoginHistory];
  },

  getAlerts: async (): Promise<SecurityAlertItem[]> => {
    await delay(200);
    return [...mockAlerts];
  },

  resolveAlert: async (id: string): Promise<boolean> => {
    await delay(300);
    const alert = mockAlerts.find((a) => a.id === id);
    if (alert) alert.status = "Resolved";
    return true;
  },

  exportLogs: async (format: "pdf" | "csv" | "excel"): Promise<boolean> => {
    await delay(400);
    return true;
  },

  updateRetention: async (days: number): Promise<boolean> => {
    await delay(300);
    return true;
  },
};
