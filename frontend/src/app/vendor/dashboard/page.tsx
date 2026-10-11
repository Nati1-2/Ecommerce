"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import StoreOverviewCard from "@/components/vendor/dashboard/StoreOverviewCard";
import RevenueCards from "@/components/vendor/dashboard/RevenueCards";
import RecentOrdersTable from "@/components/vendor/dashboard/RecentOrdersTable";
import TopProductsList from "@/components/vendor/dashboard/TopProductsList";
import InventoryAlerts from "@/components/vendor/dashboard/InventoryAlerts";
import { OrderStatus } from "@/types/vendor";
import { AlertCircle, RefreshCw, Database } from "lucide-react";

const SalesChart = dynamic(() => import("@/components/vendor/dashboard/SalesChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});

export default function VendorDashboardPage() {
  const queryClient = useQueryClient();
  const { showToast, setNotifications } = useVendorStore();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile, isFetching: isProfileFetching } = useQuery({
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

  const { data: notifications = [] } = useQuery({
    queryKey: ["vendor-notifications"],
    queryFn: vendorApi.getNotifications,
  });

  useEffect(() => {
    if (notifications.length > 0) {
      setNotifications(notifications);
    }
  }, [notifications, setNotifications]);

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
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast(`Order ${updated.orderNumber} updated to ${updated.status}`, "success");
    },
  });

  const restockMutation = useMutation({
    mutationFn: (productId: string) => vendorApi.updateStock(productId, 25),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast("Stock updated by +25 units in database", "success");
    },
  });

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl text-center space-y-4 font-sans shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-rose-950 dark:text-rose-200 tracking-tight">
          Unable to Connect to Live Vendor Backend
        </h3>
        <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
          The application encountered a database connection notice. Please verify MongoDB server is responsive.
        </p>
        <button
          onClick={handleRetry}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Live Connection</span>
        </button>
      </div>
    );
  }

  if (isLoading || !profile || !metrics || !analytics) {
    return (
      <div className="space-y-6 animate-pulse p-4 max-w-7xl mx-auto">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner Overview */}
      <StoreOverviewCard profile={profile} />

      {/* Revenue & Key Metrics */}
      <RevenueCards metrics={metrics} />

      {/* Analytics Chart & Inventory Stock Alerts */}
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
