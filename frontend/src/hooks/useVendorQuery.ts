"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import { VendorProduct, OrderStatus, VendorStoreSettings } from "@/types/vendor";

export function useVendorProfile() {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorApi.getProfile,
  });
}

export function useVendorMetrics() {
  return useQuery({
    queryKey: ["vendor-metrics"],
    queryFn: vendorApi.getMetrics,
  });
}

export function useVendorProducts() {
  return useQuery({
    queryKey: ["vendor-products"],
    queryFn: vendorApi.getProducts,
  });
}

export function useVendorProduct(id: string) {
  return useQuery({
    queryKey: ["vendor-product", id],
    queryFn: () => vendorApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: (data: Partial<VendorProduct>) => vendorApi.createProduct(data),
    onSuccess: (newProd) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast(`Product "${newProd.name}" submitted for approval!`, "success");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<VendorProduct> }) =>
      vendorApi.updateProduct(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-product", updated.id] });
      showToast(`Product "${updated.name}" updated successfully!`, "success");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: (id: string) => vendorApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-metrics"] });
      showToast("Product deleted successfully", "info");
    },
  });
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: (id: string) => vendorApi.duplicateProduct(id),
    onSuccess: (copy) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast(`Duplicated product as "${copy.name}"`, "success");
    },
  });
}

export function useVendorInventory() {
  return useQuery({
    queryKey: ["vendor-inventory"],
    queryFn: vendorApi.getInventory,
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      vendorApi.updateStock(productId, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast("Stock quantity updated successfully", "success");
    },
  });
}

export function useVendorOrders() {
  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: vendorApi.getOrders,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      vendorApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      showToast(`Order ${updated.orderNumber} updated to ${updated.status}`, "success");
    },
  });
}

export function useVendorCustomers() {
  return useQuery({
    queryKey: ["vendor-customers"],
    queryFn: vendorApi.getCustomers,
  });
}

export function useVendorReviews() {
  return useQuery({
    queryKey: ["vendor-reviews"],
    queryFn: vendorApi.getReviews,
  });
}

export function useReplyReview() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
      vendorApi.replyReview(reviewId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-reviews"] });
      showToast("Reply posted to product page", "success");
    },
  });
}

export function useVendorAnalytics() {
  return useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: vendorApi.getAnalytics,
  });
}

export function useVendorPayments() {
  return useQuery({
    queryKey: ["vendor-payments"],
    queryFn: vendorApi.getPayments,
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: (amount: number) => vendorApi.requestPayout(amount),
    onSuccess: (payout) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-payments"] });
      showToast(`Payout request for $${payout.amount.toLocaleString()} submitted to Stripe!`, "success");
    },
  });
}

export function useVendorSettings() {
  return useQuery({
    queryKey: ["vendor-settings"],
    queryFn: vendorApi.getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();

  return useMutation({
    mutationFn: (updates: Partial<VendorStoreSettings>) => vendorApi.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-settings"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      showToast("Store settings saved successfully", "success");
    },
  });
}
