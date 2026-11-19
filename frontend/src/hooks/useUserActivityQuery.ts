"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userActivityApi, UserActivityFilters } from "@/services/api/userActivityApi";

export function useUserActivity(
  filters: UserActivityFilters = {},
  refetchIntervalMs: number | false = 3000
) {
  return useQuery({
    queryKey: [
      "admin-user-activity",
      filters.search || "",
      filters.eventType || "all",
      filters.role || "all",
      filters.page || 1,
      filters.limit || 30,
    ],
    queryFn: () => userActivityApi.getUserActivity(filters),
    refetchInterval: refetchIntervalMs,
    staleTime: 2000,
  });
}

export function useSimulateUserClick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userActivityApi.simulateClick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-activity"] });
    },
  });
}
