"use client";

import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
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
  setNotifications: (notifications: DashboardNotification[]) => void;
  addNotification: (noti: DashboardNotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    avatar: "",
    membership: "Standard Member ⭐",
    points: 0,
  },
  wishlistCount: 0,
  reviewsCount: 0,
  orders: [],
  notifications: [],

  updateProfile: (profile) =>
    set((state) => ({ user: { ...state.user, ...profile } })),

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (noti) =>
    set((state) => ({ notifications: [noti, ...state.notifications] })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
