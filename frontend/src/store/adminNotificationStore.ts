"use client";

import { create } from "zustand";
import { NotificationChannel, NotificationStatus } from "@/types/adminNotification";

export type AdminNotificationTab =
  | "overview"
  | "create"
  | "campaigns"
  | "templates"
  | "logs"
  | "realtime"
  | "analytics"
  | "automation"
  | "settings";

interface AdminNotificationState {
  activeTab: AdminNotificationTab;
  selectedLogIds: string[];
  filters: {
    searchQuery: string;
    channelFilter: string;
    statusFilter: string;
  };
  isCampaignWizardOpen: boolean;
  isTemplateModalOpen: boolean;
  previewTemplate: any | null;

  setActiveTab: (tab: AdminNotificationTab) => void;
  setSearchQuery: (query: string) => void;
  setChannelFilter: (channel: string) => void;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;

  toggleSelectLog: (id: string) => void;
  selectAllLogs: (ids: string[]) => void;
  clearLogSelection: () => void;

  setIsCampaignWizardOpen: (open: boolean) => void;
  setIsTemplateModalOpen: (open: boolean) => void;
  setPreviewTemplate: (template: any | null) => void;
}

export const useAdminNotificationStore = create<AdminNotificationState>((set) => ({
  activeTab: "overview",
  selectedLogIds: [],
  filters: {
    searchQuery: "",
    channelFilter: "All",
    statusFilter: "All",
  },
  isCampaignWizardOpen: false,
  isTemplateModalOpen: false,
  previewTemplate: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setChannelFilter: (channel) =>
    set((state) => ({ filters: { ...state.filters, channelFilter: channel } })),
  setStatusFilter: (status) =>
    set((state) => ({ filters: { ...state.filters, statusFilter: status } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        channelFilter: "All",
        statusFilter: "All",
      },
    }),

  toggleSelectLog: (id) =>
    set((state) => ({
      selectedLogIds: state.selectedLogIds.includes(id)
        ? state.selectedLogIds.filter((lId) => lId !== id)
        : [...state.selectedLogIds, id],
    })),
  selectAllLogs: (ids) => set({ selectedLogIds: ids }),
  clearLogSelection: () => set({ selectedLogIds: [] }),

  setIsCampaignWizardOpen: (isCampaignWizardOpen) => set({ isCampaignWizardOpen }),
  setIsTemplateModalOpen: (isTemplateModalOpen) => set({ isTemplateModalOpen }),
  setPreviewTemplate: (previewTemplate) => set({ previewTemplate }),
}));
