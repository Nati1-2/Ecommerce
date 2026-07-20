"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductApi } from "@/services/api/adminProductApi";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";

export function useProductStats() {
  return useQuery({
    queryKey: ["admin-product-stats"],
    queryFn: adminProductApi.getProductStats,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products-list"],
    queryFn: adminProductApi.getProducts,
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["admin-product-detail", id],
    queryFn: () => adminProductApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: adminProductApi.getCategories,
  });
}

export function useReportedProducts() {
  return useQuery({
    queryKey: ["admin-reported-products"],
    queryFn: adminProductApi.getReportedProducts,
  });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminProductApi.approveProduct(id),
    onSuccess: (approved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-health"] });
      showToast(`Product "${approved.name}" approved & published live!`, "success");
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, reason, notes }: { id: string; reason: string; notes: string }) =>
      adminProductApi.rejectProduct(id, reason, notes),
    onSuccess: (rejected) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      showToast(`Product "${rejected.name}" application rejected`, "info");
    },
  });
}

export function useRequestChanges() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      adminProductApi.requestChanges(id, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      showToast(`Change request feedback sent to vendor for "${updated.name}"`, "info");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminProductApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      showToast("Product listing removed from marketplace", "info");
    },
  });
}

export function useBulkApproveProducts() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (ids: string[]) => adminProductApi.bulkApproveProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      showToast("Selected products approved and published!", "success");
    },
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (name: string) => adminProductApi.addCategory(name),
    onSuccess: (cat) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      showToast(`Category "${cat.name}" added to marketplace taxonomy!`, "success");
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminDashboardStore();

  return useMutation({
    mutationFn: (id: string) => adminProductApi.dismissReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reported-products"] });
      showToast("Product report flag dismissed", "info");
    },
  });
}
