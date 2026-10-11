"use client";

import dynamic from "next/dynamic";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import {
  usePlatformStats,
  useSystemStatus,
  useMarketplaceHealth,
  useAdminVendors,
  useAdminProducts,
  useAdminOrders,
  useAdminPayments,
  useAdminActivities,
  useAdminAnalytics,
  useApproveVendor,
  useApproveProduct,
} from "@/hooks/useAdminQuery";

import OverviewCards from "@/components/AdminDashboard/OverviewCards";
import MarketplaceHealth from "@/components/AdminDashboard/MarketplaceHealth";
import OrderOverview from "@/components/AdminDashboard/OrderOverview";
import VendorPerformance from "@/components/AdminDashboard/VendorPerformance";
import ProductPerformance from "@/components/AdminDashboard/ProductPerformance";
import PaymentOverview from "@/components/AdminDashboard/PaymentOverview";
import SystemMonitor from "@/components/AdminDashboard/SystemMonitor";
import QuickActions from "@/components/AdminDashboard/QuickActions";
import ActivityTimeline from "@/components/AdminDashboard/ActivityTimeline";
import DashboardSkeleton from "@/components/AdminDashboard/DashboardSkeleton";
import { RefreshCw, Database, Server, Activity, ShieldCheck } from "lucide-react";

// Dynamic imports for chart components
const RevenueChart = dynamic(() => import("@/components/AdminDashboard/RevenueChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});
const UserAnalytics = dynamic(() => import("@/components/AdminDashboard/UserAnalytics"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});

export default function AdminDashboardPage() {
  const { activeTimeframe } = useAdminDashboardStore();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats, isFetching: isStatsFetching } = usePlatformStats();
  const { data: systemStatus, isLoading: statusLoading, refetch: refetchStatus } = useSystemStatus();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useMarketplaceHealth();
  const { data: vendors = [], isLoading: vendorsLoading, refetch: refetchVendors } = useAdminVendors();
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useAdminProducts();
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useAdminOrders();
  const { data: payments, isLoading: paymentsLoading, refetch: refetchPayments } = useAdminPayments();
  const { data: activities = [], isLoading: activitiesLoading, refetch: refetchActivities } = useAdminActivities();
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useAdminAnalytics(activeTimeframe);

  const approveVendorMutation = useApproveVendor();
  const approveProductMutation = useApproveProduct();

  // Scroll to pending vendor or product section
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isAllLoading =
    statsLoading &&
    statusLoading &&
    healthLoading &&
    vendorsLoading &&
    productsLoading &&
    ordersLoading &&
    paymentsLoading &&
    activitiesLoading &&
    analyticsLoading;

  const handleRetryAll = () => {
    refetchStats();
    refetchStatus();
    refetchHealth();
    refetchVendors();
    refetchProducts();
    refetchOrders();
    refetchPayments();
    refetchActivities();
    refetchAnalytics();
  };

  if (isAllLoading) {
    return <DashboardSkeleton />;
  }

  const safeStats = stats || {
    users: 0,
    usersGrowth: 0,
    vendors: 0,
    vendorsGrowth: 0,
    products: 0,
    productsGrowth: 0,
    orders: 0,
    ordersGrowth: 0,
    revenue: 0,
    revenueGrowth: 0,
  };

  const safeSystemStatus = systemStatus || {
    api: "Operational",
    database: "Connected",
    redis: "Connected",
    rabbitmq: "Connected",
    microservices: [],
  };

  const safeHealth = health || {
    activeVendors: 0,
    pendingVendors: 0,
    pendingProducts: 0,
    customerComplaints: 0,
    refundRequests: 0,
  };

  const safePayments = payments || {
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    refundsProcessed: 0,
    pendingPayoutsAmount: 0,
    gatewayStatus: "Online" as const,
  };

  const safeAnalytics = {
    timeframe: analytics?.timeframe || activeTimeframe,
    revenueData: Array.isArray(analytics?.revenueData) ? analytics.revenueData : [],
    userGrowthData: Array.isArray(analytics?.userGrowthData) ? analytics.userGrowthData : [],
  };

  const isDbConnected = safeSystemStatus.database === "Connected" || (safeSystemStatus as any).database?.status === "connected";
  const dbLatency = (safeSystemStatus as any)?.dbLatencyMs ?? 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Elevated Hero Header with Real DB Connection and Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white via-slate-50/70 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Command Center
            </h1>
            <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[11px] rounded-lg shadow-2xs tracking-wide">
              ADMIN LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5 max-w-2xl leading-relaxed">
            Real-time multi-vendor governance, GMV revenue analytics, customer order pipeline, and live MongoDB telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live MongoDB Status Pill */}
          <div
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2.5 border shadow-2xs transition-all ${
              isDbConnected
                ? "bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <Database className="w-3.5 h-3.5" />
            <span>
              MongoDB: {isDbConnected ? "Connected" : "Disconnected"}
              {dbLatency > 0 && <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">({dbLatency}ms)</span>}
            </span>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={handleRetryAll}
            title="Refresh real-time platform telemetry"
            disabled={isStatsFetching}
            className="px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all border border-slate-200/80 dark:border-slate-700 shadow-2xs flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isStatsFetching ? "animate-spin text-blue-600" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 1. Platform KPI Overview Cards */}
      <OverviewCards stats={safeStats} />

      {/* 2. Admin Quick Shortcuts */}
      <QuickActions
        onApproveVendorClick={() => handleScrollToSection("vendor-performance")}
        onReviewProductClick={() => handleScrollToSection("product-performance")}
      />

      {/* 3. Revenue Analytics & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={safeAnalytics.revenueData} totalUsers={safeStats.users} />
        </div>
        <div className="lg:col-span-1">
          <UserAnalytics data={safeAnalytics.userGrowthData} />
        </div>
      </div>

      {/* 4. Marketplace Health Moderation Queue */}
      <MarketplaceHealth
        data={safeHealth}
        onApproveVendorClick={() => handleScrollToSection("vendor-performance")}
        onApproveProductClick={() => handleScrollToSection("product-performance")}
      />

      {/* 5. Order Fulfillment & Payments Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderOverview orders={orders} />
        <PaymentOverview data={safePayments} />
      </div>

      {/* 6. Vendor Ranking & Product Catalog Analytics */}
      <div id="vendor-performance">
        <VendorPerformance
          vendors={vendors}
          onApproveVendor={(id) => approveVendorMutation.mutate(id)}
        />
      </div>

      <div id="product-performance">
        <ProductPerformance
          products={products}
          onApproveProduct={(id) => approveProductMutation.mutate(id)}
        />
      </div>

      {/* 7. Real-Time System Health Monitoring Mesh */}
      <SystemMonitor status={safeSystemStatus} />

      {/* 8. Audit Activity Timeline */}
      <ActivityTimeline activities={activities} />
    </div>
  );
}
