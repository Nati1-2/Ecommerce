"use client";

import { create } from "zustand";
import { InventoryItem } from "@/types/vendor";

interface SocketLog {
  id: string;
  type: "STOCK_UPDATED" | "LOW_STOCK_ALERT";
  message: string;
  timestamp: string;
}

interface InventoryState {
  searchQuery: string;
  statusFilter: string;
  editingItem: InventoryItem | null;
  socketLogs: SocketLog[];
  isBulkModalOpen: boolean;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setEditingItem: (item: InventoryItem | null) => void;
  setIsBulkModalOpen: (open: boolean) => void;
  addSocketLog: (type: "STOCK_UPDATED" | "LOW_STOCK_ALERT", message: string) => void;
  clearSocketLogs: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  searchQuery: "",
  statusFilter: "All",
  editingItem: null,
  socketLogs: [
    {
      id: "log_1",
      type: "STOCK_UPDATED",
      message: "Real-time stock updated for UltraBook Pro M3 Max (24 units available)",
      timestamp: "2 mins ago",
    },
    {
      id: "log_2",
      type: "LOW_STOCK_ALERT",
      message: "SonicPro Wireless ANC Headphones reached Low Stock threshold (4 units remaining)",
      timestamp: "12 mins ago",
    },
  ],
  isBulkModalOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setEditingItem: (editingItem) => set({ editingItem }),
  setIsBulkModalOpen: (isBulkModalOpen) => set({ isBulkModalOpen }),
  addSocketLog: (type, message) =>
    set((state) => ({
      socketLogs: [
        {
          id: `log_${Date.now()}`,
          type,
          message,
          timestamp: "Just now",
        },
        ...state.socketLogs,
      ],
    })),
  clearSocketLogs: () => set({ socketLogs: [] }),
}));
