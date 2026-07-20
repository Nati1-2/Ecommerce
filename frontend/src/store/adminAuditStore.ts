"use client";

import { create } from "zustand";
import { AuditLogModel, AuditSeverity, AuditRole } from "@/types/adminAudit";

export type AuditViewTab = "logs" | "timeline" | "security-events" | "logins" | "alerts";

interface AdminAuditState {
  activeViewTab: AuditViewTab;
  selectedLog: AuditLogModel | null;
  filters: {
    searchQuery: string;
    eventTypeFilter: string;
    roleFilter: string;
    severityFilter: string;
    dateRangeFilter: string;
  };
  isComplianceModalOpen: boolean;
  isRetentionModalOpen: boolean;

  setActiveViewTab: (tab: AuditViewTab) => void;
  setSelectedLog: (log: AuditLogModel | null) => void;
  setSearchQuery: (query: string) => void;
  setEventTypeFilter: (type: string) => void;
  setRoleFilter: (role: string) => void;
  setSeverityFilter: (severity: string) => void;
  setDateRangeFilter: (range: string) => void;
  resetFilters: () => void;

  setIsComplianceModalOpen: (open: boolean) => void;
  setIsRetentionModalOpen: (open: boolean) => void;
}

export const useAdminAuditStore = create<AdminAuditState>((set) => ({
  activeViewTab: "logs",
  selectedLog: null,
  filters: {
    searchQuery: "",
    eventTypeFilter: "All",
    roleFilter: "All",
    severityFilter: "All",
    dateRangeFilter: "Today",
  },
  isComplianceModalOpen: false,
  isRetentionModalOpen: false,

  setActiveViewTab: (activeViewTab) => set({ activeViewTab }),
  setSelectedLog: (selectedLog) => set({ selectedLog }),
  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setEventTypeFilter: (type) =>
    set((state) => ({ filters: { ...state.filters, eventTypeFilter: type } })),
  setRoleFilter: (role) =>
    set((state) => ({ filters: { ...state.filters, roleFilter: role } })),
  setSeverityFilter: (severity) =>
    set((state) => ({ filters: { ...state.filters, severityFilter: severity } })),
  setDateRangeFilter: (range) =>
    set((state) => ({ filters: { ...state.filters, dateRangeFilter: range } })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: "",
        eventTypeFilter: "All",
        roleFilter: "All",
        severityFilter: "All",
        dateRangeFilter: "Today",
      },
    }),

  setIsComplianceModalOpen: (isComplianceModalOpen) => set({ isComplianceModalOpen }),
  setIsRetentionModalOpen: (isRetentionModalOpen) => set({ isRetentionModalOpen }),
}));
