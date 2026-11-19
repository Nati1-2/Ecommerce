"use client";

import React from "react";
import {
  ShieldCheck,
  Laptop,
  KeyRound,
  Radio,
  AlertTriangle,
  Fingerprint,
  Lock,
} from "lucide-react";
import { AdminLoginStats } from "@/types/adminLoginDevices";

interface AdminDeviceStatsProps {
  stats: AdminLoginStats;
}

export default function AdminDeviceStats({ stats }: AdminDeviceStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Admin Sessions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Admin Sessions
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MFA Enforced</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.activeAdminSessions}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              / {stats.totalDevicesCount} devices
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
            <KeyRound className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Strict dual-token JWT access control with 15-minute rotation
        </p>
      </div>

      {/* 2. Trusted Hardware Devices */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Trusted Hardware
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            FIDO2 / TOTP
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.trustedDevicesCount}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              Enrolled
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
            <Fingerprint className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Hardware security keys & biometric authentication active
        </p>
      </div>

      {/* 3. Failed Logins */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Failed Logins (24h)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
            Zero Breaches
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-emerald-600 tracking-tight">
            {stats.failedLoginsToday}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              attempts
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Rate limit active: Max 10 attempts / 15 mins per ingress IP
        </p>
      </div>

      {/* 4. Total Admin Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Admin Actions (24h)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
            Audited
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalAdminActions24h}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              recorded
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Immutable logging with actor email, client IP, and target
        </p>
      </div>
    </div>
  );
}
