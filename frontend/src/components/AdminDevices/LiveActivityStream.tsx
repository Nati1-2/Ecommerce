"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Smartphone,
  Laptop,
  Tablet,
  Radio,
} from "lucide-react";
import { FlattenedActivityItem } from "@/types/deviceTraffic";
import ActivityIconBadge from "./ActivityIconBadge";
import DeviceIconBadge from "./DeviceIconBadge";

interface LiveActivityStreamProps {
  activities: FlattenedActivityItem[];
}

export default function LiveActivityStream({
  activities,
}: LiveActivityStreamProps) {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 15) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-xs">
        <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-700">No activity events recorded</h4>
        <p className="text-xs text-slate-400 mt-1">Events will appear here as users interact with the store.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((act) => {
        return (
          <div
            key={act.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Activity Logo + Title + Path */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                {/* Visual Activity Logo */}
                <ActivityIconBadge
                  type={act.activityType}
                  category={act.category}
                  size="lg"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                      {act.title}
                    </h4>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        act.method === "POST"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {act.method} {act.statusCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {act.latencyMs}ms
                    </span>
                  </div>

                  {act.details && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">
                      {act.details}
                    </p>
                  )}

                  <div className="text-[11px] font-mono text-blue-600 mt-1">
                    {act.path}
                  </div>
                </div>
              </div>

              {/* Right: Exact Device Badge + IP + Timestamp */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                {/* Device & Flag */}
                <div className="flex items-center gap-1.5">
                  <DeviceIconBadge
                    deviceType={act.deviceType}
                    deviceBrand={act.deviceBrand}
                    size="sm"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {act.deviceModel}
                  </span>
                </div>

                {/* IP Address & Country */}
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-mono">
                  <span>{act.flag}</span>
                  <span className="font-semibold">{act.ip}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyIp(act.ip)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                    title="Copy IP"
                  >
                    {copiedIp === act.ip ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <span className="text-slate-300">•</span>
                  <span className="font-sans font-bold text-slate-600">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
