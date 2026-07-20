import { create } from "zustand";
import { Notification, NotificationSettings, NotificationType } from "@/types";
import {
  fetchNotifications,
  fetchNotificationSettings,
  updateNotificationSettingsApi,
  markNotificationReadApi,
  deleteNotificationApi,
  clearNotificationsApi,
} from "@/lib/api";

interface NotificationFilters {
  read: boolean | null; // true for read, false for unread, null for all
  type: NotificationType | "ALL";
  searchQuery: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  filters: NotificationFilters;
  settings: NotificationSettings | null;
  socketStatus: "connected" | "disconnected" | "connecting";
  loading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  receiveNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  setFilter: (filter: Partial<NotificationFilters>) => void;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  setSocketStatus: (status: "connected" | "disconnected" | "connecting") => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  filters: {
    read: null,
    type: "ALL",
    searchQuery: "",
  },
  settings: null,
  socketStatus: "disconnected",
  loading: false,
  error: null,

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const [notifs, settings] = await Promise.all([
        fetchNotifications(),
        fetchNotificationSettings(),
      ]);
      const unreadCount = notifs.filter((n) => !n.read).length;
      set({ notifications: notifs, settings, unreadCount, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to initialize notifications", loading: false });
    }
  },

  receiveNotification: (notification) => {
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.read).length;
      return { notifications: newNotifications, unreadCount };
    });
  },

  markAsRead: async (id) => {
    const { notifications } = get();
    const notif = notifications.find((n) => n.id === id);
    if (!notif || notif.read) return;

    // Optimistic update
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: state.unreadCount - 1,
      };
    });

    try {
      await markNotificationReadApi(id);
    } catch (error) {
      // Revert if failed
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n
        ),
        unreadCount: state.unreadCount + 1,
      }));
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => {
      const newNotifications = state.notifications.map((n) => ({ ...n, read: true }));
      return { notifications: newNotifications, unreadCount: 0 };
    });

    // We can assume a mock API call for mark all read if we wanted
    // For now we just mock the delay
    await new Promise((r) => setTimeout(r, 400));
  },

  deleteNotification: async (id) => {
    const { notifications } = get();
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;

    // Optimistic
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: !notif.read ? state.unreadCount - 1 : state.unreadCount,
    }));

    try {
      await deleteNotificationApi(id);
    } catch (error) {
      // Revert
      set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
    }
  },

  clearAll: async () => {
    const { notifications, unreadCount } = get();
    set({ notifications: [], unreadCount: 0 });
    try {
      await clearNotificationsApi();
    } catch (error) {
      set({ notifications, unreadCount });
    }
  },

  setFilter: (filterUpdate) => {
    set((state) => ({
      filters: { ...state.filters, ...filterUpdate },
    }));
  },

  updateSettings: async (newSettings) => {
    set({ settings: newSettings });
    try {
      await updateNotificationSettingsApi(newSettings);
    } catch (error) {
      console.error("Failed to update settings", error);
      // Revert logic could be placed here if we kept previous settings
    }
  },

  setSocketStatus: (status) => set({ socketStatus: status }),
}));
