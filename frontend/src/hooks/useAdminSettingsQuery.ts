"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/api/adminSettingsApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { SystemSettingsState } from "@/types/adminSettings";

export function useSystemSettings() {
  return useQuery({
    queryKey: ["admin-system-settings"],
    queryFn: adminSettingsApi.getSettings,
  });
}

export function useIntegrations() {
  return useQuery({
    queryKey: ["admin-integrations-list"],
    queryFn: adminSettingsApi.getIntegrations,
  });
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["admin-feature-flags-list"],
    queryFn: adminSettingsApi.getFeatureFlags,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin-system-health-mesh"],
    queryFn: adminSettingsApi.getSystemHealth,
    refetchInterval: 10000,
  });
}

export function useBackups() {
  return useQuery({
    queryKey: ["admin-database-backups"],
    queryFn: adminSettingsApi.getBackups,
  });
}

export function useUpdateSettingsSection() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ section, payload }: { section: keyof SystemSettingsState; payload: any }) =>
      adminSettingsApi.updateSettings(section, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-system-settings"] });
      showToast(`System section "${String(variables.section).toUpperCase()}" settings updated!`, "success");
    },
  });
}

export function useToggleFeatureFlag() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      adminSettingsApi.toggleFeatureFlag(id, enabled),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-feature-flags-list"] });
      showToast(`Feature Flag updated to ${variables.enabled ? "ENABLED (ON)" : "DISABLED (OFF)"}`, "info");
    },
  });
}

export function useToggleIntegration() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Connected" | "Disconnected" }) =>
      adminSettingsApi.toggleIntegration(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-integrations-list"] });
      showToast(`API Integration status set to ${variables.status}`, "info");
    },
  });
}

export function useClearCache() {
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: adminSettingsApi.clearCache,
    onSuccess: () => {
      showToast("Redis Master & Replica Cache purged successfully!", "success");
    },
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: adminSettingsApi.createBackup,
    onSuccess: (newBak) => {
      queryClient.invalidateQueries({ queryKey: ["admin-database-backups"] });
      showToast(`Database snapshot backup "${newBak.fileName}" created!`, "success");
    },
  });
}
