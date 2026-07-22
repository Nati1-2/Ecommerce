"use client";

import dynamic from "next/dynamic";
import { useAdminAnalyticsStore } from "@/store/adminAnalyticsStore";
import { useKPIMetrics } from "@/hooks/useAdminAnalyticsQuery";

import AnalyticsHeader from "@/components/AdminAnalytics/AnalyticsHeader";
import RealtimeMetrics from "@/components/AdminAnalytics/RealtimeMetrics";
import AnalyticsAlerts from "@/components/AdminAnalytics/AnalyticsAlerts";
import KPICards from "@/components/AdminAnalytics/KPICards";
import AnalyticsSkeleton from "@/components/AdminAnalytics/AnalyticsSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

// Dynamic imports for recharts-dependent components
const RevenueChart = dynamic(() => import("@/components/AdminAnalytics/RevenueChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const SalesAnalytics = dynamic(() => import("@/components/AdminAnalytics/SalesAnalytics"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const UserGrowthChart = dynamic(() => import("@/components/AdminAnalytics/UserGrowthChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const CustomerFunnel = dynamic(() => import("@/components/AdminAnalytics/CustomerFunnel"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const VendorPerformance = dynamic(() => import("@/components/AdminAnalytics/VendorPerformance"), {
  ssr: false,
});
const ProductPerformance = dynamic(() => import("@/components/AdminAnalytics/ProductPerformance"), {
  ssr: false,
});
const CategoryAnalytics = dynamic(() => import("@/components/AdminAnalytics/CategoryAnalytics"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const GeoAnalytics = dynamic(() => import("@/components/AdminAnalytics/GeoAnalytics"), {
  ssr: false,
});
const MarketingAnalytics = dynamic(() => import("@/components/AdminAnalytics/MarketingAnalytics"), {
  ssr: false,
});
const ExportReports = dynamic(() => import("@/components/AdminAnalytics/ExportReports"), {
  ssr: false,
});

export default function AdminAnalyticsPage() {
  const { data: metrics, isLoading, isError, refetch } = useKPIMetrics();

  if (isLoading) return <AnalyticsSkeleton />;

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Analytics Engine
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Analytics Data Warehouse & Redis aggregation pipeline is currently updating cluster indexes.
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <AnalyticsHeader />

      {/* Real-time Telemetry Banner */}
      <RealtimeMetrics />

      {/* Business Intelligence Alerts */}
      <AnalyticsAlerts />

      {/* Executive KPI Cards */}
      <KPICards />

      {/* Main Revenue & GMV Trajectory Area Chart */}
      <RevenueChart />

      {/* Sales & User Growth Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesAnalytics />
        <UserGrowthChart />
      </div>

      {/* Customer Funnel & Category Share Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerFunnel />
        <CategoryAnalytics />
      </div>

      {/* Vendor & Product Performance Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorPerformance />
        <ProductPerformance />
      </div>

      {/* Geographical & Marketing Attribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeoAnalytics />
        <MarketingAnalytics />
      </div>

      {/* Export Reports Modal */}
      <ExportReports />
    </div>
  );
}
