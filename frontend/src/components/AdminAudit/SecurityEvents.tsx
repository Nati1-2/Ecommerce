"use client";

import { useSecurityEvents } from "@/hooks/useAdminAuditQuery";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SecurityEvents() {
  const { data: events = [], isLoading } = useSecurityEvents();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          Automated Security Anomaly Detection Engine
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Machine learning SIEM anomaly detection tracking brute-force attempts and IP anomalies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{ev.type}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-extrabold text-[10px]">
                {ev.severity}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 font-medium">{ev.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              <span>IP: {ev.ip}</span>
              <span>Detected: {ev.detectedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
