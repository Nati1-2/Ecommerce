import {
  PlatformStats,
  SystemStatus,
  AdminVendor,
  AdminProduct,
  AdminOrder,
  AdminPayment,
  ActivityItem,
  MarketplaceHealthData,
  AdminAnalyticsData,
} from "@/types/admin";

// MOCK DATA STORAGE FOR ADMIN CONTROL CENTER
let mockStats: PlatformStats = {
  users: 125000,
  usersGrowth: 15.8,
  vendors: 4500,
  vendorsGrowth: 8.2,
  products: 850000,
  productsGrowth: 12.4,
  orders: 320000,
  ordersGrowth: 18.5,
  revenue: 12500000,
  revenueGrowth: 22.1,
};

let mockSystemStatus: SystemStatus = {
  api: "Healthy",
  database: "Connected",
  redis: "Running",
  rabbitmq: "Connected",
  microservices: [
    { name: "Auth Service", status: "Healthy", latencyMs: 14, uptimePercent: 99.99 },
    { name: "Product Service", status: "Healthy", latencyMs: 22, uptimePercent: 99.98 },
    { name: "Order Service", status: "Healthy", latencyMs: 18, uptimePercent: 99.95 },
    { name: "Payment Service", status: "Healthy", latencyMs: 31, uptimePercent: 99.99 },
    { name: "Analytics Service", status: "Healthy", latencyMs: 45, uptimePercent: 99.90 },
    { name: "Notification Service", status: "Healthy", latencyMs: 12, uptimePercent: 100 },
  ],
};

let mockMarketplaceHealth: MarketplaceHealthData = {
  activeVendors: 4320,
  pendingVendors: 180,
  pendingProducts: 1420,
  customerComplaints: 24,
  refundRequests: 42,
};

let mockVendors: AdminVendor[] = [
  {
    id: "v_101",
    storeName: "Apex Tech Labs",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    ownerName: "Alexander Vance",
    email: "alexander@apextech.io",
    sales: 14200,
    revenue: 3450000,
    rating: 4.9,
    orders: 8900,
    joinedDate: "2023-04-12",
    status: "Active",
  },
  {
    id: "v_102",
    storeName: "Quantum Sound Audio",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
    ownerName: "Sophia Martinez",
    email: "sophia@quantumaudio.com",
    sales: 11800,
    revenue: 2150000,
    rating: 4.8,
    orders: 7400,
    joinedDate: "2023-08-19",
    status: "Active",
  },
  {
    id: "v_103",
    storeName: "Lumina Vision Gear",
    logo: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=150&q=80",
    ownerName: "Marcus Sterling",
    email: "marcus@luminavision.com",
    sales: 9400,
    revenue: 1890000,
    rating: 4.7,
    orders: 5800,
    joinedDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "v_104",
    storeName: "Hyperion Ergonomics",
    logo: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=150&q=80",
    ownerName: "Elena Rostova",
    email: "elena@hyperionergo.dev",
    sales: 6200,
    revenue: 1120000,
    rating: 4.6,
    orders: 3900,
    joinedDate: "2024-05-10",
    status: "Pending",
  },
];

let mockProducts: AdminProduct[] = [
  {
    id: "p_801",
    name: "UltraBook Pro M3 Max 16-inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    vendorName: "Apex Tech Labs",
    sku: "UBP-M3M-16",
    category: "Laptops & Workstations",
    price: 2499.00,
    sales: 3820,
    revenue: 9546180,
    views: 48200,
    status: "Approved",
  },
  {
    id: "p_802",
    name: "SonicPro Wireless ANC Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
    vendorName: "Quantum Sound Audio",
    sku: "SP-ANC-BLK",
    category: "Audio Equipment",
    price: 349.99,
    sales: 8400,
    revenue: 2939916,
    views: 92400,
    status: "Approved",
  },
  {
    id: "p_803",
    name: "Quantum OLED Curved Gaming Monitor 34\"",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80",
    vendorName: "Lumina Vision Gear",
    sku: "MON-34-OLED",
    category: "Displays & Monitors",
    price: 999.00,
    sales: 1950,
    revenue: 1948050,
    views: 31800,
    status: "Approved",
  },
  {
    id: "p_804",
    name: "Aura Noise-Canceling Earbuds Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80",
    vendorName: "SoundSphere Ltd",
    sku: "EAR-AURA-PRO",
    category: "Audio Equipment",
    price: 199.00,
    sales: 120,
    revenue: 23880,
    views: 14200,
    status: "Reported",
  },
];

let mockOrders: AdminOrder[] = [
  {
    id: "ord_9901",
    orderNumber: "ORD-ADMIN-9901",
    customerName: "Sarah Jenkins",
    vendorName: "Apex Tech Labs",
    totalAmount: 2499.00,
    paymentMethod: "Credit Card (Visa)",
    status: "Processing",
    createdAt: "10 mins ago",
  },
  {
    id: "ord_9902",
    orderNumber: "ORD-ADMIN-9902",
    customerName: "Michael Chen",
    vendorName: "Quantum Sound Audio",
    totalAmount: 699.98,
    paymentMethod: "Apple Pay",
    status: "Pending",
    createdAt: "28 mins ago",
  },
  {
    id: "ord_9903",
    orderNumber: "ORD-ADMIN-9903",
    customerName: "David Miller",
    vendorName: "Lumina Vision Gear",
    totalAmount: 999.00,
    paymentMethod: "PayPal",
    status: "Shipped",
    createdAt: "1 hour ago",
  },
  {
    id: "ord_9904",
    orderNumber: "ORD-ADMIN-9904",
    customerName: "Elena Rostova",
    vendorName: "Apex Tech Labs",
    totalAmount: 149.00,
    paymentMethod: "Credit Card (Mastercard)",
    status: "Delivered",
    createdAt: "3 hours ago",
  },
];

