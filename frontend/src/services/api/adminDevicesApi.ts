import { DeviceTrafficResponse } from "@/types/deviceTraffic";

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

export interface DeviceFilterParams {
  search?: string;
  deviceType?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const adminDevicesApi = {
  getDevices: async (params: DeviceFilterParams = {}): Promise<DeviceTrafficResponse> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.deviceType && params.deviceType !== "all") searchParams.set("deviceType", params.deviceType);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);
    if (params.category && params.category !== "all") searchParams.set("category", params.category);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiFetch<DeviceTrafficResponse>(`/api/admin/devices${qs}`);
  },

};
