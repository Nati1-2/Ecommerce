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
 * Simulates a production Axios request to retrieve and filter products.
 * Uses a realistic network latency delay.
 */
export async function fetchProducts(params: GetProductsParams): Promise<ProductsResponse> {
  // Simulate network latency (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...mockProducts];

  // 1. Search Query
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (params.category) {
    const categories = Array.isArray(params.category) ? params.category : [params.category];
    if (categories.length > 0) {
      filtered = filtered.filter((p) =>
        categories.some((c) => p.category.toLowerCase() === c.toLowerCase())
      );
    }
  }

  // 3. Brand Filter
  if (params.brands && params.brands.length > 0) {
    filtered = filtered.filter((p) =>
      params.brands!.some((b) => p.brand.toLowerCase() === b.toLowerCase())
    );
  }

  // 4. Price Range Filter
  if (params.priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.priceMax!);
  }

  // 5. Rating Filter
  if (params.rating) {
    filtered = filtered.filter((p) => p.rating >= params.rating!);
  }

  // 6. Availability Filter
  if (params.inStock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === params.inStock);
  }

  // 7. Discount Filter
  if (params.discount) {
    filtered = filtered.filter((p) => p.discount >= params.discount!);
  }

  // 8. Sorting
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
    // Default sort by rating count
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  // 9. Pagination
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  const product = mockProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  return product || null;
}

/**
 * Fetch related products in the same category.
 */
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts.slice(0, 4);
}

/**
 * Fetch mock order details by order ID.
 */
import { Order } from "@/types";

export async function fetchOrderById(id: string): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // If order id doesn't exist, we fall back to generic mock values
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
  await new Promise((resolve) => setTimeout(resolve, 400));

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
  await new Promise((resolve) => setTimeout(resolve, 300));
  return useOrderStore.getState().orders;
}

/**
 * Request cancel order.
 */
export async function cancelOrderApi(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  useOrderStore.getState().cancelOrder(id);
}

/**
 * Request return order.
 */
export async function returnOrderApi(id: string, payload: { reason: string; description: string }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  useOrderStore.getState().returnOrder(id, payload.reason, payload.description);
}

/**
 * Fetch wishlist items.
 */
export async function fetchWishlist() {
  await new Promise((r) => setTimeout(r, 400));
  return [];
}

/**
 * Register stock alert notification for products.
 */
export async function registerStockAlert(productId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
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
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    orderId: "ORD-123456",
    actionUrl: "/orders/ORD-123456/tracking"
  },
  {
    id: "notif-2",
    type: "PAYMENT",
    title: "Payment Successful",
    message: "Your payment of $999.00 was successfully processed.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    orderId: "ORD-123456"
  },
  {
    id: "notif-3",
    type: "PROMOTION",
    title: "Flash Sale Alert",
    message: "Get 20% off on all accessories this weekend only!",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    actionUrl: "/products"
  },
  {
    id: "notif-4",
    type: "SECURITY",
    title: "New Login Detected",
    message: "We noticed a new login from Chrome on Windows in California.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    actionUrl: "/profile"
  },
  {
    id: "notif-5",
    type: "SYSTEM",
    title: "Scheduled Maintenance",
    message: "Our platform will be undergoing scheduled maintenance on Sunday at 2 AM EST.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  }
];

export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [...mockNotifications];
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    email: true,
    push: true,
    orders: true,
    promotions: false,
    security: true
  };
}

export async function updateNotificationSettingsApi(settings: NotificationSettings): Promise<NotificationSettings> {
  await new Promise((r) => setTimeout(r, 600));
  return settings;
}

export async function markNotificationReadApi(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

export async function deleteNotificationApi(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

export async function clearNotificationsApi(): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
}
