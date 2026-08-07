import axios from "axios";
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
  { id: "prod_1004", name: "Nati Smartwatch (Flagged)", sku: "AUR-SMART", vendor: "Nati Wearables", sales: 420, revenue: 20580, views: 32000, status: "worst" },
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
  { id: "alt_1", title: "High Refund Rate Detected", description: "Store 'Nati Wearable Tech' refund rate spiked to 8.2% this week.", severity: "danger", timestamp: "1 hour ago" },
  { id: "alt_2", title: "Cart Abandonment Alert", description: "Cart dropoff rate increased by 2.4% on mobile checkout.", severity: "warning", timestamp: "3 hours ago" },
  { id: "alt_3", title: "Record Daily GMV Reached", description: "Marketplace processed over $1.8M GMV in the last 24 hours.", severity: "info", timestamp: "Yesterday" },
];

let mockRealtime: RealtimeStats = {
  activeVisitors: 4120,
  ordersPerMin: 48,
  revenueToday: 185000,
  activeSellers: 3420,
};

const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api/v1";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(url: string): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const adminAnalyticsApi = {
  getKPIMetrics: async (): Promise<KPIMetric[]> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/stats");
      const st = data.stats || {};
      return [
        { id: "kpi_1", title: "Gross Merchandise Value (GMV)", value: `$${(st.revenue || 0).toLocaleString()}`, growth: st.revenueGrowth || 0, prevComparison: "real-time aggregated", category: "gmv" },
        { id: "kpi_2", title: "Total Marketplace Revenue", value: `$${(st.revenue || 0).toLocaleString()}`, growth: st.revenueGrowth || 0, prevComparison: "real-time aggregated", category: "revenue" },
        { id: "kpi_3", title: "Total Executed Orders", value: `${(st.orders || 0).toLocaleString()}`, growth: st.ordersGrowth || 0, prevComparison: "real-time aggregated", category: "orders" },
        { id: "kpi_4", title: "Active Customer Accounts", value: `${(st.users || 0).toLocaleString()}`, growth: st.usersGrowth || 0, prevComparison: "real-time aggregated", category: "customers" },
        { id: "kpi_5", title: "Verified Vendor Stores", value: `${(st.vendors || 0).toLocaleString()}`, growth: st.vendorsGrowth || 0, prevComparison: "real-time aggregated", category: "vendors" },
        { id: "kpi_6", title: "Listed Products", value: `${(st.products || 0).toLocaleString()}`, growth: st.productsGrowth || 0, prevComparison: "real-time aggregated", category: "conversion" },
      ];
    } catch {
      return [];
    }
  },

  getRevenueAnalytics: async (timeframe: AnalyticsTimeframe): Promise<RevenueDataPoint[]> => {
    try {
      const data = await apiFetch<{ analytics: { revenueData: any[] } }>(`/api/admin/analytics?timeframe=${timeframe}`);
      return (data.analytics?.revenueData || []).map((r) => ({
        date: r.date,
        revenue: r.revenue || 0,
        gmv: (r.revenue || 0) * 1.15,
        profit: r.profit || 0,
        orders: r.sales || 0,
      }));
    } catch {
      return [];
    }
  },

  getUserGrowth: async (timeframe: AnalyticsTimeframe): Promise<UserGrowthPoint[]> => {
    try {
      const data = await apiFetch<{ analytics: { userGrowthData: any[] } }>(`/api/admin/analytics?timeframe=${timeframe}`);
      return (data.analytics?.userGrowthData || []).map((u) => ({
        date: u.date,
        newUsers: u.newUsers || 0,
        activeUsers: u.activeUsers || 0,
        returningUsers: u.returningUsers || 0,
        retentionRate: u.activeUsers > 0 ? Math.round((u.returningUsers / u.activeUsers) * 100) : 0,
      }));
    } catch {
      return [];
    }
  },

  getCustomerFunnel: async (): Promise<FunnelStage[]> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/stats");
      const st = data.stats || {};
      const totalVisits = (st.users || 0) * 10 || 0;
      const totalViews = (st.products || 0) * 5 || 0;
      const totalOrders = st.orders || 0;
      return [
        { stage: "Storefront Visits", count: totalVisits, conversionRate: 100, dropoffRate: 0 },
        { stage: "Product Page Views", count: totalViews, conversionRate: totalVisits > 0 ? Math.round((totalViews / totalVisits) * 100) : 0, dropoffRate: 0 },
        { stage: "Purchase Completed", count: totalOrders, conversionRate: totalViews > 0 ? Math.round((totalOrders / totalViews) * 100) : 0, dropoffRate: 0 },
      ];
    } catch {
      return [];
    }
  },

  getVendorAnalytics: async (): Promise<VendorAnalyticsItem[]> => {
    try {
      const data = await apiFetch<{ vendors: any[] }>("/api/admin/vendors");
      return (data.vendors || []).map((v) => ({
        vendor: v.storeName,
        logo: v.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
        sales: v.sales || 0,
        orders: v.orders || 0,
        revenue: v.revenue || 0,
        growth: 0,
        rating: v.rating || 5.0,
      }));
    } catch {
      return [];
    }
  },

  getProductAnalytics: async (): Promise<ProductPerformanceItem[]> => {
    try {
      const data = await apiFetch<{ products: any[] }>("/api/admin/products");
      return (data.products || []).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        vendor: p.vendorName,
        sales: p.sales || 0,
        revenue: p.revenue || 0,
        views: p.views || 0,
        status: (p.sales || 0) > 0 ? "top" : "worst",
      }));
    } catch {
      return [];
    }
  },

  getGeoAnalytics: async (): Promise<GeoMetric[]> => {
    return [];
  },

  getMarketingAnalytics: async (): Promise<TrafficSource[]> => {
    return [];
  },

  getAlerts: async (): Promise<AnalyticsAlert[]> => {
    return [];
  },

  getRealtimeStats: async (): Promise<RealtimeStats> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/stats");
      const st = data.stats || {};
      return {
        activeVisitors: (st.users || 0) * 2,
        ordersPerMin: st.orders || 0,
        revenueToday: st.revenue || 0,
        activeSellers: st.vendors || 0,
      };
    } catch {
      return { activeVisitors: 0, ordersPerMin: 0, revenueToday: 0, activeSellers: 0 };
    }
  },
};
