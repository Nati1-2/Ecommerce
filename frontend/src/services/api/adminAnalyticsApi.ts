import {
  KPIMetric,
  RevenueDataPoint,
  UserGrowthPoint,
  FunnelStage,
  VendorAnalyticsItem,
  ProductPerformanceItem,
  GeoMetric,
  TrafficSource,
  AnalyticsAlert,
  RealtimeStats,
  AnalyticsTimeframe,
} from "@/types/adminAnalytics";

let mockKPIMetrics: KPIMetric[] = [
  { id: "kpi_1", title: "Gross Merchandise Value (GMV)", value: "$50.0M", growth: 24.5, prevComparison: "vs $40.2M last period", category: "gmv" },
  { id: "kpi_2", title: "Total Marketplace Revenue", value: "$15.0M", growth: 22.1, prevComparison: "vs $12.3M last period", category: "revenue" },
  { id: "kpi_3", title: "Total Executed Orders", value: "1.2M", growth: 18.5, prevComparison: "vs 1.01M last period", category: "orders" },
  { id: "kpi_4", title: "Active Customer Accounts", value: "250K", growth: 15.8, prevComparison: "vs 215K last period", category: "customers" },
  { id: "kpi_5", title: "Verified Vendor Stores", value: "12.5K", growth: 14.2, prevComparison: "vs 10.9K last period", category: "vendors" },
  { id: "kpi_6", title: "Storefront Conversion Rate", value: "8.5%", growth: 1.4, prevComparison: "vs 7.1% last period", category: "conversion" },
];

let mockRevenueData: RevenueDataPoint[] = [
  { date: "Jan", revenue: 1200000, gmv: 4200000, profit: 450000, orders: 95000 },
  { date: "Feb", revenue: 1350000, gmv: 4600000, profit: 510000, orders: 102000 },
  { date: "Mar", revenue: 1280000, gmv: 4400000, profit: 480000, orders: 98000 },
  { date: "Apr", revenue: 1490000, gmv: 5100000, profit: 580000, orders: 115000 },
  { date: "May", revenue: 1650000, gmv: 5800000, profit: 640000, orders: 128000 },
  { date: "Jun", revenue: 1820000, gmv: 6400000, profit: 710000, orders: 142000 },
  { date: "Jul", revenue: 1950000, gmv: 6900000, profit: 780000, orders: 154000 },
];

let mockUserGrowth: UserGrowthPoint[] = [
  { date: "Week 1", newUsers: 14500, activeUsers: 185000, returningUsers: 140000, retentionRate: 76 },
  { date: "Week 2", newUsers: 16200, activeUsers: 198000, returningUsers: 152000, retentionRate: 77 },
  { date: "Week 3", newUsers: 15800, activeUsers: 210000, returningUsers: 164000, retentionRate: 78 },
  { date: "Week 4", newUsers: 18400, activeUsers: 250000, returningUsers: 195000, retentionRate: 78 },
];

let mockFunnel: FunnelStage[] = [
  { stage: "Storefront Visits", count: 1000000, conversionRate: 100, dropoffRate: 0 },
  { stage: "Product Page Views", count: 650000, conversionRate: 65, dropoffRate: 35 },
  { stage: "Add to Cart", count: 250000, conversionRate: 38.4, dropoffRate: 61.6 },
  { stage: "Initiate Checkout", count: 120000, conversionRate: 48, dropoffRate: 52 },
  { stage: "Purchase Completed", count: 85000, conversionRate: 70.8, dropoffRate: 29.2 },
];

