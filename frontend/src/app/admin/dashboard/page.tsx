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
import { AlertCircle, RefreshCw } from "lucide-react";

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

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = usePlatformStats();
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

  const isError = statsError || statusError || healthError || vendorsError || productsError || ordersError || paymentsError || activitiesError || analyticsError;
  const isAllLoading = statsLoading && statusLoading && healthLoading && vendorsLoading && productsLoading && ordersLoading && paymentsLoading && activitiesLoading && analyticsLoading;

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
    database: "Disconnected",
    redis: "Disconnected",
    rabbitmq: "Disconnected",
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
    gatewayStatus: "Offline",
  };

  const safeAnalytics = analytics || {
    timeframe: activeTimeframe,
    revenueData: [],
    userGrowthData: [],
  };

  const isDbConnected = safeSystemStatus.database === "Connected";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Title Header with DB Connection Status Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Platform Control Center & Marketplace Overview
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-md border border-blue-200/60">
              Admin v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Monitor multi-vendor ecosystem health, gross merchandise value (GMV), microservices telemetry, and live database operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 border shadow-2xs ${
            isDbConnected 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>MongoDB Database: {safeSystemStatus.database}</span>
          </div>

          <button
            onClick={handleRetryAll}
            title="Refresh dashboard telemetry data"
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-colors border border-slate-200/60"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Platform Overview Cards */}
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
