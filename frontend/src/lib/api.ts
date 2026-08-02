import { Product } from "@/types";
import { useOrderStore } from "@/store/orderStore";
import { Order, Tracking, Notification, NotificationSettings } from "@/types";
import { mockProducts } from "@/data/mock";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface GetProductsParams {
  category?: string | string[];
  search?: string;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  rating?: number;
  inStock?: boolean;
  discount?: number;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Retrieves products via real backend API Route.
 */
export async function fetchProducts(params: GetProductsParams): Promise<ProductsResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/v1/products`);
    
    if (params.category) {
      const cat = Array.isArray(params.category) ? params.category[0] : params.category;
      if (cat) url.searchParams.set("category", cat);
    }
    if (params.search) url.searchParams.set("search", params.search);
    if (params.page) url.searchParams.set("page", params.page.toString());
    if (params.limit) url.searchParams.set("limit", params.limit.toString());
    if (params.sort) url.searchParams.set("sort", params.sort);
    if (params.priceMin !== undefined) url.searchParams.set("minPrice", params.priceMin.toString());
    if (params.priceMax !== undefined) url.searchParams.set("maxPrice", params.priceMax.toString());

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.products) {
          return data.data;
        }
        return {
          products: data.data,
          total: data.data.length,
          page: params.page || 1,
          totalPages: Math.ceil(data.data.length / (params.limit || 8)) || 1
        };
      }
    }
  } catch (err) {
    console.warn("fetchProducts API unavailable, using mock fallback:", err);
  }

  // Fallback to mock data filtering
  let filtered = [...mockProducts];

  // Category filter
  if (params.category) {
    const catStr = Array.isArray(params.category) ? params.category[0] : params.category;
    if (catStr && typeof catStr === "string") {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === catStr.toLowerCase());
    }
  }

  // Search filter
  if (params.search && typeof params.search === "string") {
    const term = params.search.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term))
      );
    }
  }

  // Brands filter
  if (params.brands && params.brands.length > 0) {
    filtered = filtered.filter(p => p.brand && params.brands?.includes(p.brand));
  }

  // Price range filter
  if (params.priceMin !== undefined) {
    filtered = filtered.filter(p => p.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filtered = filtered.filter(p => p.price <= params.priceMax!);
  }

  // Sort
  if (params.sort) {
    if (params.sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (params.sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (params.sort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }
  }

  const page = params.page || 1;
  const limit = params.limit || 8;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
    page,
    totalPages
  };
}

/**
 * Fetch a single product by its ID.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    console.warn("Backend fetchProductById failed, trying mockProducts fallback:", err);
  }

  const found = mockProducts.find(p => p.id === id || p.slug === id);
  return found || mockProducts[0] || null;
}

/**
 * Fetch related products in the same category.
 */
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const currentProduct = await fetchProductById(productId);
    if (!currentProduct || !currentProduct.category) return [];
    
    const response = await fetchProducts({ category: currentProduct.category, limit: 5 });
    return response.products.filter(p => p.id !== productId).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

/**
 * Fetch generic recommendations.
 */
export async function fetchRecommendations(): Promise<Product[]> {
  try {
    const response = await fetchProducts({ limit: 4 });
    return response.products;
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}

/**
 * Fetch order details by order ID from backend.
 */
export async function fetchOrderById(id: string): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/v1/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch order: ${res.statusText}`);
  }

  const result = await res.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch order");
  }

  const o = result.data;
  return {
    id: o.orderId || o._id,
    status: o.status || o.orderStatus || "Pending",
    paymentStatus: o.paymentStatus || "Unpaid",
    createdAt: new Date(o.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    shippingAddress: {
      id: o.shippingAddress?._id || "addr-1",
      firstName: o.shippingAddress?.fullName?.split(" ")[0] || "",
      lastName: o.shippingAddress?.fullName?.split(" ").slice(1).join(" ") || "",
      phone: o.shippingAddress?.phone || "",
      street: o.shippingAddress?.street || "",
      city: o.shippingAddress?.city || "",
      state: o.shippingAddress?.state || "",
      country: o.shippingAddress?.country || "US",
      postalCode: o.shippingAddress?.zipCode || "",
    },
    items: (o.items || []).map((item: any, idx: number) => ({
      productId: item.productId,
      name: item.productName || item.name || `Product #${idx + 1}`,
      image: item.image || item.imageUrl || "/iphone17.png",
      quantity: item.quantity,
      price: item.price,
      variant: item.variant || "Standard",
    })),
    subtotal: o.pricing?.subtotal || o.totalAmount || 0,
    discount: o.pricing?.discount || 0,
    shipping: o.pricing?.shippingFee || 0,
    tax: o.pricing?.tax || 0,
    total: o.pricing?.total || o.totalAmount || 0,
  };
}

