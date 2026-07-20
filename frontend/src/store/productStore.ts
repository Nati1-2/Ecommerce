"use client";

import { create } from "zustand";
import { VendorProduct } from "@/types/vendor";

interface ProductState {
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  sortBy: "newest" | "price-asc" | "price-desc" | "sales" | "stock";
  selectedProductIds: string[];
  previewProduct: VendorProduct | null;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setSortBy: (sort: "newest" | "price-asc" | "price-desc" | "sales" | "stock") => void;
  toggleSelectProduct: (id: string) => void;
  selectAllProducts: (ids: string[]) => void;
  clearSelection: () => void;
  setPreviewProduct: (product: VendorProduct | null) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  searchQuery: "",
  selectedCategory: "All",
  selectedStatus: "All",
  sortBy: "newest",
  selectedProductIds: [],
  previewProduct: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleSelectProduct: (id) =>
    set((state) => ({
      selectedProductIds: state.selectedProductIds.includes(id)
        ? state.selectedProductIds.filter((pId) => pId !== id)
        : [...state.selectedProductIds, id],
    })),

  selectAllProducts: (ids) => set({ selectedProductIds: ids }),
  clearSelection: () => set({ selectedProductIds: [] }),
  setPreviewProduct: (previewProduct) => set({ previewProduct }),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategory: "All",
      selectedStatus: "All",
      sortBy: "newest",
    }),
}));
