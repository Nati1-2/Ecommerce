"use client";

import { useAdminOrderStore } from "@/store/adminOrderStore";
import {
  useOrderStats,
  useAdminOrders,
  useCancelOrder,
  useBulkUpdateOrderStatus,
} from "@/hooks/useAdminOrderQuery";

import OrderHeader from "@/components/AdminOrders/OrderHeader";
import OrderStats from "@/components/AdminOrders/OrderStats";
import PaymentSummary from "@/components/AdminOrders/PaymentSummary";
import VendorOrderChart from "@/components/AdminOrders/VendorOrderChart";
import DisputeManager from "@/components/AdminOrders/DisputeManager";
import OrderFilters from "@/components/AdminOrders/OrderFilters";
import OrderTable from "@/components/AdminOrders/OrderTable";
import OrderDetails from "@/components/AdminOrders/OrderDetails";
import StatusUpdateModal from "@/components/AdminOrders/StatusUpdateModal";
import RefundModal from "@/components/AdminOrders/RefundModal";
import OrderExportModal from "@/components/AdminOrders/OrderExportModal";
import OrderSkeleton from "@/components/AdminOrders/OrderSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const {
    filters,
    selectedOrderIds,
    toggleSelectOrder,
    selectAllOrders,
    clearSelection,
  } = useAdminOrderStore();

  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: orders = [], isLoading: ordersLoading, isError, refetch } = useAdminOrders();

  const cancelOrderMutation = useCancelOrder();
  const bulkUpdateStatusMutation = useBulkUpdateOrderStatus();

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      o.vendorStore.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      o.products.some((p) => p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()));

    const matchesOrderStatus = filters.orderStatusFilter === "All" || o.orderStatus === filters.orderStatusFilter;
    const matchesPaymentStatus = filters.paymentStatusFilter === "All" || o.paymentStatus === filters.paymentStatusFilter;

    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  if (statsLoading || ordersLoading || !stats) {
    return <OrderSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
          Unable to Load Order Transactions
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          The Order Service microservice event bus encountered a temporary connection timeout.
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
      <OrderHeader />

      {/* Summary Statistics Cards */}
      <OrderStats stats={stats} />

      {/* Payment Counters Summary */}
      <PaymentSummary />

      {/* Vendor Order Distribution Chart & Dispute Resolution Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VendorOrderChart />
        </div>
        <div className="lg:col-span-1">
          <DisputeManager />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <OrderFilters
        selectedCount={selectedOrderIds.length}
        onBulkCancel={() => {
          bulkUpdateStatusMutation.mutate({ ids: selectedOrderIds, status: "Cancelled" });
          clearSelection();
        }}
      />

      {/* Order Data Table */}
      <OrderTable
        orders={filteredOrders}
        selectedIds={selectedOrderIds}
        onToggleSelect={toggleSelectOrder}
        onSelectAll={selectAllOrders}
        onCancelOrder={(id) => cancelOrderMutation.mutate(id)}
      />

      {/* Modals & Drawers */}
      <OrderDetails />
      <StatusUpdateModal />
      <RefundModal />
      <OrderExportModal />
    </div>
  );
}
