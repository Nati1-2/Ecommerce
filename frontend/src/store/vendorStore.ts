import { create } from "zustand";

interface VendorNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface VendorState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  searchQuery: string;
  selectedProductIds: string[];
  notifications: VendorNotification[];
  toast: { message: string; type: "success" | "error" | "info" } | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleSelectProduct: (id: string) => void;
  selectAllProducts: (ids: string[]) => void;
  clearProductSelection: () => void;
  setNotifications: (notifications: VendorNotification[]) => void;
  addNotification: (title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  searchQuery: "",
  selectedProductIds: [],
  notifications: [],
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSelectProduct: (id) =>
    set((state) => ({
      selectedProductIds: state.selectedProductIds.includes(id)
        ? state.selectedProductIds.filter((item) => item !== id)
        : [...state.selectedProductIds, id],
    })),
  selectAllProducts: (ids) => set({ selectedProductIds: ids }),
  clearProductSelection: () => set({ selectedProductIds: [] }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (title, message) =>
    set((state) => ({
      notifications: [
        { id: `notif_${Date.now()}`, title, message, timestamp: "Just now", read: false },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  showToast: (message, type = "success") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
