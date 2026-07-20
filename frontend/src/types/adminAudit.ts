export type AuditSeverity = "Low" | "Medium" | "High" | "Critical" | "Warning";

export type AuditRole = "Admin" | "Vendor" | "Customer" | "System";

export interface ChangeHistoryModel {
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
}

export interface AuditLogModel {
  id: string;
  user: string;
  userEmail: string;
  userAvatar?: string;
  role: AuditRole;
  action: string;
  resource: string;
  severity: AuditSeverity;
  ip: string;
  location: string;
  device: string;
  browser: string;
  createdAt: string;
  diff?: ChangeHistoryModel[];
  rawPayload?: Record<string, any>;
}

export interface SecurityEventModel {
  id: string;
  type: string;
  description: string;
  severity: AuditSeverity;
  status: "Open" | "Investigating" | "Resolved" | "Ignored";
  detectedAt: string;
  ip: string;
  actor: string;
}

export interface LoginActivityItem {
  id: string;
  user: string;
  userEmail: string;
  role: AuditRole;
  device: string;
  browser: string;
  location: string;
  ip: string;
  status: "Successful" | "Failed" | "Blocked";
  timestamp: string;
}

export interface SecurityAlertItem {
  id: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  status: "Active" | "Resolved";
  createdAt: string;
}

export interface AuditStatsData {
  totalEvents: number;
  todayEvents: number;
  failedLogins: number;
  securityAlerts: number;
  adminActions: number;
}
