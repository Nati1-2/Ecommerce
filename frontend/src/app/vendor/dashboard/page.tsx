"use client";

import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import StoreOverviewCard from "@/components/vendor/dashboard/StoreOverviewCard";
import RevenueCards from "@/components/vendor/dashboard/RevenueCards";
import RecentOrdersTable from "@/components/vendor/dashboard/RecentOrdersTable";
import TopProductsList from "@/components/vendor/dashboard/TopProductsList";
import InventoryAlerts from "@/components/vendor/dashboard/InventoryAlerts";
import { OrderStatus } from "@/types/vendor";
import { AlertCircle, RefreshCw } from "lucide-react";

const SalesChart = dynamic(() => import("@/components/vendor/dashboard/SalesChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-200  rounded-3xl animate-pulse" />,
});

export default function VendorDashboardPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorApi.getProfile,
  });

  const { data: metrics, isLoading: isMetricsLoading, isError: isMetricsError, refetch: refetchMetrics } = useQuery({
    queryKey: ["vendor-metrics"],
    queryFn: vendorApi.getMetrics,
  });

  const { data: products = [], isLoading: isProductsLoading, isError: isProductsError, refetch: refetchProducts } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: vendorApi.getProducts,
  });

  const { data: orders = [], isLoading: isOrdersLoading, isError: isOrdersError, refetch: refetchOrders } = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: vendorApi.getOrders,
  });

  const { data: analytics, isLoading: isAnalyticsLoading, isError: isAnalyticsError, refetch: refetchAnalytics } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: vendorApi.getAnalytics,
  });

  const handleRetry = () => {
    refetchProfile();
    refetchMetrics();
    refetchProducts();
    refetchOrders();
    refetchAnalytics();
  };

  const isError = isProfileError || isMetricsError || isProductsError || isOrdersError || isAnalyticsError;
  const isLoading = isProfileLoading || isMetricsLoading || isAnalyticsLoading || isProductsLoading || isOrdersLoading;

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      vendorApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      showToast(`Order ${updated.orderNumber} updated to ${updated.status}`, "success");
    },
  });

  const restockMutation = useMutation({
    mutationFn: (productId: string) => vendorApi.updateStock(productId, 25),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast("Stock updated by +25 units", "success");
    },
  });

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4 font-sans">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">
          Unable to Load Vendor Dashboard Data
        </h3>
        <p className="text-xs text-rose-600">
          The application encountered a database connection error. Please verify MongoDB is running.
        </p>
        <button
          onClick={handleRetry}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (isLoading || !profile || !metrics || !analytics) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-48 bg-slate-200  rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200  rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Overview */}
      <StoreOverviewCard profile={profile} />

      {/* Revenue & Key Metrics */}
      <RevenueCards metrics={metrics} />

      {/* Analytics Chart & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart data={analytics.dailyPerformance} />
        </div>
        <div className="lg:col-span-1">
          <InventoryAlerts
            products={products}
            onRestockQuick={(id) => restockMutation.mutate(id)}
          />
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrdersTable
            orders={orders}
            onUpdateStatus={(id, status) => updateOrderStatusMutation.mutate({ id, status })}
          />
        </div>
        <div className="lg:col-span-1">
          <TopProductsList products={products} />
        </div>
      </div>
    </div>
  );
}
