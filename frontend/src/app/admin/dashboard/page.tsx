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
import AdminPageHeader from "@/components/AdminShared/AdminPageHeader";
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

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats, isFetching: isStatsFetching } = usePlatformStats();
  const { data: systemStatus, isLoading: statusLoading, isError: statusError, refetch: refetchStatus } = useSystemStatus();
  const { data: health, isLoading: healthLoading, isError: healthError, refetch: refetchHealth } = useMarketplaceHealth();
  const { data: vendors = [], isLoading: vendorsLoading, isError: vendorsError, refetch: refetchVendors } = useAdminVendors();
  const { data: products = [], isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useAdminProducts();
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useAdminOrders();
  const { data: payments, isLoading: paymentsLoading, isError: paymentsError, refetch: refetchPayments } = useAdminPayments();
  const { data: activities = [], isLoading: activitiesLoading, isError: activitiesError, refetch: refetchActivities } = useAdminActivities();
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError, refetch: refetchAnalytics } = useAdminAnalytics(activeTimeframe);

  const approveVendorMutation = useApproveVendor();
  const approveProductMutation = useApproveProduct();

  // Scroll to pending vendor or product section
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isAnyLoading =
    statsLoading || statusLoading || healthLoading || vendorsLoading || productsLoading ||
    ordersLoading || paymentsLoading || activitiesLoading || analyticsLoading;
  const hasError =
    statsError || statusError || healthError || vendorsError || productsError ||
    ordersError || paymentsError || activitiesError || analyticsError;

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

  if (isAnyLoading && !hasError) {
    return <DashboardSkeleton />;
  }

  if (hasError) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <p role="alert">Unable to load live admin data. Please retry.</p>
        <button onClick={handleRetryAll} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Retry</button>
      </div>
    );
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
    api: "Unknown",
    database: "Disconnected",
    redis: "Unknown",
    rabbitmq: "Unknown",
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
    gatewayStatus: "Offline" as const,
  };

  const safeAnalytics = {
    timeframe: analytics?.timeframe || activeTimeframe,
    revenueData: Array.isArray(analytics?.revenueData) ? analytics.revenueData : [],
    userGrowthData: Array.isArray(analytics?.userGrowthData) ? analytics.userGrowthData : [],
  };

  const isDbConnected = safeSystemStatus.database === "Connected";
  const dbLatency = 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Platform Header with Real DB Connection and Telemetry */}
      <AdminPageHeader
        title="Platform Command Center"
        description="Real-time multi-vendor governance, GMV revenue analytics, customer order pipeline, and live MongoDB telemetry."
        badge="Live Telemetry"
        badgeVariant="blue"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live MongoDB Status Pill */}
            <div
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-2xs transition-all ${
                isDbConnected
                  ? "bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
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
              className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200/80 dark:border-slate-700 shadow-2xs flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isStatsFetching ? "animate-spin text-blue-600" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        }
      />

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
