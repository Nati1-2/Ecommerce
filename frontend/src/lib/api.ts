import { Product } from "@/types";
import { useOrderStore } from "@/store/orderStore";
import { Order, Tracking, Notification, NotificationSettings } from "@/types";
import { mockProducts } from "@/data/mock";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || (isLocalhost ? "http://localhost:8000/api" : "/api");

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
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("auth_token");
  if (stored && stored !== "undefined" && stored !== "null") {
    return { Authorization: `Bearer ${stored}` };
  }
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.accessToken;
      if (token && token !== "undefined" && token !== "null") {
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch (e) {
    // ignore
  }
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  const cookieToken = match ? decodeURIComponent(match[1]) : "";
  if (cookieToken && cookieToken !== "undefined" && cookieToken !== "null") {
    return { Authorization: `Bearer ${cookieToken}` };
  }
  return {};
};

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";

/**
 * Normalizes raw product records from MongoDB, microservices, or mocks
 * into a consistent, strongly-typed Product object.
 * Guarantees valid `id`, `image` string, and `images` string array.
 */
export function normalizeProduct(raw: any): Product {
  if (!raw) {
    return {
      id: "unknown",
      name: "Product",
      slug: "product",
      price: 0,
      originalPrice: 0,
      discount: 0,
      rating: 4.5,
      reviewCount: 0,
      image: DEFAULT_FALLBACK_IMAGE,
      images: [DEFAULT_FALLBACK_IMAGE],
      category: "General",
      brand: "Brand",
      inStock: true,
      description: "",
      stock: 0,
    };
  }

  const id = String(raw.id || raw._id || raw.productId || "");

  // 1. Process images array (supporting strings, objects with .url, or raw string)
  let rawImages: any[] = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    rawImages = raw.images;
  } else if (raw.image) {
    rawImages = [raw.image];
  } else if (raw.imageUrl) {
    rawImages = [raw.imageUrl];
  }

  const sanitizedImages: string[] = rawImages
    .map((img: any) => {
      if (typeof img === "string" && img.trim().length > 0) return img.trim();
      if (img && typeof img === "object") {
        if (typeof img.url === "string" && img.url.trim().length > 0) return img.url.trim();
        if (typeof img.src === "string" && img.src.trim().length > 0) return img.src.trim();
      }
      return "";
    })
    .filter((url) => Boolean(url) && url !== "[object Object]");

  // 2. Determine primary image
  const rawSingle =
    typeof raw.image === "string" && raw.image.trim().length > 0 && raw.image !== "[object Object]"
      ? raw.image.trim()
      : typeof raw.imageUrl === "string" && raw.imageUrl.trim().length > 0 && raw.imageUrl !== "[object Object]"
      ? raw.imageUrl.trim()
      : null;

  const mainImage = rawSingle || sanitizedImages[0] || DEFAULT_FALLBACK_IMAGE;

  if (sanitizedImages.length === 0) {
    sanitizedImages.push(mainImage);
  }

  // 3. Process numerical prices & discount
  const price = typeof raw.price === "number" ? raw.price : Number(raw.price) || 0;
  const originalPrice =
    typeof raw.originalPrice === "number"
      ? raw.originalPrice
      : typeof raw.compareAtPrice === "number"
      ? raw.compareAtPrice
      : typeof raw.discountPrice === "number" && raw.discountPrice > price
      ? raw.discountPrice
      : price;

  const discount =
    raw.discount !== undefined && raw.discount !== null
      ? Number(raw.discount)
      : originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return {
    id,
    name: String(raw.name || "Product"),
    slug: String(raw.slug || (raw.name ? raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : id)),
    price,
    originalPrice,
    discount,
    rating: typeof raw.rating === "number" ? raw.rating : 4.8,
    reviewCount: typeof raw.reviewCount === "number" ? raw.reviewCount : (raw.ratingsCount || 0),
    image: mainImage,
    images: sanitizedImages,
    category: String(raw.category || "General"),
    brand: String(raw.brand || "Brand"),
    badge: raw.badge,
    inStock: raw.inStock !== undefined ? Boolean(raw.inStock) : (raw.stock !== undefined ? raw.stock > 0 : true),
    description: String(raw.description || ""),
    features: Array.isArray(raw.features) ? raw.features : [],
    variants: Array.isArray(raw.variants) ? raw.variants : [],
    stock: typeof raw.stock === "number" ? raw.stock : 10,
  };
}

/**
 * Filters mock products in-memory when backend services are offline.
 */
