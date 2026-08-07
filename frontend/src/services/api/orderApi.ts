function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const orderApi = {
  createOrder: async (orderData: any) => {
    return apiFetch<{ success: boolean; data: any }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getOrder: async (orderId: string) => {
    return apiFetch<{ success: boolean; data: any }>(`/api/orders/${orderId}`);
  },

  getUserOrders: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : "";
    return apiFetch<{ success: boolean; data: any[] }>(`/api/orders${query}`);
  },
};
