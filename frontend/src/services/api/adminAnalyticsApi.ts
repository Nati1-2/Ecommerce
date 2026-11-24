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

function getToken(): string {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("auth_token");
  if (token) return token;
  try {
    const authStore = localStorage.getItem("auth-storage");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      if (parsed?.state?.accessToken) return parsed.state.accessToken;
    }
  } catch {}
  return "";
}

async function apiFetch<T>(url: string): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function formatCurrency(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const adminAnalyticsApi = {
  getKPIMetrics: async (): Promise<KPIMetric[]> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/stats");
      const st = data.stats || {};
      const rev = st.revenue || 0;
      const orders = st.orders || 0;
      const users = st.users || 0;
      const vendors = st.vendors || 0;
      const products = st.products || 0;
      const convRate = users > 0 ? `${((orders / users) * 100).toFixed(1)}%` : "0.0%";

      return [
        {
          id: "kpi_1",
          title: "Gross Merchandise Value (GMV)",
          value: formatCurrency(rev),
          growth: st.revenueGrowth ?? 0,
          prevComparison: "Live MongoDB ledger",
          category: "gmv",
        },
        {
          id: "kpi_2",
          title: "Total Marketplace Revenue",
          value: formatCurrency(Math.round(rev * 0.15 * 100) / 100),
          growth: st.revenueGrowth ?? 0,
          prevComparison: "15% platform take-rate",
          category: "revenue",
        },
        {
          id: "kpi_3",
          title: "Total Executed Orders",
          value: orders.toLocaleString(),
          growth: st.ordersGrowth ?? 0,
          prevComparison: "Completed purchases",
          category: "orders",
        },
        {
          id: "kpi_4",
          title: "Active Customer Accounts",
          value: users.toLocaleString(),
          growth: st.usersGrowth ?? 0,
          prevComparison: "Registered platform users",
          category: "customers",
        },
        {
          id: "kpi_5",
          title: "Verified Vendor Stores",
          value: vendors.toLocaleString(),
          growth: st.vendorsGrowth ?? 0,
          prevComparison: "Active merchant stores",
          category: "vendors",
        },
        {
          id: "kpi_6",
          title: "Catalog Listed Products",
          value: products.toLocaleString(),
          growth: st.productsGrowth ?? 0,
          prevComparison: "Active marketplace items",
          category: "conversion",
        },
      ];
    } catch {
      return [];
    }
  },

  getRevenueAnalytics: async (timeframe: AnalyticsTimeframe): Promise<RevenueDataPoint[]> => {
    try {
      const tfParam = timeframe === "30 Days" ? "30d" : timeframe === "7 Days" ? "7d" : "monthly";
      const data = await apiFetch<{ analytics: { revenueData: any[] } }>(`/api/admin/analytics?timeframe=${tfParam}`);
      return (data.analytics?.revenueData || []).map((r) => ({
        date: r.date,
        revenue: r.revenue || 0,
        gmv: Math.round((r.revenue || 0) * 100) / 100,
        profit: r.profit || Math.round((r.revenue || 0) * 0.15 * 100) / 100,
        orders: r.sales || 0,
      }));
    } catch {
      return [];
    }
  },

  getUserGrowth: async (timeframe: AnalyticsTimeframe): Promise<UserGrowthPoint[]> => {
    try {
      const tfParam = timeframe === "30 Days" ? "30d" : timeframe === "7 Days" ? "7d" : "monthly";
      const data = await apiFetch<{ analytics: { userGrowthData: any[] } }>(`/api/admin/analytics?timeframe=${tfParam}`);
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
      const [statsData, visitorsData] = await Promise.all([
        apiFetch<{ stats: any }>("/api/admin/stats"),
        apiFetch<{ stats: any; visitors: any[] }>("/api/admin/visitors?limit=100").catch(() => null),
      ]);
      const st = statsData.stats || {};
      const visits = visitorsData?.stats?.totalVisits ?? 0;
      const logs = visitorsData?.visitors || [];
      const views = logs.filter((l: any) => typeof l.path === "string" && l.path.includes("/product")).length;
      const cart = logs.filter((l: any) => typeof l.path === "string" && l.path.includes("/cart")).length;
      const checkout = logs.filter((l: any) => typeof l.path === "string" && l.path.includes("/checkout")).length;
      const purchased = st.orders || 0;

      const pct = (num: number, den: number) => (den > 0 ? Math.min(100, Math.round((num / den) * 100)) : 0);

      return [
        { stage: "Storefront Visits", count: visits, conversionRate: visits > 0 ? 100 : 0, dropoffRate: 0 },
        { stage: "Product Page Views", count: views, conversionRate: pct(views, visits), dropoffRate: visits > 0 ? 100 - pct(views, visits) : 0 },
        { stage: "Add to Cart", count: cart, conversionRate: pct(cart, views), dropoffRate: views > 0 ? 100 - pct(cart, views) : 0 },
        { stage: "Initiate Checkout", count: checkout, conversionRate: pct(checkout, cart), dropoffRate: cart > 0 ? 100 - pct(checkout, cart) : 0 },
        { stage: "Purchase Completed", count: purchased, conversionRate: pct(purchased, checkout), dropoffRate: checkout > 0 ? 100 - pct(purchased, checkout) : 0 },
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
        logo: v.logo || "",
        sales: v.sales || 0,
        orders: v.orders || 0,
        revenue: v.revenue || 0,
        growth: 0,
        rating: v.rating || 0,
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
        views: p.views ?? 0,
        status: (p.sales || 0) > 0 ? "top" : "worst",
      }));
    } catch {
      return [];
    }
  },

  getGeoAnalytics: async (): Promise<GeoMetric[]> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/visitors?limit=1");
      const countries = data.stats?.topCountries || [];
      return countries.map((c: any) => ({
        region: c.countryCode || c.country || "Unknown",
        country: c.country || "Unknown",
        sales: c.count || 0,
        customers: c.count || 0,
        sharePercentage: c.percentage || 0,
      }));
    } catch {
      return [];
    }
  },

  getMarketingAnalytics: async (): Promise<TrafficSource[]> => {
    try {
      const data = await apiFetch<{ stats: any }>("/api/admin/visitors?limit=1");
      const sources = data.stats?.sourceBreakdown || [];
      return sources.map((s: any) => ({
        channel: s.name || s.type || "Direct",
        visitors: s.count || 0,
        conversions: 0,
        cac: 0,
        roas: 0,
        share: s.percentage || 0,
      }));
    } catch {
      return [];
    }
  },

  getAlerts: async (): Promise<AnalyticsAlert[]> => {
    try {
      const health = await apiFetch<{ health: any }>("/api/admin/marketplace-health").catch(() => null);
      const h = health?.health || {};
      const alerts: AnalyticsAlert[] = [];

      if ((h.pendingVendors || 0) > 0) {
        alerts.push({
          id: "alt_pending_vendors",
          title: "Pending Vendor Applications",
          description: `${h.pendingVendors} vendor store(s) awaiting administrative KYC review and verification.`,
          severity: "warning",
          timestamp: "Requires Action",
        });
      }

      if ((h.pendingProducts || 0) > 0) {
        alerts.push({
          id: "alt_pending_products",
          title: "Catalog Moderation Queue",
          description: `${h.pendingProducts} new product listing(s) pending marketplace approval.`,
          severity: "info",
          timestamp: "Action Required",
        });
      }

      alerts.push({
        id: "alt_system_online",
        title: "Platform Database Telemetry Operational",
        description: "MongoDB cluster, real-time analytics aggregation, and API gateway functioning normally.",
        severity: "info",
        timestamp: "Active",
      });

      return alerts;
    } catch {
      return [];
    }
  },

  getRealtimeStats: async (): Promise<RealtimeStats> => {
    try {
      const [statsData, visitorsData, ordersData] = await Promise.all([
        apiFetch<{ stats: any }>("/api/admin/stats"),
        apiFetch<{ stats: any }>("/api/admin/visitors?limit=1").catch(() => null),
        apiFetch<{ orders: any[] }>("/api/admin/orders").catch(() => null),
      ]);
      const st = statsData.stats || {};
      const orders = ordersData?.orders || [];
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const oneMinuteAgo = Date.now() - 60_000;

      const revenueToday = orders
        .filter((o: any) => o.createdAt && new Date(o.createdAt).getTime() >= startOfToday.getTime())
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

      const ordersPerMin = orders.filter(
        (o: any) => o.createdAt && new Date(o.createdAt).getTime() >= oneMinuteAgo
      ).length;

      return {
        activeVisitors: visitorsData?.stats?.liveActive ?? 0,
        ordersPerMin,
        revenueToday: Math.round(revenueToday * 100) / 100,
        activeSellers: st.vendors ?? 0,
      };
    } catch {
      return { activeVisitors: 0, ordersPerMin: 0, revenueToday: 0, activeSellers: 0 };
    }
  },
};
