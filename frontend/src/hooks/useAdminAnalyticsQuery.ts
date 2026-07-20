"use client";

import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsApi } from "@/services/api/adminAnalyticsApi";
import { AnalyticsTimeframe } from "@/types/adminAnalytics";

export function useKPIMetrics() {
  return useQuery({
    queryKey: ["admin-kpi-metrics"],
    queryFn: adminAnalyticsApi.getKPIMetrics,
  });
}

export function useRevenueAnalytics(timeframe: AnalyticsTimeframe) {
  return useQuery({
    queryKey: ["admin-revenue-analytics", timeframe],
    queryFn: () => adminAnalyticsApi.getRevenueAnalytics(timeframe),
  });
}

export function useUserGrowth(timeframe: AnalyticsTimeframe) {
  return useQuery({
    queryKey: ["admin-user-growth", timeframe],
    queryFn: () => adminAnalyticsApi.getUserGrowth(timeframe),
  });
}

export function useCustomerFunnel() {
  return useQuery({
    queryKey: ["admin-customer-funnel"],
    queryFn: adminAnalyticsApi.getCustomerFunnel,
  });
}

export function useVendorAnalytics() {
  return useQuery({
    queryKey: ["admin-vendor-analytics-leaderboard"],
    queryFn: adminAnalyticsApi.getVendorAnalytics,
  });
}

export function useProductAnalytics() {
  return useQuery({
    queryKey: ["admin-product-analytics-performance"],
    queryFn: adminAnalyticsApi.getProductAnalytics,
  });
}

export function useGeoAnalytics() {
  return useQuery({
    queryKey: ["admin-geo-analytics"],
    queryFn: adminAnalyticsApi.getGeoAnalytics,
  });
}

export function useMarketingAnalytics() {
  return useQuery({
    queryKey: ["admin-marketing-analytics"],
    queryFn: adminAnalyticsApi.getMarketingAnalytics,
  });
}

export function useAnalyticsAlerts() {
  return useQuery({
    queryKey: ["admin-analytics-alerts"],
    queryFn: adminAnalyticsApi.getAlerts,
  });
}

export function useRealtimeStats() {
  return useQuery({
    queryKey: ["admin-realtime-stats"],
    queryFn: adminAnalyticsApi.getRealtimeStats,
    refetchInterval: 5000, // Refresh every 5 seconds for live telemetry
  });
}
