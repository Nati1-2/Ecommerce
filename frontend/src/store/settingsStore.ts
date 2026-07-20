"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSettings } from "@/services/api/settings";

interface SettingsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  settings: Partial<UserSettings>;
  setSettings: (settings: Partial<UserSettings>) => void;
  updateLocalSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeTab: "account",
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      settings: {},
      setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
      
      updateLocalSetting: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          [key]: value
        }
      })),

      toast: null,
      showToast: (message, type = "success") => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      hideToast: () => set({ toast: null }),
    }),
    {
      name: "ecom-settings-storage",
      partialize: (state) => ({ settings: state.settings, activeTab: state.activeTab }), // Persist only preferences and last open tab
    }
  )
);
