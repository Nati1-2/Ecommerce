"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLoginDevicesApi } from "@/services/api/adminLoginDevicesApi";

export function useAdminLoginDevices() {
  return useQuery({
    queryKey: ["admin-login-devices"],
    queryFn: adminLoginDevicesApi.getDevicesAndActivity,
    refetchInterval: 8000,
    staleTime: 4000,
  });
}

export function useRevokeAdminDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminLoginDevicesApi.revokeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-login-devices"] });
    },
  });
}

export function useRevokeAllOtherAdminDevices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminLoginDevicesApi.revokeAllOtherDevices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-login-devices"] });
    },
  });
}