let mockPaymentSummary: AdminPayment = {
  totalTransactions: 320000,
  successfulPayments: 316800,
  failedPayments: 3200,
  refundsProcessed: 1450,
  pendingPayoutsAmount: 1480000,
  gatewayStatus: "Online",
};

let mockActivities: ActivityItem[] = [
  {
    id: "act_1",
    user: "Admin Team",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    action: "Approved seller onboarding for Hyperion Ergonomics",
    timestamp: "12 mins ago",
    category: "vendor",
  },
  {
    id: "act_2",
    user: "System Monitor",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    action: "Processed Stripe Payout batch #PO-8812 for $340,000",
    timestamp: "45 mins ago",
    category: "payment",
  },
  {
    id: "act_3",
    user: "Compliance Desk",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    action: "Flagged product listing 'Aura Earbuds Pro' for copyright review",
    timestamp: "2 hours ago",
    category: "product",
  },
  {
    id: "act_4",
    user: "Security Guard",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    action: "Blocked suspicious IP 192.168.1.100 due to failed auth attempts",
    timestamp: "4 hours ago",
    category: "system",
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminApi = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    await delay(200);
    return { ...mockStats };
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    await delay(150);
    return { ...mockSystemStatus };
  },

  getMarketplaceHealth: async (): Promise<MarketplaceHealthData> => {
    await delay(200);
    return { ...mockMarketplaceHealth };
  },

  getVendors: async (): Promise<AdminVendor[]> => {
    await delay(250);
    return [...mockVendors];
  },

  getProducts: async (): Promise<AdminProduct[]> => {
    await delay(250);
    return [...mockProducts];
  },

  getOrders: async (): Promise<AdminOrder[]> => {
    await delay(200);
    return [...mockOrders];
  },

  getPayments: async (): Promise<AdminPayment> => {
    await delay(200);
    return { ...mockPaymentSummary };
  },

  getActivityLogs: async (): Promise<ActivityItem[]> => {
    await delay(200);
    return [...mockActivities];
  },

  getAnalytics: async (timeframe: string): Promise<AdminAnalyticsData> => {
    await delay(300);
    const revenueData = [
      { date: "Jan", revenue: 840000, sales: 24000, profit: 168000 },
      { date: "Feb", revenue: 920000, sales: 26500, profit: 184000 },
      { date: "Mar", revenue: 1050000, sales: 29800, profit: 210000 },
      { date: "Apr", revenue: 1120000, sales: 31200, profit: 224000 },
      { date: "May", revenue: 1280000, sales: 35400, profit: 256000 },
      { date: "Jun", revenue: 1410000, sales: 38900, profit: 282000 },
      { date: "Jul", revenue: 1650000, sales: 44200, profit: 330000 },
    ];

    const userGrowthData = [
      { date: "Mon", newUsers: 420, activeUsers: 18400, returningUsers: 14200 },
      { date: "Tue", newUsers: 510, activeUsers: 21200, returningUsers: 16100 },
      { date: "Wed", newUsers: 620, activeUsers: 24800, returningUsers: 18900 },
      { date: "Thu", newUsers: 580, activeUsers: 23500, returningUsers: 17800 },
      { date: "Fri", newUsers: 740, activeUsers: 28900, returningUsers: 21500 },
      { date: "Sat", newUsers: 890, activeUsers: 34200, returningUsers: 25400 },
      { date: "Sun", newUsers: 950, activeUsers: 36800, returningUsers: 27800 },
    ];

    return {
      timeframe: timeframe as any,
      revenueData,
      userGrowthData,
    };
  },

  approveVendor: async (id: string): Promise<boolean> => {
    await delay(300);
    const v = mockVendors.find((item) => item.id === id);
    if (v) {
      v.status = "Active";
      mockMarketplaceHealth.pendingVendors = Math.max(0, mockMarketplaceHealth.pendingVendors - 1);
      mockMarketplaceHealth.activeVendors += 1;
    }
    return true;
  },

  approveProduct: async (id: string): Promise<boolean> => {
    await delay(300);
    const p = mockProducts.find((item) => item.id === id);
    if (p) {
      p.status = "Approved";
      mockMarketplaceHealth.pendingProducts = Math.max(0, mockMarketplaceHealth.pendingProducts - 1);
    }
    return true;
  },

  broadcastAnnouncement: async (message: string): Promise<boolean> => {
    await delay(400);
    mockActivities.unshift({
      id: `act_${Date.now()}`,
      user: "Platform Admin",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      action: `Broadcasted platform announcement: "${message}"`,
      timestamp: "Just now",
      category: "system",
    });
    return true;
  },
};
