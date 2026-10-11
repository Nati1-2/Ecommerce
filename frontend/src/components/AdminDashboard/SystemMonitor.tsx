"use client";

import { SystemStatus } from "@/types/admin";
import { Server, Database, Cpu, MessageSquare, CheckCircle2, Wifi, Zap, Activity } from "lucide-react";

interface Props {
  status: SystemStatus;
}

export default function SystemMonitor({ status }: Props) {
  const safeStatus = status || ({} as SystemStatus);
  const latency = (safeStatus as any)?.dbLatencyMs ?? 0;
  const heapMB = (safeStatus as any)?.heapUsedMB;
  const uptimeSec = (safeStatus as any)?.uptimeSeconds;

  const coreServices = [
    {
      name: "API Gateway Runtime",
      val: safeStatus.api || "Operational",
      subtext: "Next.js Edge & App Router",
      icon: Server,
    },
    {
      name: "MongoDB Database",
      val: safeStatus.database || "Connected",
      subtext: latency ? `${latency}ms roundtrip ping` : "Direct Replica Set",
      icon: Database,
    },
    {
      name: "Cache & Session Layer",
      val: safeStatus.redis || "Connected",
      subtext: "Redis Cluster Active",
      icon: Cpu,
    },
    {
      name: "Event Bus & Message Queue",
      val: safeStatus.rabbitmq || "Connected",
      subtext: "RabbitMQ Realtime PubSub",
      icon: MessageSquare,
    },
  ];

  const microservices = Array.isArray(safeStatus.microservices) ? safeStatus.microservices : [];

  const formatUptime = (sec?: number) => {
    if (!sec) return "Active";
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Platform Health & Telemetry Mesh
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Backend Link
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time ping latency, connection state, and uptime metrics across live database and gateway services.
          </p>
        </div>

        {(heapMB || uptimeSec) && (
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {heapMB && <span>V8 Heap: <strong className="text-slate-800 dark:text-slate-200">{heapMB} MB</strong></span>}
            {heapMB && uptimeSec && <span>•</span>}
            {uptimeSec && <span>Uptime: <strong className="text-slate-800 dark:text-slate-200">{formatUptime(uptimeSec)}</strong></span>}
          </div>
        )}
      </div>

      {/* Core Infrastructure Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreServices.map((cs) => {
          const Icon = cs.icon;
          const isConnected =
            cs.val === "Connected" || cs.val === "Running" || cs.val === "Healthy" || cs.val === "Operational";

          return (
            <div
              key={cs.name}
              className="p-5 bg-gradient-to-b from-slate-50/80 to-slate-50/30 dark:from-slate-800/40 dark:to-slate-800/10 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/60 transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                    isConnected
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/80 dark:border-amber-800"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cs.val}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{cs.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{cs.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subsystem Mesh Details */}
      {microservices.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Subsystem Performance & Service Latency
            </p>
            <span className="text-[11px] text-slate-400">Target SLA: &lt;50ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {microservices.map((ms) => (
              <div
                key={ms.name}
                className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between text-xs transition-all shadow-2xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{ms.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Latency: <strong className="text-slate-700 dark:text-slate-300">{ms.latencyMs}ms</strong>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                    {ms.uptimePercent}%
                  </span>
                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>{ms.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
