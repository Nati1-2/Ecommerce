"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api/adminApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getPlatformStats,
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ["admin-system-status"],
    queryFn: adminApi.getSystemStatus,
    refetchInterval: 15000, // Refresh system health every 15s
  });
}

export function useMarketplaceHealth() {
  return useQuery({
    queryKey: ["admin-marketplace-health"],
    queryFn: adminApi.getMarketplaceHealth,
  });
}

export function useAdminVendors() {
  return useQuery({
    queryKey: ["admin-vendors"],
    queryFn: adminApi.getVendors,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: adminApi.getProducts,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminApi.getOrders,
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: adminApi.getPayments,
  });
}

export function useAdminActivities() {
  return useQuery({
    queryKey: ["admin-activities"],
    queryFn: adminApi.getActivityLogs,
  });
}

export function useAdminAnalytics(timeframe: string) {
  return useQuery({
    queryKey: ["admin-analytics", timeframe],
    queryFn: () => adminApi.getAnalytics(timeframe),
  });
}

export function useApproveVendor() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminApi.approveVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-health"] });
      showToast("Vendor store verification approved successfully!", "success");
    },
  });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminApi.approveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-health"] });
      showToast("Product approved for public marketplace listing!", "success");
    },
  });
}

export function useBroadcastAnnouncement() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (message: string) => adminApi.broadcastAnnouncement(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
      showToast("Platform announcement broadcasted to all users and vendors!", "success");
    },
  });
}
