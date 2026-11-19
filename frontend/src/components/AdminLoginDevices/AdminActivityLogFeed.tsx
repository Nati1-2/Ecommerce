"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Settings,
  PackageCheck,
  Store,
  DollarSign,
  KeyRound,
  Lock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AdminActivityItem, AdminActivityCategory } from "@/types/adminLoginDevices";

interface AdminActivityLogFeedProps {
  activities: AdminActivityItem[];
}

export default function AdminActivityLogFeed({
  activities,
}: AdminActivityLogFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getCategoryConfig = (category: AdminActivityCategory) => {
    switch (category) {
      case "security":
        return {
          icon: ShieldAlert,
          bg: "bg-red-50 text-red-600 border-red-200",
          label: "Security & Access",
        };
      case "system":
        return {
          icon: Settings,
          bg: "bg-blue-50 text-blue-600 border-blue-200",
          label: "System Settings",
        };
      case "catalog":
        return {
          icon: PackageCheck,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          label: "Product Catalog",
        };
      case "vendor":
        return {
          icon: Store,
          bg: "bg-purple-50 text-purple-600 border-purple-200",
          label: "Vendor Store",
        };
      case "finance":
        return {
          icon: DollarSign,
          bg: "bg-amber-50 text-amber-600 border-amber-200",
          label: "Financial & Payout",
        };
      case "auth":
      default:
        return {
          icon: KeyRound,
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          label: "Authentication",
        };
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diff < 15) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const filtered = activities.filter((act) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        act.details.toLowerCase().includes(q) ||
        act.targetResource.toLowerCase().includes(q) ||
        act.adminActor.email.toLowerCase().includes(q) ||
        act.deviceUsed.toLowerCase().includes(q) ||
        act.ip.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== "all" && act.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header & Filter Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Administrative Activity Audit Stream ({filtered.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable telemetry recording every operational action performed by authenticated admin accounts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions or IP..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all w-44 sm:w-56"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="security">🛡️ Security</option>
            <option value="system">⚙️ System Settings</option>
            <option value="catalog">📦 Product Catalog</option>
            <option value="vendor">🏪 Vendor Store</option>
            <option value="finance">💰 Finance & Payouts</option>
            <option value="auth">🔑 Authentication</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100 p-3 sm:p-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No admin activity records matching your search query.
          </div>
        ) : (
          filtered.map((act) => {
            const config = getCategoryConfig(act.category);
            const Icon = config.icon;

            return (
              <div
                key={act.id}
                className="bg-slate-50/60 hover:bg-blue-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200/60 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Icon + Action Title + Details */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center border shrink-0 ${config.bg}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                          {act.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${getSeverityBadge(
                            act.severity
                          )}`}
                        >
                          {act.severity}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {act.action}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {act.details}
                      </p>

                      <div className="text-[11px] text-indigo-700 font-semibold mt-1.5 flex items-center gap-1.5 font-mono">
                        <span>Target:</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          {act.targetResource}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Timestamp */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-700 block">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Footer Attribution Meta: Actor, Device, IP */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{act.adminActor.name}</span>
                    <span className="text-slate-400">({act.adminActor.email})</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                    <span>{act.deviceUsed}</span>
                    <span>•</span>
                    <span>{act.flag} {act.ip}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
