export interface VendorProfile {
  id: string;
  storeName: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  productCount: number;
  joinedDate: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface VendorMetrics {
  totalRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  productsSold: number;
  productsSoldChangePercent: number;
  totalCustomers: number;
  customersChangePercent: number;
  pendingOrdersCount: number;
  processingOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Gray / 16GB / 512GB"
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface VendorProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  taxRate: number;
  stock: number;
  warehouseLocation: string;
  lowStockThreshold: number;
  status: "Active" | "Draft" | "Pending" | "Rejected";
  approvalMessage?: string;
  images: string[];
  variants: ProductVariant[];
  weightKg: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  deliveryTimeDays: string;
  seoTitle?: string;
  metaDescription?: string;
  salesCount: number;
  revenueGenerated: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  warehouse: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
}

export interface VendorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchaseDate: string;
  memberSince: string;
  status: "Active" | "VIP" | "Inactive";
}

export interface VendorReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  reply?: {
    text: string;
    repliedAt: string;
  };
  status: "Published" | "Hidden" | "Reported";
}

export interface DailyAnalyticsPoint {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
  conversionRate: number;
  views: number;
}

export interface CategorySalesData {
  category: string;
  revenue: number;
  sales: number;
}

export interface VendorAnalytics {
  dailyPerformance: DailyAnalyticsPoint[];
  categoryBreakdown: CategorySalesData[];
  conversionRate: number;
  averageOrderValue: number;
  repeatCustomerRate: number;
  topGeographicRegions: { region: string; sales: number; revenue: number }[];
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  type: "Sale" | "Payout" | "Refund";
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

export interface VendorPayout {
  id: string;
  amount: number;
  currency: string;
  status: "Paid" | "Processing" | "Pending" | "Failed";
  payoutMethod: string;
  bankAccountLast4: string;
  initiatedAt: string;
  estimatedArrival: string;
}

export interface VendorStoreSettings {
  storeName: string;
  logo: string;
  banner: string;
  description: string;
  email: string;
  phone: string;
  companyDetails: {
    legalName: string;
    taxId: string;
    registrationNumber: string;
    address: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressShippingFee: number;
    estimatedDeliveryDays: string;
    deliveryZones: string[];
  };
  returns: {
    returnWindowDays: number;
    policyText: string;
    allowRefunds: boolean;
  };
  tax: {
    vatNumber: string;
    taxRatePercent: number;
    pricesIncludeTax: boolean;
  };
  notifications: {
    emailOrderAlerts: boolean;
    smsOrderAlerts: boolean;
    payoutAlerts: boolean;
    lowStockAlerts: boolean;
    customerReviewAlerts: boolean;
  };
}