/**
 * Fetch logistics tracking information by Order ID.
 */
export async function fetchTrackingById(orderId: string): Promise<Tracking> {
  // Try to fetch real order first to get status
  try {
    const order = await fetchOrderById(orderId);
    return {
      orderId,
      status: order.status,
      currentLocation: order.status === "DELIVERED" ? "Delivered" : "In Transit",
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-US"),
      history: [
        {
          status: order.status,
          location: "Carrier Facility",
          timestamp: new Date().toLocaleTimeString(),
          description: `Order is currently ${order.status}`,
        }
      ],
    };
  } catch (error) {
    throw new Error("Failed to fetch tracking data");
  }
}

/**
 * Fetch list of customer orders from backend.
 */
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/v1/orders/my-orders`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.success && Array.isArray(data.data)) {
    return data.data.map((o: any) => ({
      id: o.orderId || o._id,
      status: o.status || o.orderStatus || "Pending",
      paymentStatus: o.paymentStatus || "Unpaid",
      createdAt: new Date(o.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      shippingAddress: {
        id: o.shippingAddress?._id || "addr-1",
        firstName: o.shippingAddress?.fullName?.split(" ")[0] || "",
        lastName: o.shippingAddress?.fullName?.split(" ").slice(1).join(" ") || "",
        phone: o.shippingAddress?.phone || "",
        street: o.shippingAddress?.street || "",
        city: o.shippingAddress?.city || "",
        state: o.shippingAddress?.state || "",
        country: o.shippingAddress?.country || "US",
        postalCode: o.shippingAddress?.zipCode || "",
      },
      items: (o.items || []).map((item: any, idx: number) => ({
        productId: item.productId,
        name: item.productName || item.name || `Product #${idx + 1}`,
        image: item.image || item.imageUrl || "/iphone17.png",
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || "Standard",
      })),
      subtotal: o.pricing?.subtotal || o.totalAmount || 0,
      discount: o.pricing?.discount || 0,
      shipping: o.pricing?.shippingFee || 0,
      tax: o.pricing?.tax || 0,
      total: o.pricing?.total || o.totalAmount || 0,
    }));
  }
  
  throw new Error(data.message || "Failed to fetch orders");
}

/**
 * Request cancel order.
 */
export async function cancelOrderApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/orders/${id}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ reason: "Customer requested cancellation" }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to cancel order: ${res.statusText}`);
  }
  
  // Update local store as well
  useOrderStore.getState().cancelOrder(id);
}

/**
 * Request return order.
 */
export async function returnOrderApi(id: string, payload: { reason: string; description: string }): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/orders/${id}/return`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to return order: ${res.statusText}`);
  }
  
  useOrderStore.getState().returnOrder(id, payload.reason, payload.description);
}

/**
 * Fetch wishlist items.
 */
export async function fetchWishlist() {
  // Wishlist API doesn't exist on backend yet, returning empty array
  // Wishlist store uses localStorage for persistence
  return [];
}

/**
 * Register stock alert notification for products.
 */
export async function registerStockAlert(productId: string): Promise<void> {
  // No-op for now
}

export async function fetchNotifications(): Promise<Notification[]> {
  // Backend doesn't have a notification endpoint yet
  return [];
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  return {
    email: true,
    push: true,
    orders: true,
    promotions: false,
    security: true
  };
}

export async function updateNotificationSettingsApi(settings: NotificationSettings): Promise<NotificationSettings> {
  return settings;
}

export async function markNotificationReadApi(id: string): Promise<void> {}
export async function deleteNotificationApi(id: string): Promise<void> {}
export async function clearNotificationsApi(): Promise<void> {}

