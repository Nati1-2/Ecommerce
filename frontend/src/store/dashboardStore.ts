"use client";

import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membership: string;
  points: number;
}

export interface DashboardOrder {
  id: string;
  status: string;
  amount: number;
  date: string;
  itemsCount: number;
}

export interface DashboardNotification {
  id: string;
  type: "success" | "shipping" | "discount";
  message: string;
  time: string;
}

interface DashboardState {
  user: UserProfile;
  orders: DashboardOrder[];
  notifications: DashboardNotification[];
  wishlistCount: number;
  reviewsCount: number;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addNotification: (noti: DashboardNotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: {
    id: "usr-948",
    name: "John Smith",
    email: "john.smith@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    membership: "Premium Member ⭐",
    points: 2400,
  },
  wishlistCount: 12,
  reviewsCount: 8,
  orders: [
    {
      id: "ORD-123456",
      status: "Shipped",
      amount: 949.0,
      date: "July 15, 2026",
      itemsCount: 1,
    },
    {
      id: "ORD-987654",
      status: "Delivered",
      amount: 399.0,
      date: "June 28, 2026",
      itemsCount: 2,
    },
    {
      id: "ORD-543210",
      status: "Processing",
      amount: 1577.9,
      date: "July 15, 2026",
      itemsCount: 2,
    },
    {
      id: "ORD-246810",
      status: "Cancelled",
      amount: 89.9,
      date: "May 12, 2026",
      itemsCount: 1,
    },
  ],
  notifications: [
    {
      id: "noti-1",
      type: "success",
      message: "Payment completed for order #ORD-123456",
      time: "2 hours ago",
    },
    {
      id: "noti-2",
      type: "shipping",
      message: "Order #ORD-123456 has been shipped via DHL",
      time: "8 hours ago",
    },
    {
      id: "noti-3",
      type: "discount",
      message: "New 20% discount coupon available in your inbox",
      time: "1 day ago",
    },
  ],

  updateProfile: (profile) =>
    set((state) => ({ user: { ...state.user, ...profile } })),

  addNotification: (noti) =>
    set((state) => ({ notifications: [noti, ...state.notifications] })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
