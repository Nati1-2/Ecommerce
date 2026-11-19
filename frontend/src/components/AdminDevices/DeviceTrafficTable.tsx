"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Eye,
  ArrowUpRight,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { DeviceSession } from "@/types/deviceTraffic";
import DeviceIconBadge from "./DeviceIconBadge";
import ActivityIconBadge from "./ActivityIconBadge";

interface DeviceTrafficTableProps {
  devices: DeviceSession[];
  onSelectDevice: (device: DeviceSession) => void;
}

export default function DeviceTrafficTable({
  devices,
  onSelectDevice,
}: DeviceTrafficTableProps) {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleCopyIp = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 15) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
          <Eye className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-900 mb-1">
          No Device Traffic Matching Criteria
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try clearing your search filters or click "Simulate Traffic" above to generate live device events.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table responsive scroll wrapper (prevents 320px overflow) */}
      <div className="overflow-x-auto min-w-full scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
              <th className="py-3.5 px-4 sm:px-6">Exact Device & Specifications</th>
              <th className="py-3.5 px-4">Client IP & Geolocation</th>
              <th className="py-3.5 px-4">Status & Session</th>
              <th className="py-3.5 px-4">Latest Activity & Visual Logo</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {devices.map((device) => {
              const latestActivity = device.activities[0];

              return (
                <tr
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  {/* Exact Device & Specs */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <DeviceIconBadge
                        deviceType={device.deviceType}
                        deviceBrand={device.deviceBrand}
                        size="md"
                      />
                      <div className="min-w-0">
                        <div className="font-black text-slate-900 text-xs truncate max-w-[220px] group-hover:text-blue-600 transition-colors">
                          {device.deviceModel}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[220px]">
                          {device.os} • {device.browser}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {device.screenResolution}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Client IP & Location */}
                  <td className="py-4 px-4">
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                        <span>{device.ip}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyIp(device.ip, e)}
                          className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                          title="Copy IP Address"
                        >
                          {copiedIp === device.ip ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                        <span>{device.location.flag}</span>
                        <span className="truncate max-w-[160px]">
                          {device.location.city}, {device.location.countryCode}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]" title={device.location.isp}>
                        {device.location.isp}
                      </div>
                    </div>
                  </td>

                  {/* Status & Session Duration */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100">
                        {device.status === "online" ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-700">Online</span>
                          </>
                        ) : device.status === "idle" ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-amber-700">Idle</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="text-slate-600">Exited</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDuration(device.durationSeconds)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 font-bold block">
                        {device.connectionType}
                      </span>
                    </div>
                  </td>

                  {/* Latest User Activity with Activity Logo */}
                  <td className="py-4 px-4">
                    {latestActivity ? (
                      <div className="flex items-start gap-2.5 max-w-[320px]">
                        {/* Prominent Visual Activity Logo */}
                        <ActivityIconBadge
                          type={latestActivity.activityType}
                          category={latestActivity.category}
                          size="md"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">
                            {latestActivity.title}
                          </div>
                          <div className="text-[11px] text-blue-600 font-mono font-medium truncate mt-0.5">
                            {latestActivity.path}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>{formatRelativeTime(latestActivity.timestamp)}</span>
                            <span>•</span>
                            <span>{latestActivity.latencyMs}ms</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">No activity yet</span>
                    )}
                  </td>

                  {/* Action Button: View Full Activity Log */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDevice(device);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold text-xs transition-all shadow-2xs"
                    >
                      <span>Log ({device.activities.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
