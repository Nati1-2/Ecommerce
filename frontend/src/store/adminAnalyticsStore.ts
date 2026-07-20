"use client";

import { create } from "zustand";
import { AnalyticsTimeframe } from "@/types/adminAnalytics";

interface AdminAnalyticsState {
  dateRange: AnalyticsTimeframe;
  activeChartTab: "revenue" | "gmv" | "profit";
  isExportModalOpen: boolean;

  setDateRange: (timeframe: AnalyticsTimeframe) => void;
  setActiveChartTab: (tab: "revenue" | "gmv" | "profit") => void;
  setIsExportModalOpen: (open: boolean) => void;
}

export const useAdminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  dateRange: "30 Days",
  activeChartTab: "revenue",
  isExportModalOpen: false,

  setDateRange: (dateRange) => set({ dateRange }),
  setActiveChartTab: (activeChartTab) => set({ activeChartTab }),
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
}));