let mockVendorLeaderboard: VendorAnalyticsItem[] = [
  { vendor: "Apex Tech Labs", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80", sales: 14200, orders: 8900, revenue: 3450000, growth: 24.8, rating: 4.9 },
  { vendor: "Quantum Sound Audio", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80", sales: 11800, orders: 7400, revenue: 2150000, growth: 18.2, rating: 4.8 },
  { vendor: "Hyperion Ergonomics", logo: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=150&q=80", sales: 6200, orders: 3900, revenue: 1120000, growth: 15.4, rating: 4.6 },
];

let mockProductPerformance: ProductPerformanceItem[] = [
  { id: "prod_1001", name: "MacBook Pro 16-inch M3 Max", sku: "APX-M3-PRO", vendor: "Apex Tech Labs", sales: 3420, revenue: 11966580, views: 185000, status: "top" },
  { id: "prod_1002", name: "Quantum ANC Headphones Gen 2", sku: "QNT-ANC-900", vendor: "Quantum Sound", sales: 4890, revenue: 1709055, views: 142000, status: "top" },
  { id: "prod_1004", name: "Aura Smartwatch (Flagged)", sku: "AUR-SMART", vendor: "Aura Wearables", sales: 420, revenue: 20580, views: 32000, status: "worst" },
];

let mockGeoMetrics: GeoMetric[] = [
  { region: "North America", country: "United States & Canada", sales: 745000, customers: 145000, sharePercentage: 58 },
  { region: "Europe", country: "UK, Germany, France", sales: 310000, customers: 62000, sharePercentage: 24 },
  { region: "Asia Pacific", country: "Japan, Australia, Singapore", sales: 150000, customers: 31000, sharePercentage: 12 },
  { region: "Latin America & MEA", country: "Brazil, UAE", sales: 75000, customers: 12000, sharePercentage: 6 },
];

let mockTrafficSources: TrafficSource[] = [
  { channel: "Organic Search (Google / SEO)", visitors: 450000, conversions: 38250, cac: 0.00, roas: 12.4, share: 45 },
  { channel: "Paid Marketing (Google & Meta Ads)", visitors: 250000, conversions: 21250, cac: 18.50, roas: 4.8, share: 25 },
  { channel: "Social Media (Instagram / TikTok)", visitors: 180000, conversions: 15300, cac: 9.20, roas: 6.2, share: 18 },
  { channel: "Direct & Referral Traffic", visitors: 120000, conversions: 10200, cac: 2.10, roas: 9.5, share: 12 },
];

let mockAlerts: AnalyticsAlert[] = [
  { id: "alt_1", title: "High Refund Rate Detected", description: "Store 'Aura Wearable Tech' refund rate spiked to 8.2% this week.", severity: "danger", timestamp: "1 hour ago" },
  { id: "alt_2", title: "Cart Abandonment Alert", description: "Cart dropoff rate increased by 2.4% on mobile checkout.", severity: "warning", timestamp: "3 hours ago" },
  { id: "alt_3", title: "Record Daily GMV Reached", description: "Marketplace processed over $1.8M GMV in the last 24 hours.", severity: "info", timestamp: "Yesterday" },
];

let mockRealtime: RealtimeStats = {
  activeVisitors: 4120,
  ordersPerMin: 48,
  revenueToday: 185000,
  activeSellers: 3420,
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminAnalyticsApi = {
  getKPIMetrics: async (): Promise<KPIMetric[]> => {
    await delay(200);
    return [...mockKPIMetrics];
  },

  getRevenueAnalytics: async (timeframe: AnalyticsTimeframe): Promise<RevenueDataPoint[]> => {
    await delay(250);
    return [...mockRevenueData];
  },

  getUserGrowth: async (timeframe: AnalyticsTimeframe): Promise<UserGrowthPoint[]> => {
    await delay(200);
    return [...mockUserGrowth];
  },

  getCustomerFunnel: async (): Promise<FunnelStage[]> => {
    await delay(200);
    return [...mockFunnel];
  },

  getVendorAnalytics: async (): Promise<VendorAnalyticsItem[]> => {
    await delay(250);
    return [...mockVendorLeaderboard];
  },

  getProductAnalytics: async (): Promise<ProductPerformanceItem[]> => {
    await delay(200);
    return [...mockProductPerformance];
  },

  getGeoAnalytics: async (): Promise<GeoMetric[]> => {
    await delay(200);
    return [...mockGeoMetrics];
  },

  getMarketingAnalytics: async (): Promise<TrafficSource[]> => {
    await delay(200);
    return [...mockTrafficSources];
  },

  getAlerts: async (): Promise<AnalyticsAlert[]> => {
    await delay(200);
    return [...mockAlerts];
  },

  getRealtimeStats: async (): Promise<RealtimeStats> => {
    await delay(150);
    return { ...mockRealtime };
  },
};
