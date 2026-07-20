"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderApi } from "@/services/api/adminOrderApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { OrderStatus } from "@/types/adminOrder";

export function useOrderStats() {
  return useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: adminOrderApi.getOrderStats,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders-list"],
    queryFn: adminOrderApi.getOrders,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ["admin-order-detail", id],
    queryFn: () => adminOrderApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useVendorOrderDistribution() {
  return useQuery({
    queryKey: ["admin-vendor-distribution"],
    queryFn: adminOrderApi.getVendorDistribution,
  });
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ["admin-payment-summary"],
    queryFn: adminOrderApi.getPaymentSummary,
  });
}

export function useDisputes() {
  return useQuery({
    queryKey: ["admin-disputes-list"],
    queryFn: adminOrderApi.getDisputes,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminOrderApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
      showToast(`Order "${updated.id}" status changed to ${updated.orderStatus}`, "info");
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason: string }) =>
      adminOrderApi.processRefund(id, amount, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payment-summary"] });
      showToast(`Refund of $${updated.amount.toLocaleString()} approved via Stripe!`, "success");
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ disputeId, resolution }: { disputeId: string; resolution: "Refund" | "Dismiss" }) =>
      adminOrderApi.resolveDispute(disputeId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-disputes-list"] });
      showToast("Customer dispute case resolved", "info");
    },
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, carrier, trackingNumber }: { id: string; carrier: string; trackingNumber: string }) =>
      adminOrderApi.updateTracking(id, carrier, trackingNumber),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      showToast(`Tracking code ${updated.trackingNumber} attached via ${updated.carrier}`, "success");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminOrderApi.cancelOrder(id),
    onSuccess: (cancelled) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
      showToast(`Order "${cancelled.id}" has been cancelled`, "error");
    },
  });
}

export function useBulkUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: OrderStatus }) =>
      adminOrderApi.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
      showToast("Selected orders status updated!", "success");
    },
  });
}
