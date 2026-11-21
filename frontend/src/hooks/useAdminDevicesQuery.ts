"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDevicesApi, DeviceFilterParams } from "@/services/api/adminDevicesApi";

export function useAdminDevices(
  filters: DeviceFilterParams = {},
  refetchIntervalMs: number | false = 5000
) {
  return useQuery({
    queryKey: [
      "admin-devices",
      filters.search || "",
      filters.deviceType || "all",
      filters.status || "all",
      filters.category || "all",
      filters.page || 1,
      filters.limit || 25,
    ],
    queryFn: () => adminDevicesApi.getDevices(filters),
    refetchInterval: refetchIntervalMs,
    staleTime: 3000,
  });
}

