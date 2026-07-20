"use client";

import { create } from "zustand";
import { SettingsSection } from "@/types/adminSettings";

interface AdminSettingsState {
  activeSection: SettingsSection;
  isDirty: boolean;
  pendingChanges: Record<string, any>;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;

  setActiveSection: (section: SettingsSection) => void;
  markDirty: (field: string, value: any) => void;
  resetChanges: () => void;
  setIsMaintenanceMode: (enabled: boolean) => void;
  setMaintenanceMessage: (msg: string) => void;
}

export const useAdminSettingsStore = create<AdminSettingsState>((set) => ({
  activeSection: "general",
  isDirty: false,
  pendingChanges: {},
  isMaintenanceMode: false,
  maintenanceMessage: "Marketplace is currently undergoing scheduled infrastructure upgrades.",

  setActiveSection: (activeSection) => set({ activeSection }),
  markDirty: (field, value) =>
    set((state) => ({
      isDirty: true,
      pendingChanges: { ...state.pendingChanges, [field]: value },
    })),
  resetChanges: () => set({ isDirty: false, pendingChanges: {} }),
  setIsMaintenanceMode: (isMaintenanceMode) => set({ isMaintenanceMode }),
  setMaintenanceMessage: (maintenanceMessage) => set({ maintenanceMessage }),
}));
