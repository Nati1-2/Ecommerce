import { Product } from "@/types";
import { useOrderStore } from "@/store/orderStore";
import { mockProducts } from "@/data/mock";

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

/**
 * Retrieves products via Next.js Serverless API Route with fallback to client data.
 */
export async function fetchProducts(params: GetProductsParams): Promise<ProductsResponse> {
  try {
    const url = new URL("/api/products", typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    if (params.category) {
      const cat = Array.isArray(params.category) ? params.category[0] : params.category;
      url.searchParams.set("category", cat);
    }
    if (params.search) url.searchParams.set("search", params.search);
    if (params.page) url.searchParams.set("page", params.page.toString());
    if (params.limit) url.searchParams.set("limit", params.limit.toString());

    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        return data;
      }
    }
  } catch {}

  // Fallback to client mock data
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockProducts];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (params.category) {
    const categories = Array.isArray(params.category) ? params.category : [params.category];
    if (categories.length > 0) {
      filtered = filtered.filter((p) =>
        categories.some((c) => p.category.toLowerCase() === c.toLowerCase())
      );
    }
  }

  if (params.brands && params.brands.length > 0) {
    filtered = filtered.filter((p) =>
      params.brands!.some((b) => p.brand.toLowerCase() === b.toLowerCase())
    );
  }

  if (params.priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.priceMax!);
  }

  if (params.rating) {
    filtered = filtered.filter((p) => p.rating >= params.rating!);
  }

  if (params.inStock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === params.inStock);
  }

  if (params.discount) {
    filtered = filtered.filter((p) => p.discount >= params.discount!);
  }

  if (params.sort) {
    switch (params.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (a.badge === "new" ? -1 : 1));
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  } else {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const page = params.page || 1;
  const limit = params.limit || 8;
  const startIndex = (page - 1) * limit;
  const total = filtered.length;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    products: items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * Fetch a single product by its ID or slug.
 */
export async function fetchProductById(idOrSlug: string): Promise<Product | null> {
  try {
    const url = new URL(`/api/products/${idOrSlug}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) return data;
    }
  } catch {}

  await new Promise((resolve) => setTimeout(resolve, 200));
  const product = mockProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  return product || null;
}

/**
 * Fetch related products in the same category.
 */
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = mockProducts.find((p) => p.id === productId);
  if (!current) return [];
  
  return mockProducts
    .filter((p) => p.category === current.category && p.id !== current.id)
    .slice(0, 4);
}

/**
 * Fetch generic recommendations.
 */
export async function fetchRecommendations(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockProducts.slice(0, 4);
}

/**
 * Fetch mock order details by order ID.
 */
import { Order } from "@/types";

export async function fetchOrderById(id: string): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    id,
    status: "Preparing shipment",
    paymentStatus: "Paid",
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    shippingAddress: {
      id: "addr-1",
      firstName: "John",
      lastName: "Smith",
      phone: "+1 (555) 019-2834",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
    },
    items: [
      {
        productId: "0",
        name: "Apple iPhone 17 Pro",
        image: "/iphone17.png",
        quantity: 1,
        price: 1199,
        variant: "Sunset Orange, 256GB",
      },
      {
        productId: "1",
        name: "Sony WH-1000XM6 Headphones",
        image: "/headphones.png",
        quantity: 1,
        price: 399,
        variant: "Midnight Blue",
      },
    ],
    subtotal: 1598,
    discount: 100,
    shipping: 0,
    tax: 79.9,
    total: 1577.9,
  };
}

/**
 * Fetch mock logistics tracking information by Order ID.
 */
import { Tracking } from "@/types";

export async function fetchTrackingById(orderId: string): Promise<Tracking> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    orderId,
    status: "Out for Delivery",
    currentLocation: "Paris Distribution Center",
    estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    history: [
      {
        status: "Out for Delivery",
        location: "Paris Distribution Center",
        timestamp: "10:30 AM",
        description: "Package is with the courier for local delivery.",
      },
      {
        status: "Shipped",
        location: "Regional Hub Facility",
        timestamp: "8:00 AM",
        description: "Customs cleared and departed facility.",
      },
      {
        status: "Order Processing",
        location: "Fulfillment Warehouse",
        timestamp: "Yesterday, 4:15 PM",
        description: "Packed and sorted at sorting center.",
      },
      {
        status: "Payment Confirmed",
        location: "Stripe Checkout Gateway",
        timestamp: "Yesterday, 3:45 PM",
        description: "Transaction confirmed successfully.",
      },
      {
        status: "Order Placed",
        location: "Aura Store Server",
        timestamp: "Yesterday, 3:40 PM",
        description: "Order entry successfully completed.",
      },
    ],
  };
}

/**
 * Fetch list of customer orders.
 */
export async function fetchOrders(): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return useOrderStore.getState().orders;
}

/**
 * Request cancel order.
 */
export async function cancelOrderApi(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  useOrderStore.getState().cancelOrder(id);
}

/**
 * Request return order.
 */
export async function returnOrderApi(id: string, payload: { reason: string; description: string }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  useOrderStore.getState().returnOrder(id, payload.reason, payload.description);
}

/**
 * Fetch wishlist items.
 */
export async function fetchWishlist() {
  await new Promise((r) => setTimeout(r, 200));
  return [];
}

/**
 * Register stock alert notification for products.
 */
export async function registerStockAlert(productId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

/**
 * Fetch mock notifications
 */
import { Notification, NotificationSettings } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "ORDER",
    title: "Order Shipped",
    message: "Your iPhone 16 Pro has been shipped and is on the way.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    orderId: "ORD-123456",
    actionUrl: "/orders/ORD-123456/tracking"
  },
  {
    id: "notif-2",
    type: "PAYMENT",
    title: "Payment Successful",
    message: "Your payment of $999.00 was successfully processed.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    orderId: "ORD-123456"
  },
  {
    id: "notif-3",
    type: "PROMOTION",
    title: "Flash Sale Alert",
    message: "Get 20% off on all accessories this weekend only!",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    actionUrl: "/products"
  },
  {
    id: "notif-4",
    type: "SECURITY",
    title: "New Login Detected",
    message: "We noticed a new login from Chrome on Windows in California.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    actionUrl: "/profile"
  },
  {
    id: "notif-5",
    type: "SYSTEM",
    title: "Scheduled Maintenance",
    message: "Our platform will be undergoing scheduled maintenance on Sunday at 2 AM EST.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  }
];

export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [...mockNotifications];
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    email: true,
    push: true,
    orders: true,
    promotions: false,
    security: true
  };
}

export async function updateNotificationSettingsApi(settings: NotificationSettings): Promise<NotificationSettings> {
  await new Promise((r) => setTimeout(r, 300));
  return settings;
}

export async function markNotificationReadApi(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function deleteNotificationApi(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function clearNotificationsApi(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}
