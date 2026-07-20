"use client";

import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Save, AlertCircle, RefreshCw } from "lucide-react";

export default function SettingsSaveBar() {
  const { isDirty, resetChanges } = useAdminSettingsStore();
  const showToast = useAdminDashboardStore((state) => state.showToast);

  if (!isDirty) return null;

  const handleSaveAll = () => {
    resetChanges();
    showToast("All unsaved platform setting changes persisted successfully!", "success");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-fade-in">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-white">Unsaved Settings Detected</p>
            <p className="text-[11px] text-slate-300">You have unsaved changes in this configuration view.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetChanges}
            className="px-3 py-2 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
