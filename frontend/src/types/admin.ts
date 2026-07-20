export interface PlatformStats {
  users: number;
  usersGrowth: number;
  vendors: number;
  vendorsGrowth: number;
  products: number;
  productsGrowth: number;
  orders: number;
  ordersGrowth: number;
  revenue: number;
  revenueGrowth: number;
}

export interface ServiceHealth {
  name: string;
  status: "Healthy" | "Degraded" | "Down" | "Connected" | "Running";
  latencyMs: number;
  uptimePercent: number;
}

export interface SystemStatus {
  api: string;
  database: string;
  redis: string;
  rabbitmq: string;
  microservices: ServiceHealth[];
}

export interface AdminVendor {
  id: string;
  storeName: string;
  logo: string;
  ownerName: string;
  email: string;
  sales: number;
  revenue: number;
  rating: number;
  orders: number;
  joinedDate: string;
  status: "Active" | "Pending" | "Suspended";
}

export interface AdminProduct {
  id: string;
  name: string;
  image: string;
  vendorName: string;
  sku: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  views: number;
  status: "Approved" | "Pending" | "Reported";
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  vendorName: string;
  totalAmount: number;
  paymentMethod: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface AdminPayment {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  refundsProcessed: number;
  pendingPayoutsAmount: number;
  gatewayStatus: "Online" | "Degraded" | "Maintenance";
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  timestamp: string;
  category: "vendor" | "product" | "user" | "payment" | "system";
}

export interface AdminNotification {
  id: string;
  type: "NEW_VENDOR" | "LARGE_ORDER" | "PAYMENT_FAILED" | "PRODUCT_REPORTED" | "SYSTEM_ALERT";
  title: string;
  message: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "success";
  read: boolean;
}

export interface MarketplaceHealthData {
  activeVendors: number;
  pendingVendors: number;
  pendingProducts: number;
  customerComplaints: number;
  refundRequests: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  sales: number;
  profit: number;
}

export interface UserGrowthPoint {
  date: string;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
}

export interface AdminAnalyticsData {
  timeframe: "Today" | "7d" | "30d" | "Year";
  revenueData: RevenuePoint[];
  userGrowthData: UserGrowthPoint[];
}
