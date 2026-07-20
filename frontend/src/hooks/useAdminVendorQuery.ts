"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminVendorApi } from "@/services/api/adminVendorApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { AddVendorInput } from "@/types/adminVendor";

export function useVendorStats() {
  return useQuery({
    queryKey: ["admin-vendor-stats"],
    queryFn: adminVendorApi.getVendorStats,
  });
}

export function useAdminVendors() {
  return useQuery({
    queryKey: ["admin-vendors-list"],
    queryFn: adminVendorApi.getVendors,
  });
}

export function useVendorDetail(id: string) {
  return useQuery({
    queryKey: ["admin-vendor-detail", id],
    queryFn: () => adminVendorApi.getVendorById(id),
    enabled: !!id,
  });
}

export function useVendorAnalytics(id: string) {
  return useQuery({
    queryKey: ["admin-vendor-analytics", id],
    queryFn: () => adminVendorApi.getVendorAnalytics(id),
    enabled: !!id,
  });
}

export function useApproveVendor() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminVendorApi.approveVendor(id),
    onSuccess: (approved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-health"] });
      showToast(`Vendor "${approved.storeName}" application approved!`, "success");
    },
  });
}

export function useRejectVendor() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, reason, notes }: { id: string; reason: string; notes: string }) =>
      adminVendorApi.rejectVendor(id, reason, notes),
    onSuccess: (rejected) => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-stats"] });
      showToast(`Vendor "${rejected.storeName}" application rejected`, "info");
    },
  });
}

export function useSuspendVendor() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminVendorApi.suspendVendor(id, reason),
    onSuccess: (suspended) => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-stats"] });
      showToast(`Vendor "${suspended.storeName}" has been suspended`, "error");
    },
  });
}

export function useAddVendor() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (input: AddVendorInput) => adminVendorApi.addVendor(input),
    onSuccess: (newVendor) => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-stats"] });
      showToast(`Vendor "${newVendor.storeName}" onboarded to marketplace!`, "success");
    },
  });
}

export function useBulkApproveVendors() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (ids: string[]) => adminVendorApi.bulkApproveVendors(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-stats"] });
      showToast("Selected vendor applications approved!", "success");
    },
  });
}
