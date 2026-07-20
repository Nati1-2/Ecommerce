"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminNotificationApi } from "@/services/api/adminNotificationApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { NotificationSettingsData } from "@/types/adminNotification";

export function useNotificationStats() {
  return useQuery({
    queryKey: ["admin-notification-stats"],
    queryFn: adminNotificationApi.getStats,
  });
}

export function useNotificationChannels() {
  return useQuery({
    queryKey: ["admin-notification-channels"],
    queryFn: adminNotificationApi.getChannels,
  });
}

export function useNotificationCampaigns() {
  return useQuery({
    queryKey: ["admin-notification-campaigns"],
    queryFn: adminNotificationApi.getCampaigns,
  });
}

export function useNotificationTemplates() {
  return useQuery({
    queryKey: ["admin-notification-templates"],
    queryFn: adminNotificationApi.getTemplates,
  });
}

export function useNotificationLogs() {
  return useQuery({
    queryKey: ["admin-notification-logs"],
    queryFn: adminNotificationApi.getLogs,
  });
}

export function useAutomationRules() {
  return useQuery({
    queryKey: ["admin-automation-rules"],
    queryFn: adminNotificationApi.getAutomationRules,
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["admin-notification-settings"],
    queryFn: adminNotificationApi.getSettings,
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (payload: any) => adminNotificationApi.sendNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notification-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notification-logs"] });
      showToast("Notification broadcast dispatched successfully!", "success");
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (payload: any) => adminNotificationApi.createCampaign(payload),
    onSuccess: (newCamp) => {
      queryClient.invalidateQueries({ queryKey: ["admin-notification-campaigns"] });
      showToast(`Campaign "${newCamp.name}" created and launched!`, "success");
    },
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (payload: any) => adminNotificationApi.createTemplate(payload),
    onSuccess: (newTpl) => {
      queryClient.invalidateQueries({ queryKey: ["admin-notification-templates"] });
      showToast(`Template "${newTpl.name}" saved to library!`, "success");
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (settings: NotificationSettingsData) => adminNotificationApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notification-settings"] });
      showToast("Notification gateway settings updated!", "success");
    },
  });
}
