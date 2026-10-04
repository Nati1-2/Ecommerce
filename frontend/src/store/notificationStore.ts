"use client";

import { create } from "zustand";
import { Notification, NotificationType, NotificationSettings } from "@/types";

export type { Notification as AppNotification };

export interface NotificationFilters {
  type: NotificationType | "ALL";
  read: boolean | null;
  searchQuery: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  settings: NotificationSettings | null;

  // Actions
  initialize: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  receiveNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setFilter: (filter: Partial<NotificationFilters>) => void;
  updateSettings: (settings: NotificationSettings) => void;
}

const defaultFilters: NotificationFilters = {
  type: "ALL",
  read: null,
  searchQuery: "",
};

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  orders: true,
  promotions: false,
  security: true,
};

const initialNotifications: Notification[] = [
  {
    id: "notif-welcome",
    title: "Welcome to Nati Store! 🎉",
    message:
      "Your account is verified and ready for fast checkout & 10% off with code NATI10.",
    type: "SYSTEM",
    actionUrl: "/products",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-promo-1",
    title: "Summer Flash Sale Live! ⚡",
    message:
      "Get up to 50% off top electronics, fashion & gaming gear.",
    type: "PROMOTION",
    actionUrl: "/flash-sale",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-shipping-1",
    title: "Free Express Shipping 🚚",
    message:
      "Enjoy free express 2-day delivery on all orders over $50.",
    type: "ORDER",
    actionUrl: "/shipping",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [...initialNotifications],
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
  settings: { ...defaultSettings },

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token") || ""
          : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token)
        headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

      const res = await fetch("/api/notifications", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const notifs: Notification[] = data.notifications.map((n: any) => ({
            id: n.id || n._id,
            title: n.title,
            message: n.message,
            type: n.type as NotificationType,
            actionUrl: n.actionUrl || n.link,
            read: n.read ?? false,
            createdAt: n.createdAt,
            orderId: n.orderId,
          }));
          const unread = notifs.filter((n) => !n.read).length;
          set({ notifications: notifs, unreadCount: unread, loading: false });
          return;
        }
      }
      // If API not available, use initial notifications
      set({ loading: false });
    } catch (err: any) {
      console.warn("Fetch notifications notice:", err);
      set({ loading: false });
    }
  },

  fetchNotifications: async () => {
    await get().initialize();
  },

  receiveNotification: (notification: Notification) => {
    const current = get().notifications;
    // Prevent duplicates
    if (current.find((n) => n.id === notification.id)) return;
    const updated = [notification, ...current];
    const unread = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount: unread });
  },

  markAsRead: async (id: string) => {
    // Optimistic UI update
    const current = get().notifications;
    const updated = current.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const unread = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount: unread });

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token") || ""
          : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token)
        headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

      await fetch("/api/notifications", {
        method: "PUT",
        headers,
        body: JSON.stringify({ notifId: id }),
      });
    } catch (err) {
      console.warn("Mark read notice:", err);
    }
  },

  markAllAsRead: async () => {
    // Optimistic UI update
    const current = get().notifications;
    const updated = current.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token") || ""
          : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token)
        headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

      await fetch("/api/notifications", {
        method: "PUT",
        headers,
        body: JSON.stringify({ action: "mark_all_read" }),
      });
    } catch (err) {
      console.warn("Mark all read notice:", err);
    }
  },

  deleteNotification: async (id: string) => {
    const current = get().notifications;
    const updated = current.filter((n) => n.id !== id);
    const unread = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount: unread });

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token") || ""
          : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token)
        headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

      await fetch("/api/notifications", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ notifId: id }),
      });
    } catch (err) {
      console.warn("Delete notification notice:", err);
    }
  },

  setFilter: (filter: Partial<NotificationFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },

  updateSettings: (settings: NotificationSettings) => {
    set({ settings });
  },
}));
