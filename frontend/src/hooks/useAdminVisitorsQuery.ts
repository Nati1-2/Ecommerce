"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminVisitorsApi } from "@/services/api/adminVisitorsApi";
import { VisitorFilterOptions } from "@/types/adminVisitors";

export function useAdminVisitors(
  filters: VisitorFilterOptions = {},
  refetchIntervalMs: number | false = 10000
) {
  return useQuery({
    queryKey: [
      "admin-visitors",
      filters.searchQuery || "",
      filters.sourceType || "all",
      filters.deviceType || "all",
      filters.page || 1,
      filters.limit || 25,
      filters.timeframe || "all",
    ],
    queryFn: () => adminVisitorsApi.getVisitors(filters),
    refetchInterval: refetchIntervalMs,
    staleTime: 5000,
  });
}

export function useSimulateVisitorHit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminVisitorsApi.simulateHit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visitors"] });
    },
  });
}

export function useClearVisitorLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminVisitorsApi.clearLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visitors"] });
    },
  });
}
