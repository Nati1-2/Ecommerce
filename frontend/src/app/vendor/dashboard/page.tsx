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

const SalesChart = dynamic(() => import("@/components/vendor/dashboard/SalesChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />,
});

export default function VendorDashboardPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  const { data: profile } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorApi.getProfile,
  });

  const { data: metrics } = useQuery({
    queryKey: ["vendor-metrics"],
    queryFn: vendorApi.getMetrics,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: vendorApi.getProducts,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: vendorApi.getOrders,
  });

  const { data: analytics } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: vendorApi.getAnalytics,
  });

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

  if (!profile || !metrics || !analytics) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
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
