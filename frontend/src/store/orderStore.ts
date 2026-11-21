"use client";

import { create } from "zustand";
import { Order } from "@/types";

interface OrderFilters {
  status: string;
  date: string;
  query: string;
  sort: string;
}

interface OrderState {
  orders: Order[];
  filters: OrderFilters;
  selectedOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setSelectedOrder: (order: Order | null) => void;
  cancelOrder: (id: string) => void;
  returnOrder: (id: string, reason: string, description: string) => void;
  resetStore: () => void;
}

const initialFilters: OrderFilters = {
  status: "All",
  date: "Last 30 days",
  query: "",
  sort: "Newest",
};

const initialOrders: Order[] = [];
export const useOrderStore = create<OrderState>((set) => ({
  orders: [...initialOrders],
  filters: { ...initialFilters },
  selectedOrder: null,

  setOrders: (orders) => set({ orders }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),

  cancelOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "Cancelled", paymentStatus: "Refunded" } : o
      ),
    })),

  returnOrder: (id, reason, description) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "Returned" } : o
      ),
    })),

  resetStore: () =>
    set({
      orders: [...initialOrders],
      filters: { ...initialFilters },
      selectedOrder: null,
    }),
}));
