"use client";

import { create } from "zustand";
import { AdminVendorModel, VendorFilterCriteria } from "@/types/adminVendor";

interface AdminVendorState {
  selectedVendorIds: string[];
  filters: VendorFilterCriteria;
  reviewDrawerVendor: AdminVendorModel | null;
  approvalModalVendor: AdminVendorModel | null;
  rejectModalVendor: AdminVendorModel | null;
  suspendModalVendor: AdminVendorModel | null;
  profileModalVendor: AdminVendorModel | null;
  isAddModalOpen: boolean;
  isExportModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setVerificationFilter: (verification: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;

  toggleSelectVendor: (id: string) => void;
  selectAllVendors: (ids: string[]) => void;
  clearSelection: () => void;

  setReviewDrawerVendor: (vendor: AdminVendorModel | null) => void;
  setApprovalModalVendor: (vendor: AdminVendorModel | null) => void;
  setRejectModalVendor: (vendor: AdminVendorModel | null) => void;
  setSuspendModalVendor: (vendor: AdminVendorModel | null) => void;
  setProfileModalVendor: (vendor: AdminVendorModel | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminVendorStore = create<AdminVendorState>((set) => ({
  selectedVendorIds: [],
  filters: {
    searchQuery: "",
    statusFilter: "All",
    verificationFilter: "All",
    categoryFilter: "All",
  },
  reviewDrawerVendor: null,
  approvalModalVendor: null,
  rejectModalVendor: null,
  suspendModalVendor: null,
  profileModalVendor: null,
  isAddModalOpen: false,
  isExportModalOpen: false,

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, statusFilter: status } })),
  setVerificationFilter: (verification) =>
    set((state) => ({ filters: { ...state.filters, verificationFilter: verification } })),
  setCategoryFilter: (category) =>
    set((state) => ({ filters: { ...state.filters, categoryFilter: category } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        statusFilter: "All",
        verificationFilter: "All",
        categoryFilter: "All",
      },
    }),

  toggleSelectVendor: (id) =>
    set((state) => ({
      selectedVendorIds: state.selectedVendorIds.includes(id)
        ? state.selectedVendorIds.filter((vId) => vId !== id)
        : [...state.selectedVendorIds, id],
    })),
  selectAllVendors: (ids) => set({ selectedVendorIds: ids }),
  clearSelection: () => set({ selectedVendorIds: [] }),

  setReviewDrawerVendor: (reviewDrawerVendor) => set({ reviewDrawerVendor }),
  setApprovalModalVendor: (approvalModalVendor) => set({ approvalModalVendor }),
  setRejectModalVendor: (rejectModalVendor) => set({ rejectModalVendor }),
  setSuspendModalVendor: (suspendModalVendor) => set({ suspendModalVendor }),
  setProfileModalVendor: (profileModalVendor) => set({ profileModalVendor }),
  setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
