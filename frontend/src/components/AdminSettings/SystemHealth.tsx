"use client";

import { useSystemHealth } from "@/hooks/useAdminSettingsQuery";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function SystemHealth() {
  const { data: services = [], isLoading } = useSystemHealth();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Healthy":
        return {
          icon: CheckCircle2,
          color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        };
      case "Warning":
        return {
          icon: AlertTriangle,
          color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        };
      default:
        return {
          icon: XCircle,
          color: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Microservices System Health Telemetry Mesh
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Realtime latency, uptime, and operational health of all 8 core platform microservices.</p>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
          All Services Operational (99.98%)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {services.map((srv) => {
          const badge = getStatusBadge(srv.status);
          const Icon = badge.icon;

          return (
            <div
              key={srv.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{srv.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                  <Icon className="w-3 h-3" /> {srv.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{srv.service}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 font-mono text-[10px]">
                <span className="text-slate-500">Uptime: <strong className="text-slate-900 dark:text-white">{srv.uptime}</strong></span>
                <span className="text-slate-500">Latency: <strong className="text-emerald-600">{srv.latencyMs}ms</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
