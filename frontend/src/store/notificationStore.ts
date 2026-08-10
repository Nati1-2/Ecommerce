"use client";

import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: "notif-welcome",
      title: "Welcome to Nati Store! 🎉",
      message: "Your account is verified and ready for fast checkout & 10% off with code NATI10.",
      type: "SYSTEM",
      link: "/products",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notif-[#007BFF]",
      title: "Summer Flash Sale Live! ⚡",
      message: "Get up to 50% off top electronics, fashion & gaming gear.",
      type: "PROMO",
      link: "/flash-sale",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif-[#007BFF]-2",
      title: "Free Express Shipping 🚚",
      message: "Enjoy free express 2-day delivery on all orders over $50.",
      type: "SHIPPING",
      link: "/shipping",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  unreadCount: 2,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || "") : "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const res = await fetch("/api/notifications", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const notifs: AppNotification[] = data.notifications;
          const unread = notifs.filter((n) => !n.read).length;
          set({ notifications: notifs, unreadCount: unread });
        }
      }
    } catch (err) {
      console.warn("Fetch notifications notice:", err);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    // Optimistic UI update
    const current = get().notifications;
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    const unread = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount: unread });

    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || "") : "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

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
      const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || "") : "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      await fetch("/api/notifications", {
        method: "PUT",
        headers,
        body: JSON.stringify({ action: "mark_all_read" }),
      });
    } catch (err) {
      console.warn("Mark all read notice:", err);
    }
  },
}));
