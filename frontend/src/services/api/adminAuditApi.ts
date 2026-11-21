import type {
  AuditLogModel, SecurityEventModel, LoginActivityItem,
  SecurityAlertItem, AuditStatsData,
} from "@/types/adminAudit";

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function unavailable(): never {
  throw new Error("Persistent security audit logging is not configured.");
}

export const adminAuditApi = {
  getStats: async (): Promise<AuditStatsData> => unavailable(),
  getLogs: async (): Promise<AuditLogModel[]> => unavailable(),
  getSecurityEvents: async (): Promise<SecurityEventModel[]> => unavailable(),
  getLoginHistory: async (): Promise<LoginActivityItem[]> => {
    const data = await apiFetch<{ logins: LoginActivityItem[] }>("/api/admin/audit-logs/logins");
    return data.logins;
  },
  getAlerts: async (): Promise<SecurityAlertItem[]> => unavailable(),
  resolveAlert: async (_id: string): Promise<boolean> => unavailable(),
  exportLogs: async (_format: "pdf" | "csv" | "excel"): Promise<boolean> => unavailable(),
  updateRetention: async (_days: number): Promise<boolean> => unavailable(),
};
