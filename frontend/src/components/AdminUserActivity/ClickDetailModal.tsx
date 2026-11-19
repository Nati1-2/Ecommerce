"use client";

import React from "react";
import { UserClickEvent } from "@/types/userActivity";
import {
  X,
  MousePointer,
  Crosshair,
  User,
  Monitor,
  Globe,
  Clock,
  Layers,
  Code2,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Tablet,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface ClickDetailModalProps {
  click: UserClickEvent | null;
  onClose: () => void;
}

export const ClickDetailModal: React.FC<ClickDetailModalProps> = ({ click, onClose }) => {
  const [copiedSession, setCopiedSession] = React.useState(false);
  const [copiedIp, setCopiedIp] = React.useState(false);

  if (!click) return null;

  const copyToClipboard = (text: string, type: "session" | "ip") => {
    navigator.clipboard.writeText(text);
    if (type === "session") {
      setCopiedSession(true);
      setTimeout(() => setCopiedSession(false), 2000);
    } else {
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2000);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "VENDOR":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CUSTOMER":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Mobile":
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case "Tablet":
        return <Tablet className="w-5 h-5 text-purple-500" />;
      default:
        return <Laptop className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <MousePointer className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  User Click Telemetry Detail
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  ID: {click.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {new Date(click.timestamp).toLocaleString()} ({new Date(click.timestamp).toISOString()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target Element Box */}
          <div className="p-4 rounded-xl bg-violet-50/40 border border-violet-100">
            <div className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-violet-600" />
              Element Interacted
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-base font-bold text-slate-900">
                &ldquo;{click.elementText}&rdquo;
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800 border border-violet-200">
                &lt;{click.targetTag.toLowerCase()}&gt;
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">
                {click.eventType.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-400 font-medium">Page Route:</span>
                <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                  {click.path}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-400 font-medium">Coordinates:</span>
                <span className="font-mono text-violet-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                  X: {click.coordinates.x}px, Y: {click.coordinates.y}px
                </span>
              </div>
              {click.componentName && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-400 font-medium">Component:</span>
                  <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    &lt;{click.componentName} /&gt;
                  </span>
                </div>
              )}
              {click.elementId && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-400 font-medium">Element ID:</span>
                  <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    #{click.elementId}
                  </span>
                </div>
              )}
            </div>

            {click.elementClass && (
              <div className="mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-400">CSS Classes: </span>
                <span className="font-mono text-[11px] text-slate-700 break-all">
                  {click.elementClass}
                </span>
              </div>
            )}
          </div>

          {/* User & Identity Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Actor Profile & Identity
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">User Full Name</span>
                <span className="font-semibold text-slate-900 text-sm">{click.user.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Role & Clearance</span>
                <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${getRoleBadge(click.user.role)}`}>
                  {click.user.role}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-mono text-slate-800">{click.user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">User ID</span>
                <span className="font-mono text-slate-800">{click.user.id}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">Session Fingerprint</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] truncate flex-1">
                    {click.sessionId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(click.sessionId, "session")}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
                    title="Copy Session ID"
                  >
                    {copiedSession ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Device & Hardware Specs */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-slate-500" />
              Hardware & Device Specifications
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2.5 sm:col-span-1">
                {getDeviceIcon(click.device.type)}
                <div>
                  <span className="text-slate-400 block mb-0.5">Device Model</span>
                  <span className="font-semibold text-slate-900">{click.device.model}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Operating System</span>
                <span className="font-medium text-slate-800">{click.device.os}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Browser & Engine</span>
                <span className="font-medium text-slate-800">{click.device.browser}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Device Type</span>
                <span className="font-medium text-slate-800">{click.device.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Screen Resolution</span>
                <span className="font-mono font-medium text-slate-800">{click.device.screenResolution}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Page Dwell Time</span>
                <span className="font-medium text-slate-800">
                  {click.durationOnPageSeconds ? `${click.durationOnPageSeconds}s` : "Real-time stream"}
                </span>
              </div>
            </div>
          </div>

          {/* Network & Geolocation Telemetry */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-500" />
              Network & Geolocation Telemetry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">IP Address</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-900">{click.ip}</span>
                  <button
                    onClick={() => copyToClipboard(click.ip, "ip")}
                    className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                    title="Copy IP"
                  >
                    {copiedIp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Location</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <span>{click.location.flag}</span>
                  <span>
                    {click.location.city}, {click.location.country}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ISP / Network Provider</span>
                <span className="font-medium text-slate-800 truncate block">
                  {click.location.isp}
                </span>
              </div>
            </div>
          </div>

          {/* Extra metadata if present */}
          {click.metadata && Object.keys(click.metadata).length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-violet-400" />
                Raw Payload Metadata
              </div>
              <pre className="text-[11px] font-mono overflow-x-auto text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {JSON.stringify(click.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Captured via client-side beacon telemetry with zero UI latency.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
