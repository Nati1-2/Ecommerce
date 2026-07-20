"use client";

import { create } from "zustand";
import { AdminProductModel, ProductFilterCriteria } from "@/types/adminProduct";

interface AdminProductState {
  selectedProductIds: string[];
  filters: ProductFilterCriteria;
  reviewDrawerProduct: AdminProductModel | null;
  approveModalProduct: AdminProductModel | null;
  rejectModalProduct: AdminProductModel | null;
  requestChangesProduct: AdminProductModel | null;
  previewModalProduct: AdminProductModel | null;
  isCategoryManagerOpen: boolean;
  isExportModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  setVendorFilter: (vendor: string) => void;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;

  toggleSelectProduct: (id: string) => void;
  selectAllProducts: (ids: string[]) => void;
  clearSelection: () => void;

  setReviewDrawerProduct: (product: AdminProductModel | null) => void;
  setApproveModalProduct: (product: AdminProductModel | null) => void;
  setRejectModalProduct: (product: AdminProductModel | null) => void;
  setRequestChangesProduct: (product: AdminProductModel | null) => void;
  setPreviewModalProduct: (product: AdminProductModel | null) => void;
  setIsCategoryManagerOpen: (open: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminProductStore = create<AdminProductState>((set) => ({
  selectedProductIds: [],
  filters: {
    searchQuery: "",
    statusFilter: "All",
    categoryFilter: "All",
    vendorFilter: "All",
    dateFilter: "All",
  },
  reviewDrawerProduct: null,
  approveModalProduct: null,
  rejectModalProduct: null,
  requestChangesProduct: null,
  previewModalProduct: null,
  isCategoryManagerOpen: false,
  isExportModalOpen: false,

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, statusFilter: status } })),
  setCategoryFilter: (category) =>
    set((state) => ({ filters: { ...state.filters, categoryFilter: category } })),
  setVendorFilter: (vendor) =>
    set((state) => ({ filters: { ...state.filters, vendorFilter: vendor } })),
  setDateFilter: (date) =>
    set((state) => ({ filters: { ...state.filters, dateFilter: date } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        statusFilter: "All",
        categoryFilter: "All",
        vendorFilter: "All",
        dateFilter: "All",
      },
    }),

  toggleSelectProduct: (id) =>
    set((state) => ({
      selectedProductIds: state.selectedProductIds.includes(id)
        ? state.selectedProductIds.filter((pId) => pId !== id)
        : [...state.selectedProductIds, id],
    })),
  selectAllProducts: (ids) => set({ selectedProductIds: ids }),
  clearSelection: () => set({ selectedProductIds: [] }),

  setReviewDrawerProduct: (reviewDrawerProduct) => set({ reviewDrawerProduct }),
  setApproveModalProduct: (approveModalProduct) => set({ approveModalProduct }),
  setRejectModalProduct: (rejectModalProduct) => set({ rejectModalProduct }),
  setRequestChangesProduct: (requestChangesProduct) => set({ requestChangesProduct }),
  setPreviewModalProduct: (previewModalProduct) => set({ previewModalProduct }),
  setIsCategoryManagerOpen: (isCategoryManagerOpen) => set({ isCategoryManagerOpen }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
