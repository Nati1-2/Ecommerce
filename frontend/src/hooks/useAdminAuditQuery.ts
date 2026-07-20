"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAuditApi } from "@/services/api/adminAuditApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";

export function useAuditStats() {
  return useQuery({
    queryKey: ["admin-audit-stats"],
    queryFn: adminAuditApi.getStats,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: adminAuditApi.getLogs,
  });
}

export function useSecurityEvents() {
  return useQuery({
    queryKey: ["admin-security-events"],
    queryFn: adminAuditApi.getSecurityEvents,
  });
}

export function useLoginHistory() {
  return useQuery({
    queryKey: ["admin-login-history"],
    queryFn: adminAuditApi.getLoginHistory,
  });
}

export function useSecurityAlerts() {
  return useQuery({
    queryKey: ["admin-security-alerts"],
    queryFn: adminAuditApi.getAlerts,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminAuditApi.resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-security-alerts"] });
      showToast("Security alert marked as resolved!", "success");
    },
  });
}

export function useExportAuditLogs() {
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (format: "pdf" | "csv" | "excel") => adminAuditApi.exportLogs(format),
    onSuccess: (_, format) => {
      showToast(`Compliance audit report generated and downloaded (${format.toUpperCase()})`, "success");
    },
  });
}

export function useUpdateRetention() {
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (days: number) => adminAuditApi.updateRetention(days),
    onSuccess: (_, days) => {
      showToast(`Audit log retention policy updated to ${days} days!`, "success");
    },
  });
}
