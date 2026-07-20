"use client";

import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Wrench, AlertTriangle, ShieldCheck } from "lucide-react";

export default function MaintenanceSettings() {
  const { isMaintenanceMode, setIsMaintenanceMode, maintenanceMessage, setMaintenanceMessage } =
    useAdminSettingsStore();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-500" />
          Maintenance Mode & Platform Lockdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Safely temporarily lock buyer checkout and vendor APIs during major database upgrades.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isMaintenanceMode
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-6 h-6 ${isMaintenanceMode ? "text-amber-500" : "text-slate-400"}`} />
            <div>
              <p className="font-bold text-sm">
                Maintenance Mode Status: <span>{isMaintenanceMode ? "ACTIVE (PLATFORM LOCKED)" : "DISABLED (NORMAL OPERATIONS)"}</span>
              </p>
              <p className="text-[11px] opacity-80">
                {isMaintenanceMode
                  ? "Buyers and non-admin traffic will see a maintenance notice page."
                  : "All marketplace APIs and buyer storefronts are open and active."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-colors ${
              isMaintenanceMode
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {isMaintenanceMode ? "Deactivate Maintenance" : "Activate Maintenance Mode"}
          </button>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300">Public Maintenance Notice Message</label>
          <textarea
            rows={3}
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            className="w-full mt-1.5 p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
          />
        </div>
      </div>
    </div>
  );
}
