import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api/v1";

export interface CartItemPayload {
  productId: string;
  vendorId?: string;
  productName: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
}

export const cartApi = {
  getCart: async (guestId?: string) => {
    const headers: Record<string, string> = {};
    if (guestId) headers["X-Guest-Id"] = guestId;

    const res = await axios.get(`${API_BASE}/cart`, { headers, withCredentials: true });
    return res.data;
  },

  addItem: async (item: CartItemPayload, guestId?: string) => {
    const headers: Record<string, string> = {};
    if (guestId) headers["X-Guest-Id"] = guestId;

    const res = await axios.post(`${API_BASE}/cart/items`, item, { headers, withCredentials: true });
    return res.data;
  },

  updateQuantity: async (productId: string, quantity: number, guestId?: string) => {
    const headers: Record<string, string> = {};
    if (guestId) headers["X-Guest-Id"] = guestId;

    const res = await axios.put(
      `${API_BASE}/cart/items/${productId}`,
      { quantity },
      { headers, withCredentials: true }
    );
    return res.data;
  },

  removeItem: async (productId: string, guestId?: string) => {
    const headers: Record<string, string> = {};
    if (guestId) headers["X-Guest-Id"] = guestId;

    const res = await axios.delete(`${API_BASE}/cart/items/${productId}`, {
      headers,
      withCredentials: true,
    });
    return res.data;
  },

  clearCart: async (guestId?: string) => {
    const headers: Record<string, string> = {};
    if (guestId) headers["X-Guest-Id"] = guestId;

    const res = await axios.delete(`${API_BASE}/cart`, { headers, withCredentials: true });
    return res.data;
  },

  mergeCart: async (guestId: string) => {
    const res = await axios.post(
      `${API_BASE}/cart/merge`,
      { guestId },
      { withCredentials: true }
    );
    return res.data;
  },
};
