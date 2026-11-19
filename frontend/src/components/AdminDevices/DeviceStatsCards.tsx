"use client";

import React from "react";
import {
  Smartphone,
  Laptop,
  Globe2,
  Activity,
  Zap,
  TrendingUp,
  Radio,
} from "lucide-react";
import { DeviceTrafficStats } from "@/types/deviceTraffic";

interface DeviceStatsCardsProps {
  stats: DeviceTrafficStats;
  totalDevicesCount: number;
}

export default function DeviceStatsCards({
  stats,
  totalDevicesCount,
}: DeviceStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Live Active Devices */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Connected Devices
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Stream</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.activeDevicesCount}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              / {totalDevicesCount} online
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-bold">+14%</span> active sessions from last hour
        </p>
      </div>

      {/* 2. Top Device Model */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Top Device Model
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {stats.mobileShare}% Mobile Share
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-lg font-black text-slate-900 truncate" title={stats.topDeviceModel}>
              {stats.topDeviceModel}
            </div>
            <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
              iOS 17.5 • Retina OLED Display
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        {/* Visual Device Split Progress */}
        <div className="mt-3">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${stats.mobileShare}%` }} className="bg-violet-500 h-full" title={`Mobile: ${stats.mobileShare}%`} />
            <div style={{ width: `${stats.desktopShare}%` }} className="bg-indigo-500 h-full" title={`Desktop: ${stats.desktopShare}%`} />
            <div style={{ width: `${stats.tabletShare}%` }} className="bg-teal-400 h-full" title={`Tablet: ${stats.tabletShare}%`} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
            <span>Mobile {stats.mobileShare}%</span>
            <span>Desktop {stats.desktopShare}%</span>
            <span>Tablet {stats.tabletShare}%</span>
          </div>
        </div>
      </div>

      {/* 3. Unique IP Network */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Unique IP Ingress
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
            Global CDN
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.uniqueIpsCount}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              Public IPs
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
            <Globe2 className="w-5 h-5" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          IPv4 / IPv6 traffic routed via Cloudflare & Edge nodes
        </p>
      </div>

      {/* 4. Activity Events Logged */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Activity Events
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded-md border border-amber-200/80">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{stats.avgResponseLatency}ms latency</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalEventsToday.toLocaleString()}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              today
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Real-time user actions with verified visual activity logos
        </p>
      </div>
    </div>
  );
}
