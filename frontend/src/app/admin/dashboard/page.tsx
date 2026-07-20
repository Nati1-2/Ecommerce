"use client";

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
import RevenueChart from "@/components/AdminDashboard/RevenueChart";
import MarketplaceHealth from "@/components/AdminDashboard/MarketplaceHealth";
import OrderOverview from "@/components/AdminDashboard/OrderOverview";
import UserAnalytics from "@/components/AdminDashboard/UserAnalytics";
import VendorPerformance from "@/components/AdminDashboard/VendorPerformance";
import ProductPerformance from "@/components/AdminDashboard/ProductPerformance";
import PaymentOverview from "@/components/AdminDashboard/PaymentOverview";
import SystemMonitor from "@/components/AdminDashboard/SystemMonitor";
import QuickActions from "@/components/AdminDashboard/QuickActions";
import ActivityTimeline from "@/components/AdminDashboard/ActivityTimeline";
import DashboardSkeleton from "@/components/AdminDashboard/DashboardSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const { activeTimeframe, showToast } = useAdminDashboardStore();

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch } = usePlatformStats();
  const { data: systemStatus } = useSystemStatus();
  const { data: health } = useMarketplaceHealth();
  const { data: vendors = [] } = useAdminVendors();
  const { data: products = [] } = useAdminProducts();
  const { data: orders = [] } = useAdminOrders();
  const { data: payments } = useAdminPayments();
  const { data: activities = [] } = useAdminActivities();
  const { data: analytics } = useAdminAnalytics(activeTimeframe);

  const approveVendorMutation = useApproveVendor();
  const approveProductMutation = useApproveProduct();

  // Scroll to pending vendor or product section
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (statsLoading || !stats || !systemStatus || !health || !payments || !analytics) {
    return <DashboardSkeleton />;
  }

  if (statsError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Admin Dashboard Data
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The API Gateway encountered a temporary connection timeout.
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Platform Control Center & Marketplace Overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor multi-vendor ecosystem health, gross merchandise value (GMV), microservices telemetry, and admin operations.
        </p>
      </div>

      {/* 1. Platform Overview Cards */}
      <OverviewCards stats={stats} />

      {/* 2. Admin Quick Shortcuts */}
      <QuickActions
        onApproveVendorClick={() => handleScrollToSection("vendor-performance")}
        onReviewProductClick={() => handleScrollToSection("product-performance")}
      />

      {/* 3. Revenue Analytics & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={analytics.revenueData} />
        </div>
        <div className="lg:col-span-1">
          <UserAnalytics data={analytics.userGrowthData} />
        </div>
      </div>

      {/* 4. Marketplace Health Moderation Queue */}
      <MarketplaceHealth
        data={health}
        onApproveVendorClick={() => handleScrollToSection("vendor-performance")}
        onApproveProductClick={() => handleScrollToSection("product-performance")}
      />

      {/* 5. Order Fulfillment & Payments Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderOverview orders={orders} />
        <PaymentOverview data={payments} />
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
      <SystemMonitor status={systemStatus} />

      {/* 8. Audit Activity Timeline */}
      <ActivityTimeline activities={activities} />
    </div>
  );
}
