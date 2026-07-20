"use client";

import { useRealtimeStats } from "@/hooks/useAdminAnalyticsQuery";
import { Radio, Users, ShoppingBag, DollarSign, Store } from "lucide-react";

export default function RealtimeMetrics() {
  const { data, isLoading } = useRealtimeStats();

  if (isLoading || !data) return null;

  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            Socket.IO Live Marketplace Telemetry Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
          LIVE STREAM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-400" /> Current Online Visitors
          </p>
          <p className="text-lg font-black text-white mt-0.5">{data.activeVisitors.toLocaleString()}</p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-purple-400" /> Orders / Minute Rate
          </p>
          <p className="text-lg font-black text-purple-400 mt-0.5">{data.ordersPerMin} / min</p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Today's Gross Revenue
          </p>
          <p className="text-lg font-black text-emerald-400 mt-0.5">${data.revenueToday.toLocaleString()}</p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Store className="w-3 h-3 text-amber-400" /> Active Online Sellers
          </p>
          <p className="text-lg font-black text-amber-400 mt-0.5">{data.activeSellers.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
