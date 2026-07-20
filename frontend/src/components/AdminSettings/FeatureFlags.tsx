"use client";

import { useFeatureFlags, useToggleFeatureFlag } from "@/hooks/useAdminSettingsQuery";
import { ToggleRight, CheckCircle2, Zap } from "lucide-react";

export default function FeatureFlags() {
  const { data: flags = [], isLoading } = useFeatureFlags();
  const toggleMutation = useToggleFeatureFlag();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ToggleRight className="w-5 h-5 text-blue-600" />
          Feature Flag Management & Canary Releases
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Safely enable or disable platform capabilities in Production and Beta environments without redeploying code.</p>
      </div>

      <div className="space-y-3 text-xs">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{flag.name}</h4>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    flag.environment === "Production"
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                      : "bg-purple-100 dark:bg-purple-950/40 text-purple-600"
                  }`}
                >
                  {flag.environment}
                </span>
              </div>
              <p className="text-slate-500 mt-0.5">{flag.description}</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={flag.enabled}
                onChange={(e) =>
                  toggleMutation.mutate({ id: flag.id, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
