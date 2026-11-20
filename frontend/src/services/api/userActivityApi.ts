import { UserActivityApiResponse } from "@/types/userActivity";

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

export interface UserActivityFilters {
  search?: string;
  eventType?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const userActivityApi = {
  getUserActivity: async (filters: UserActivityFilters = {}): Promise<UserActivityApiResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.eventType && filters.eventType !== "all") params.set("eventType", filters.eventType);
    if (filters.role && filters.role !== "all") params.set("role", filters.role);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<UserActivityApiResponse>(`/api/track/activity${qs}`);
  },
};
