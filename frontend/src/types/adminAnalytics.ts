export type AnalyticsTimeframe = "Today" | "7 Days" | "30 Days" | "Quarter" | "Year";

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  growth: number;
  prevComparison: string;
  category: "gmv" | "revenue" | "orders" | "customers" | "vendors" | "conversion";
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  gmv: number;
  profit: number;
  orders: number;
}

export interface UserGrowthPoint {
  date: string;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  retentionRate: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
}

export interface VendorAnalyticsItem {
  vendor: string;
  logo: string;
  sales: number;
  orders: number;
  revenue: number;
  growth: number;
  rating: number;
}

export interface ProductPerformanceItem {
  id: string;
  name: string;
  sku: string;
  vendor: string;
  sales: number;
  revenue: number;
  views: number;
  status: "top" | "worst";
}

export interface GeoMetric {
  region: string;
  country: string;
  sales: number;
  customers: number;
  sharePercentage: number;
}

export interface TrafficSource {
  channel: string;
  visitors: number;
  conversions: number;
  cac: number;
  roas: number;
  share: number;
}

export interface AnalyticsAlert {
  id: string;
  title: string;
  description: string;
  severity: "danger" | "warning" | "info";
  timestamp: string;
}

export interface RealtimeStats {
  activeVisitors: number;
  ordersPerMin: number;
  revenueToday: number;
  activeSellers: number;
}
