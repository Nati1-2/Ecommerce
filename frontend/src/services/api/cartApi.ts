import { CartItem } from "@/store/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Handle guest sessions
    let guestId = localStorage.getItem("guest_id");
    if (!guestId && !token) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("guest_id", guestId);
    }
    if (guestId) {
      headers["x-guest-id"] = guestId;
    }
  }
  return headers;
};

// Map backend cart items to frontend CartItem interface
const mapCartItems = (backendItems: any[]): CartItem[] => {
  if (!backendItems) return [];
  return backendItems.map((item) => ({
    productId: item.productId,
    name: item.productName || item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.imageUrl || item.image || "/iphone17.png",
  }));
};

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/cart`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      return mapCartItems(data.data?.items || []);
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  addItem: async (item: CartItem): Promise<CartItem[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/cart/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        productId: item.productId,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image,
      }),
    });
    if (!res.ok) throw new Error("Failed to add item to cart");
    const data = await res.json();
    return mapCartItems(data.data?.items || []);
  },

  updateQuantity: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update cart quantity");
    const data = await res.json();
    return mapCartItems(data.data?.items || []);
  },

  removeItem: async (productId: string): Promise<CartItem[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/cart/items/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to remove item from cart");
    const data = await res.json();
    return mapCartItems(data.data?.items || []);
  },

  clearCart: async (): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/v1/cart`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to clear cart");
  },

  mergeCart: async (): Promise<void> => {
    const guestId = typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (guestId && token) {
      try {
        await fetch(`${API_BASE_URL}/v1/cart/merge`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ guestId }),
        });
        localStorage.removeItem("guest_id");
      } catch (err) {
        console.error("Failed to merge cart", err);
      }
    }
  }
};
