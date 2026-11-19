"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Globe,
  Clock,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Radio,
  Wifi,
  Sparkles,
  Info,
} from "lucide-react";
import { DeviceSession, ActivityLogEntry } from "@/types/deviceTraffic";
import DeviceIconBadge from "./DeviceIconBadge";
import ActivityIconBadge, { getActivityConfig } from "./ActivityIconBadge";

interface DeviceActivityModalProps {
  device: DeviceSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceActivityModal({
  device,
  isOpen,
  onClose,
}: DeviceActivityModalProps) {
  const [copiedIp, setCopiedIp] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

  if (!isOpen || !device) return null;

  const handleCopyIp = () => {
    navigator.clipboard.writeText(device.ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 15) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <DeviceIconBadge
              deviceType={device.deviceType}
              deviceBrand={device.deviceBrand}
              size="lg"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-white tracking-tight truncate">
                  {device.deviceModel}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                    device.status === "online"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {device.status === "online" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {device.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>{device.os}</span>
                <span>•</span>
                <span>{device.browser}</span>
                <span>•</span>
                <span className="text-blue-400 font-mono font-semibold">{device.connectionType}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Hardware & Network Ingress Details Grid */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* IP Address */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Client IP Address
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 truncate">
                {device.ip}
              </span>
              <button
                type="button"
                onClick={handleCopyIp}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                title="Copy IP Address"
              >
                {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Geolocation
            </span>
            <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
              <span>{device.location.flag}</span>
              <span className="truncate">
                {device.location.city}, {device.location.countryCode}
              </span>
            </div>
          </div>

          {/* Screen & Viewport */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Viewport Display
            </span>
            <div className="text-xs font-bold text-slate-900 truncate">
              {device.screenResolution}
            </div>
          </div>

          {/* Network ISP */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Network ISP Carrier
            </span>
            <div className="text-xs font-bold text-slate-900 truncate" title={device.location.isp}>
              {device.location.isp}
            </div>
          </div>
        </div>

        {/* Activity Log Header */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Full Activity History Log ({device.activities.length} Recorded Actions)
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Current Route: <code className="text-blue-600 font-bold">{device.currentPath}</code>
          </span>
        </div>

        {/* Chronological Activity Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/50">
          {device.activities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No activity logs recorded for this session yet.
            </div>
          ) : (
            device.activities.map((act, idx) => {
              const config = getActivityConfig(act.activityType, act.category);
              const isExpanded = expandedActivityId === act.id;

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Prominent Activity Logo / Icon */}
                      <ActivityIconBadge
                        type={act.activityType}
                        category={act.category}
                        size="md"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-black text-slate-900">
                            {act.title}
                          </h5>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              act.method === "POST"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {act.method} {act.statusCode}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {act.latencyMs}ms
                          </span>
                        </div>

                        {act.details && (
                          <p className="text-xs text-slate-600 mt-1">
                            {act.details}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-blue-600 font-semibold">{act.path}</span>
                        </div>
                      </div>
                    </div>

                    {/* Relative Timestamp */}
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-extrabold text-slate-600 block">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Metadata preview if available */}
                  {act.metadata && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[10px] text-slate-600 truncate">
                        Payload: {JSON.stringify(act.metadata)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 font-mono">
            Session ID: <span className="text-slate-600">{device.sessionId}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
