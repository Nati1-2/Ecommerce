"use client";

import { create } from "zustand";
import { AdminReviewModel, ReviewFilterCriteria } from "@/types/adminReview";

interface AdminReviewState {
  selectedReviewIds: string[];
  filters: ReviewFilterCriteria;
  reviewDetailsModal: AdminReviewModel | null;
  approveModalReview: AdminReviewModel | null;
  removeModalReview: AdminReviewModel | null;
  isExportModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setRatingFilter: (rating: string) => void;
  setStatusFilter: (status: string) => void;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;

  toggleSelectReview: (id: string) => void;
  selectAllReviews: (ids: string[]) => void;
  clearSelection: () => void;

  setReviewDetailsModal: (review: AdminReviewModel | null) => void;
  setApproveModalReview: (review: AdminReviewModel | null) => void;
  setRemoveModalReview: (review: AdminReviewModel | null) => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminReviewStore = create<AdminReviewState>((set) => ({
  selectedReviewIds: [],
  filters: {
    searchQuery: "",
    ratingFilter: "All",
    statusFilter: "All",
    dateFilter: "All",
  },
  reviewDetailsModal: null,
  approveModalReview: null,
  removeModalReview: null,
  isExportModalOpen: false,

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setRatingFilter: (rating) =>
    set((state) => ({ filters: { ...state.filters, ratingFilter: rating } })),
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, statusFilter: status } })),
  setDateFilter: (date) =>
    set((state) => ({ filters: { ...state.filters, dateFilter: date } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        ratingFilter: "All",
        statusFilter: "All",
        dateFilter: "All",
      },
    }),

  toggleSelectReview: (id) =>
    set((state) => ({
      selectedReviewIds: state.selectedReviewIds.includes(id)
        ? state.selectedReviewIds.filter((rId) => rId !== id)
        : [...state.selectedReviewIds, id],
    })),
  selectAllReviews: (ids) => set({ selectedReviewIds: ids }),
  clearSelection: () => set({ selectedReviewIds: [] }),

  setReviewDetailsModal: (reviewDetailsModal) => set({ reviewDetailsModal }),
  setApproveModalReview: (approveModalReview) => set({ approveModalReview }),
  setRemoveModalReview: (removeModalReview) => set({ removeModalReview }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
