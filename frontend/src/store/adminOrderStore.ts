"use client";

import { create } from "zustand";
import { AdminOrderModel, OrderFilterCriteria } from "@/types/adminOrder";

interface AdminOrderState {
  selectedOrderIds: string[];
  filters: OrderFilterCriteria;
  orderDetailsModal: AdminOrderModel | null;
  statusModalOrder: AdminOrderModel | null;
  refundModalOrder: AdminOrderModel | null;
  isExportModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setOrderStatusFilter: (status: string) => void;
  setPaymentStatusFilter: (status: string) => void;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;

  toggleSelectOrder: (id: string) => void;
  selectAllOrders: (ids: string[]) => void;
  clearSelection: () => void;

  setOrderDetailsModal: (order: AdminOrderModel | null) => void;
  setStatusModalOrder: (order: AdminOrderModel | null) => void;
  setRefundModalOrder: (order: AdminOrderModel | null) => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminOrderStore = create<AdminOrderState>((set) => ({
  selectedOrderIds: [],
  filters: {
    searchQuery: "",
    orderStatusFilter: "All",
    paymentStatusFilter: "All",
    dateFilter: "All",
  },
  orderDetailsModal: null,
  statusModalOrder: null,
  refundModalOrder: null,
  isExportModalOpen: false,

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setOrderStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, orderStatusFilter: status } })),
  setPaymentStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, paymentStatusFilter: status } })),
  setDateFilter: (date) =>
    set((state) => ({ filters: { ...state.filters, dateFilter: date } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        orderStatusFilter: "All",
        paymentStatusFilter: "All",
        dateFilter: "All",
      },
    }),

  toggleSelectOrder: (id) =>
    set((state) => ({
      selectedOrderIds: state.selectedOrderIds.includes(id)
        ? state.selectedOrderIds.filter((oId) => oId !== id)
        : [...state.selectedOrderIds, id],
    })),
  selectAllOrders: (ids) => set({ selectedOrderIds: ids }),
  clearSelection: () => set({ selectedOrderIds: [] }),

  setOrderDetailsModal: (orderDetailsModal) => set({ orderDetailsModal }),
  setStatusModalOrder: (statusModalOrder) => set({ statusModalOrder }),
  setRefundModalOrder: (refundModalOrder) => set({ refundModalOrder }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
