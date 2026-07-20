"use client";

import { useAdminUserStore } from "@/store/adminUserStore";
import { useUserActivity } from "@/hooks/useAdminUserQuery";
import UserActivityTimeline from "./UserActivityTimeline";
import { X, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Shield, Activity, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserProfileDrawer() {
  const { drawerUser, setDrawerUser } = useAdminUserStore();

  const { data: activities = [], isLoading } = useUserActivity(drawerUser?.id || "");

  if (!drawerUser) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerUser(null)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">User Profile Details</h3>
            <button
              onClick={() => setDrawerUser(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={drawerUser.avatar}
              alt={drawerUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{drawerUser.name}</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{drawerUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  {drawerUser.role}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    drawerUser.status === "Active"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                  )}
                >
                  {drawerUser.status}
                </span>
              </div>
            </div>
          </div>

          {/* Info Details */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{drawerUser.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{drawerUser.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Member since {drawerUser.createdAt}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Globe className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Last Login IP: {drawerUser.lastLoginIp} ({drawerUser.lastLoginLocation})</span>
            </div>
          </div>

          {/* LTV & Orders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-800/40">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Total Orders</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {drawerUser.totalOrders} orders
              </p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Total Lifetime Spent</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                ${drawerUser.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          {/* User Audit Activity Log */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" />
              User Activity Log
            </h4>
            <UserActivityTimeline events={activities} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
