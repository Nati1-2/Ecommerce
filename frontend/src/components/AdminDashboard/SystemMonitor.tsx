"use client";

import { SystemStatus } from "@/types/admin";
import { Server, Database, Cpu, MessageSquare, CheckCircle2, Activity, Wifi } from "lucide-react";

interface Props {
  status: SystemStatus;
}

export default function SystemMonitor({ status }: Props) {
  const coreServices = [
    { name: "API Gateway", val: status.api, icon: Server },
    { name: "PostgreSQL Database", val: status.database, icon: Database },
    { name: "Redis Cache Cluster", val: status.redis, icon: Cpu },
    { name: "RabbitMQ Message Queue", val: status.rabbitmq, icon: MessageSquare },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Health & Microservices Monitoring</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
              <Wifi className="w-3 h-3 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time ping latency, connection state, and uptime metrics across infrastructure services.
          </p>
        </div>
      </div>

      {/* Core Infrastructure Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {coreServices.map((cs) => {
          const Icon = cs.icon;

          return (
            <div key={cs.name} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-blue-500" />
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {cs.val}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-3">{cs.name}</p>
            </div>
          );
        })}
      </div>

      {/* Microservices Health Grid */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Microservice Mesh Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {status.microservices.map((ms) => (
            <div key={ms.name} className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{ms.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Latency: {ms.latencyMs}ms</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  {ms.uptimePercent}% Uptime
                </span>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {ms.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