function getFilteredMockProducts(params: GetProductsParams): ProductsResponse {
  let list = [...mockProducts];

  if (params.category) {
    const cats = Array.isArray(params.category) ? params.category : [params.category];
    const normalizedCats = cats.map((c) => c.toLowerCase());
    list = list.filter((p) => normalizedCats.includes(p.category.toLowerCase()));
  }

  if (params.brands && params.brands.length > 0) {
    const normalizedBrands = params.brands.map((b) => b.toLowerCase());
    list = list.filter((p) => normalizedBrands.includes(p.brand.toLowerCase()));
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (params.priceMin !== undefined) {
    list = list.filter((p) => p.price >= (params.priceMin ?? 0));
  }
  if (params.priceMax !== undefined) {
    list = list.filter((p) => p.price <= (params.priceMax ?? 999999));
  }

  if (params.rating !== undefined) {
    list = list.filter((p) => p.rating >= (params.rating ?? 0));
  }

  if (params.inStock) {
    list = list.filter((p) => p.inStock);
  }

  // Sorting
  if (params.sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (params.sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  const page = params.page || 1;
  const limit = params.limit || 8;
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = list.slice((page - 1) * limit, page * limit).map(normalizeProduct);

  return {
    products: paginated,
    total,
    page,
    totalPages,
  };
}

/**
 * Retrieves products via real backend API Route or Express gateway.
 */
export async function fetchProducts(params: GetProductsParams): Promise<ProductsResponse> {
  const parseProductsData = (data: any): ProductsResponse | null => {
    let rawList: any[] = [];
    let total = 0;
    let page = params.page || 1;
    let totalPages = 1;

    if (data?.products && Array.isArray(data.products)) {
      rawList = data.products;
      total = data.total ?? rawList.length;
      page = data.page ?? page;
      totalPages = data.totalPages ?? Math.max(1, Math.ceil(total / (params.limit || 8)));
    } else if (data?.success && data?.data) {
      if (Array.isArray(data.data.products)) {
        rawList = data.data.products;
        total = data.data.total ?? rawList.length;
        page = data.data.page ?? page;
        totalPages = data.data.totalPages ?? Math.max(1, Math.ceil(total / (params.limit || 8)));
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
        total = data.data.length;
        totalPages = Math.max(1, Math.ceil(total / (params.limit || 8)));
      }
    } else if (Array.isArray(data)) {
      rawList = data;
      total = data.length;
      totalPages = Math.max(1, Math.ceil(total / (params.limit || 8)));
    }

    if (rawList.length > 0) {
      return {
        products: rawList.map(normalizeProduct),
        total,
        page,
        totalPages,
      };
    }
    return null;
  };

  // 1. Try Express Gateway API
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

    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseProductsData(data);
      if (parsed && parsed.products.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Express Gateway fetchProducts unavailable, trying Next.js API route:", err);
  }

  // 2. Try Next.js internal API route (/api/products connected to MongoDB)
  try {
    const nextUrl = new URL(
      typeof window !== "undefined"
        ? `${window.location.origin}/api/products`
        : "http://localhost:3000/api/products"
    );
    if (params.category) {
      const cat = Array.isArray(params.category) ? params.category[0] : params.category;
      if (cat) nextUrl.searchParams.set("category", cat);
    }
    if (params.search) nextUrl.searchParams.set("search", params.search);
    if (params.page) nextUrl.searchParams.set("page", params.page.toString());
    if (params.limit) nextUrl.searchParams.set("limit", params.limit.toString());

    const res = await fetch(nextUrl.toString(), { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseProductsData(data);
      if (parsed && parsed.products.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Next.js internal /api/products unavailable:", err);
  }

  // 3. Resilient fallback to mock products so the catalog never breaks
  return getFilteredMockProducts(params);
}

/**
 * Fetch a single product by its ID or slug with robust normalization and fallback.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  if (!id) return null;

  // 1. Try Express Gateway API
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      const raw = data?.data || data?.product || (data && (data._id || data.id) ? data : null);
      if (raw) return normalizeProduct(raw);
    }
  } catch (err) {
    console.warn("Backend fetchProductById failed:", err);
  }

  // 2. Also try Next.js /api/products/[id] route
  try {
    const nextUrl = typeof window !== "undefined"
      ? `${window.location.origin}/api/products/${id}`
      : `http://localhost:3000/api/products/${id}`;
    const res = await fetch(nextUrl, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      const raw = data?.data || data?.product || (data && (data._id || data.id) ? data : null);
      if (raw) return normalizeProduct(raw);
    }
  } catch (err) {
    // ignore
  }

  // 3. Fallback to mock products by id or slug
  const mockMatch = mockProducts.find((p) => p.id === id || p.slug === id);
  if (mockMatch) {
    return normalizeProduct(mockMatch);
  }

  return null;
}

/**
 * Fetch related products in the same category.
 */
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const currentProduct = await fetchProductById(productId);
    if (!currentProduct || !currentProduct.category) return [];
    
    const response = await fetchProducts({ category: currentProduct.category, limit: 6 });
    const related = response.products.filter((p) => p.id !== productId).slice(0, 4);

    if (related.length > 0) return related;

    // If no category matches, fall back to top catalog products
    const general = await fetchProducts({ limit: 5 });
    return general.products.filter((p) => p.id !== productId).slice(0, 4);
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
  const mapOrder = (o: any): Order => ({
    id: o.orderId || o._id || id,
    status: o.status || o.orderStatus || "Processing",
    paymentStatus: o.paymentStatus || "Paid",
    createdAt: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    shippingAddress: {
      id: o.shippingAddress?._id || "addr-1",
      firstName: o.shippingAddress?.fullName?.split(" ")[0] || "Nati",
      lastName: o.shippingAddress?.fullName?.split(" ").slice(1).join(" ") || "Customer",
      phone: o.shippingAddress?.phone || "+1 (555) 019-2834",
      street: o.shippingAddress?.street || "742 Evergreen Terrace",
      city: o.shippingAddress?.city || "Springfield",
      state: o.shippingAddress?.state || "OR",
      country: o.shippingAddress?.country || "US",
      postalCode: o.shippingAddress?.zipCode || "97477",
    },
    items: (o.items || []).map((item: any, idx: number) => ({
      productId: item.productId || `prod-${idx}`,
      name: item.productName || item.name || `Product #${idx + 1}`,
      image: item.image || item.imageUrl || "/iphone17.png",
      quantity: item.quantity || 1,
      price: item.price || 99,
      variant: item.variant || "Standard",
    })),
    subtotal: o.pricing?.subtotal || o.totalAmount || 149.99,
    discount: o.pricing?.discount || 0,
    shipping: o.pricing?.shippingFee || 0,
    tax: o.pricing?.tax || 0,
    total: o.pricing?.total || o.totalAmount || 149.99,
  });

  // 1. Try Express Gateway API
  try {
    let url = `${API_BASE_URL}/v1/orders/${id}`;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionId = searchParams.get("session_id");
      if (sessionId) url += `?session_id=${sessionId}`;
    }
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return mapOrder(result.data);
    }
  } catch (err) {
    console.warn("Express Gateway fetchOrderById error, trying Next.js API route:", err);
  }

  // 2. Try Next.js internal API route (/api/orders/[id])
  try {
    let nextUrl = typeof window !== "undefined" 
      ? `${window.location.origin}/api/orders/${id}`
      : `http://localhost:3000/api/orders/${id}`;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionId = searchParams.get("session_id");
      if (sessionId) nextUrl += `?session_id=${sessionId}`;
    }
    const res = await fetch(nextUrl, { headers: getAuthHeaders() });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return mapOrder(result.data);
      if (result.data) return mapOrder(result.data);
    }
  } catch (err) {
    console.warn("Next.js internal fetchOrderById error:", err);
  }

  // Fallback to local orderStore
  const localOrder = useOrderStore.getState().orders.find((o) => o.id === id);
  if (localOrder) return localOrder;

  // Final structured fallback order
  return {
    id: id || "ORD-TEST-1001",
    status: "Processing",
    paymentStatus: "Paid",
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    shippingAddress: {
      id: "addr-fallback",
      firstName: "Nati",
      lastName: "Customer",
      phone: "+1 (555) 019-2834",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      country: "US",
      postalCode: "97477",
    },
    items: [
      {
        productId: "0",
        name: "Apple iPhone 17 Pro",
        image: "/iphone17.png",
        quantity: 1,
        price: 999,
        variant: "Deep Titanium",
      },
    ],
    subtotal: 999,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 999,
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
          description: `Order status updated to ${order.status}`,
        }
      ],
    };
  } catch (error) {
    // Return simulated tracking data fallback for arbitrary search inputs
    return {
      orderId,
      status: "Out for Delivery",
      currentLocation: "San Francisco Distribution Center",
      estimatedDelivery: new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      history: [
        {
          status: "Out for Delivery",
          location: "Courier Hub SF",
          timestamp: "09:30 AM",
          description: "Package is out with the courier for local delivery.",
        },
        {
          status: "Order Processing",
          location: "Regional Sorting Facility",
          timestamp: "04:15 AM",
          description: "Shipment sorted and loaded onto local delivery vehicle.",
        },
        {
          status: "Payment Confirmed",
          location: "Fulfillment Warehouse",
          timestamp: "10:00 PM (Yesterday)",
          description: "Order processed, payment authorized, and courier tracking number assigned.",
        },
      ],
    };
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

