"use client";

import { create } from "zustand";

export type TimeRange = "7d" | "30d" | "90d" | "1y";

interface AnalyticsState {
  timeRange: TimeRange;
  activeMetric: "revenue" | "orders" | "profit" | "conversion";
  setTimeRange: (range: TimeRange) => void;
  setActiveMetric: (metric: "revenue" | "orders" | "profit" | "conversion") => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  timeRange: "30d",
  activeMetric: "revenue",
  setTimeRange: (timeRange) => set({ timeRange }),
  setActiveMetric: (activeMetric) => set({ activeMetric }),
}));
