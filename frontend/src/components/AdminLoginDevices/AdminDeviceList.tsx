"use client";

import React, { useState } from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Shield,
  ShieldAlert,
  Clock,
  Sparkles,
  LogOut,
  KeyRound,
  Radio,
} from "lucide-react";
import { AdminLoginDevice } from "@/types/adminLoginDevices";

interface AdminDeviceListProps {
  devices: AdminLoginDevice[];
  onRevokeDevice: (deviceId: string) => void;
  isRevoking: boolean;
}

export default function AdminDeviceList({
  devices,
  onRevokeDevice,
  isRevoking,
}: AdminDeviceListProps) {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "workstation":
        return Monitor;
      default:
        return Laptop;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 15) return "Active now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Authorized Admin Login Devices ({devices.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware devices currently or previously authenticated into the Super Admin Control Center.
          </p>
        </div>
      </div>

      {/* Device List Table (Responsive) */}
      <div className="overflow-x-auto min-w-full scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
              <th className="py-3.5 px-4 sm:px-6">Admin Device & Model</th>
              <th className="py-3.5 px-4">Admin Account</th>
              <th className="py-3.5 px-4">Client Ingress IP & Location</th>
              <th className="py-3.5 px-4">Auth Method & Security</th>
              <th className="py-3.5 px-4">Last Activity</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Session Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.deviceType);
              const isCurrent = device.isCurrentDevice;
              const isRevoked = device.status === "REVOKED";

              return (
                <tr
                  key={device.id}
                  className={`transition-colors ${
                    isCurrent
                      ? "bg-blue-50/30 hover:bg-blue-50/50"
                      : isRevoked
                      ? "opacity-60 bg-slate-50/40"
                      : "hover:bg-slate-50/60"
                  }`}
                >
                  {/* Device Model & Brand */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs truncate max-w-[200px]">
                            {device.deviceModel}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] tracking-wide">
                              This Device
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {device.os} • {device.browser}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Admin Account */}
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {device.adminName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {device.adminEmail}
                      </div>
                      <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                        {device.role}
                      </span>
                    </div>
                  </td>

                  {/* Client IP & Location */}
                  <td className="py-4 px-4">
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                        <span>{device.ip}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyIp(device.ip)}
                          className="text-slate-400 hover:text-blue-600 p-0.5 transition-colors"
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
                        <span>
                          {device.location.city}, {device.location.countryCode}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]" title={device.location.isp}>
                        {device.location.isp}
                      </div>
                    </div>
                  </td>

                  {/* Auth Method & Security */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                        <span>{device.authMethod}</span>
                      </div>
                      {device.is2FAVerified && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <Shield className="w-3 h-3 text-emerald-600" />
                          <span>2FA Verified</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Last Activity */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            device.status === "CURRENT"
                              ? "bg-emerald-500 animate-pulse"
                              : device.status === "ACTIVE"
                              ? "bg-blue-500"
                              : isRevoked
                              ? "bg-red-400"
                              : "bg-slate-300"
                          }`}
                        />
                        <span>{formatRelativeTime(device.lastActive)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Signed in: {new Date(device.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    {isCurrent ? (
                      <span className="text-[11px] font-bold text-slate-400 italic">
                        Current Session
                      </span>
                    ) : isRevoked ? (
                      <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                        Revoked
                      </span>
                    ) : confirmRevokeId === device.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onRevokeDevice(device.id);
                            setConfirmRevokeId(null);
                          }}
                          disabled={isRevoking}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg transition-all shadow-xs cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRevokeId(null)}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmRevokeId(device.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}
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
