"use client";

import React from "react";
import {
  MousePointer,
  Users,
  Flame,
  Zap,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import { UserActivityStats } from "@/types/userActivity";

interface UserActivityKPIsProps {
  stats: UserActivityStats;
}

export default function UserActivityKPIs({ stats }: UserActivityKPIsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Clicks Today */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recorded User Clicks
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Per-Click Live</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalClicksToday.toLocaleString()}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              clicks
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
            <MousePointer className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-bold">~{stats.clicksPerMinute} clicks/min</span> real-time interaction velocity
        </p>
      </div>

      {/* 2. Active Clickers Online */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Clickers Online
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            Concurrent
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.activeClickersCount}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              interacting
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Tracking customers, guests, vendors & admin actions
        </p>
      </div>

      {/* 3. Top Clicked Hotspot */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Top Clicked Element
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
            Hotspot 🔥
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-lg font-black text-slate-900 truncate" title={stats.topClickedElement}>
              {stats.topClickedElement}
            </div>
            <div className="text-[11px] font-semibold text-amber-600 mt-0.5">
              {stats.topClickedCategory}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Highest interaction rate across conversion funnel
        </p>
      </div>

      {/* 4. Clicks by User Role */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Clicks by Role
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
            Audited
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${stats.customerClicksShare}%` }} className="bg-blue-600 h-full" title={`Customer: ${stats.customerClicksShare}%`} />
            <div style={{ width: `${stats.guestClicksShare}%` }} className="bg-slate-400 h-full" title={`Guest: ${stats.guestClicksShare}%`} />
            <div style={{ width: `${stats.vendorClicksShare}%` }} className="bg-purple-500 h-full" title={`Vendor: ${stats.vendorClicksShare}%`} />
            <div style={{ width: `${stats.adminClicksShare}%` }} className="bg-emerald-500 h-full" title={`Admin: ${stats.adminClicksShare}%`} />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span className="text-blue-600">Cust {stats.customerClicksShare}%</span>
            <span className="text-slate-500">Guest {stats.guestClicksShare}%</span>
            <span className="text-purple-600">Vnd {stats.vendorClicksShare}%</span>
            <span className="text-emerald-600">Adm {stats.adminClicksShare}%</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Full attribution matching session tokens & IP
        </p>
      </div>
    </div>
  );
}
