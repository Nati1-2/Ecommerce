"use client";

import { create } from "zustand";
import { AdminNotification } from "@/types/admin";

export type AdminTimeframe = "Today" | "7d" | "30d" | "Year";

interface AdminDashboardState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  activeTimeframe: AdminTimeframe;
  searchQuery: string;
  isAnnouncementModalOpen: boolean;
  notifications: AdminNotification[];
  toast: { message: string; type: "success" | "error" | "info" } | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setActiveTimeframe: (timeframe: AdminTimeframe) => void;
  setSearchQuery: (query: string) => void;
  setIsAnnouncementModalOpen: (open: boolean) => void;
  addNotification: (notification: Omit<AdminNotification, "id" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  activeTimeframe: "30d",
  searchQuery: "",
  isAnnouncementModalOpen: false,
  notifications: [
    {
      id: "an_1",
      type: "NEW_VENDOR",
      title: "New Vendor Registration",
      message: "Quantum Gear Labs submitted store verification application",
      timestamp: "5 mins ago",
      severity: "info",
      read: false,
    },
    {
      id: "an_2",
      type: "LARGE_ORDER",
      title: "High Value Order Detected",
      message: "Order #ORD-ADMIN-9920 placed for $14,250.00",
      timestamp: "24 mins ago",
      severity: "success",
      read: false,
    },
    {
      id: "an_3",
      type: "PAYMENT_FAILED",
      title: "Payment Gateway Alert",
      message: "Stripe payout batch #PO-8812 experienced a 0.2% retry delay",
      timestamp: "1 hour ago",
      severity: "warning",
      read: false,
    },
    {
      id: "an_4",
      type: "PRODUCT_REPORTED",
      title: "Product Listing Flagged",
      message: "Wireless Earbuds Pro flagged by 3 users for copyright review",
      timestamp: "2 hours ago",
      severity: "error",
      read: true,
    },
  ],
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  setActiveTimeframe: (activeTimeframe) => set({ activeTimeframe }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsAnnouncementModalOpen: (isAnnouncementModalOpen) => set({ isAnnouncementModalOpen }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          id: `an_${Date.now()}`,
          ...notif,
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  showToast: (message, type = "success") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
