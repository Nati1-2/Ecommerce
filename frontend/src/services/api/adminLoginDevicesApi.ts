import { AdminLoginDevicesResponse } from "@/types/adminLoginDevices";

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

export const adminLoginDevicesApi = {
  getDevicesAndActivity: async (): Promise<AdminLoginDevicesResponse> => {
    return apiFetch<AdminLoginDevicesResponse>("/api/admin/admin-devices");
  },

  revokeDevice: async (deviceId: string): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>("/api/admin/admin-devices", {
      method: "POST",
      body: JSON.stringify({ action: "revoke", deviceId }),
    });
  },

  revokeAllOtherDevices: async (): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>("/api/admin/admin-devices", {
      method: "POST",
      body: JSON.stringify({ action: "revoke_all_others" }),
    });
  },

};
