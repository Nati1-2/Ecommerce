import {
  VisitorApiResponse,
  VisitorFilterOptions,
} from "@/types/adminVisitors";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
  }

  return res.json();
}

export const adminVisitorsApi = {
  getVisitors: async (filters: VisitorFilterOptions = {}): Promise<VisitorApiResponse> => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set("search", filters.searchQuery);
    if (filters.sourceType && filters.sourceType !== "all") params.set("source", filters.sourceType);
    if (filters.deviceType && filters.deviceType !== "all") params.set("device", filters.deviceType);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.timeframe) params.set("timeframe", filters.timeframe);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<VisitorApiResponse>(`/api/admin/visitors${queryString}`);
  },

  simulateHit: async (): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>("/api/admin/visitors", {
      method: "POST",
    });
  },

  clearLogs: async (): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>("/api/admin/visitors", {
      method: "DELETE",
    });
  },
};
