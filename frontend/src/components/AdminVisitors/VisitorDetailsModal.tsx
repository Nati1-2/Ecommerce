"use client";

import {
  X,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Compass,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { VisitorLogItem } from "@/types/adminVisitors";

interface DetailsModalProps {
  visitor: VisitorLogItem | null;
  onClose: () => void;
}

export default function VisitorDetailsModal({ visitor, onClose }: DetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!visitor) return null;

  const handleCopyIp = () => {
    navigator.clipboard.writeText(visitor.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(visitor.visitedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const DeviceIcon =
    visitor.deviceType === "Mobile"
      ? Smartphone
      : visitor.deviceType === "Tablet"
      ? Tablet
      : Monitor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Visitor Telemetry Inspector</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {visitor.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300">Session ID: {visitor.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* IP & Location Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Network IP Address
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">{visitor.ip}</span>
                <button
                  onClick={handleCopyIp}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Copy IP"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Geolocation
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <span className="text-base">{visitor.location?.flag || "🌐"}</span>
                <span>{visitor.location?.city}, {visitor.location?.country}</span>
              </div>
            </div>
          </div>

          {/* Acquisition Source Details */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Traffic Acquisition Link Source
            </span>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Source Category:</span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {visitor.source?.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Inbound Channel:</span>
                <span className="text-xs font-bold text-slate-900">{visitor.source?.name}</span>
              </div>
              {visitor.source?.referrer && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Original Referrer URL:</span>
                  <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-xl break-all">
                    {visitor.source.referrer}
                  </div>
                </div>
              )}
              {visitor.source?.utmCampaign && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">UTM Campaign:</span>
                  <span className="font-mono text-blue-600 font-bold">{visitor.source.utmCampaign}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hardware & Client Specifications */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <DeviceIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Device & Brand</span>
              </div>
              <div className="text-xs font-extrabold text-slate-900">{visitor.deviceModel || visitor.deviceType}</div>
              <div className="text-[10px] text-slate-400">{visitor.deviceType}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Operating System</span>
              </div>
              <div className="text-xs font-extrabold text-slate-900">{visitor.os}</div>
              <div className="text-[10px] text-slate-400">{visitor.browser}</div>
            </div>
          </div>

          {/* Page & Session Duration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Current / Visited Page:</span>
              <span className="font-mono font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg">
                {visitor.path}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Timestamp:</span>
              <span className="font-bold text-slate-800">{formattedTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Session Duration:</span>
              <span className="font-bold text-slate-800">{visitor.durationSeconds} seconds</span>
            </div>
            {visitor.screenResolution && (
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Screen Resolution:</span>
                <span className="font-mono text-slate-700">{visitor.screenResolution}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
