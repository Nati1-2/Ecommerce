"use client";

import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  useAdminLoginDevices,
  useRevokeAdminDevice,
  useRevokeAllOtherAdminDevices,
} from "@/hooks/useAdminLoginDevicesQuery";
import AdminDeviceStats from "@/components/AdminLoginDevices/AdminDeviceStats";
import AdminDeviceList from "@/components/AdminLoginDevices/AdminDeviceList";
import AdminActivityLogFeed from "@/components/AdminLoginDevices/AdminActivityLogFeed";

export default function AdminLoginDevicesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminLoginDevices();
  const revokeMutation = useRevokeAdminDevice();
  const revokeAllMutation = useRevokeAllOtherAdminDevices();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRevokeOne = async (deviceId: string) => {
    try {
      const res = await revokeMutation.mutateAsync(deviceId);
      showToast(res.message || "Admin device session revoked successfully.");
    } catch (err: any) {
      showToast("Error revoking session: " + (err?.message || "Failed"));
    }
  };

  const handleRevokeAllOthers = async () => {
    try {
      const res = await revokeAllMutation.mutateAsync();
      setConfirmRevokeAll(false);
      showToast(res.message || "All other admin sessions terminated.");
    } catch (err: any) {
      showToast("Error revoking sessions: " + (err?.message || "Failed"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">
          Admin Security Feed Unavailable
        </h3>
        <p className="text-xs text-rose-600">
          {(error as Error)?.message || "Failed to load admin login sessions."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const stats = data?.stats || {
    activeAdminSessions: 0,
    totalDevicesCount: 0,
    trustedDevicesCount: 0,
    failedLoginsToday: 0,
    totalAdminActions24h: 0,
    mfaEnforcementRate: 0,
  };

  const devices = data?.devices || [];
  const activities = data?.activities || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Admin Login Devices & Activity
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Security Perimeter Active</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Hardware device management, active admin session revocation, and immutable operational action logs.
          </p>
        </div>

        {/* Global Security Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Security Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>

          {confirmRevokeAll ? (
            <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
              <button
                type="button"
                onClick={handleRevokeAllOthers}
                disabled={revokeAllMutation.isPending}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
              >
                Confirm Revoke All
              </button>
              <button
                type="button"
                onClick={() => setConfirmRevokeAll(false)}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRevokeAll(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Sign out all other admin devices except this one"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Revoke All Others</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Security KPI Stats */}
      <AdminDeviceStats stats={stats} />

      {/* 2. Admin Login Devices Table */}
      <AdminDeviceList
        devices={devices}
        onRevokeDevice={handleRevokeOne}
        isRevoking={revokeMutation.isPending}
      />

      {/* 3. Administrative Activity Audit Feed */}
      <AdminActivityLogFeed activities={activities} />
    </div>
  );
}
