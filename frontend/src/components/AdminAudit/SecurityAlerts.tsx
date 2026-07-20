"use client";

import { useSecurityAlerts, useResolveAlert } from "@/hooks/useAdminAuditQuery";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function SecurityAlerts() {
  const { data: alerts = [], isLoading } = useSecurityAlerts();
  const resolveMutation = useResolveAlert();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Security Incident Alerts</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{alerts.length} Active Incidents</span>
      </div>

      <div className="space-y-3 text-xs">
        {alerts.map((alt) => {
          const isRes = alt.status === "Resolved";

          return (
            <div
              key={alt.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{alt.title}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-extrabold text-[10px]">
                    {alt.severity}
                  </span>
                </div>
                <p className="text-slate-500">{alt.description}</p>
                <p className="text-[10px] text-slate-400 font-mono">Created: {alt.createdAt}</p>
              </div>

              <button
                type="button"
                disabled={isRes || resolveMutation.isPending}
                onClick={() => resolveMutation.mutate(alt.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 shrink-0 ${
                  isRes
                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isRes ? "Resolved" : "Mark Resolved"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
