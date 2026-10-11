"use client";

import { useState } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import {
  Menu,
  Search,
  Bell,
  Plus,
  ExternalLink,
  CheckCircle2,
  X,
  Store,
  Database,
  Radio,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export default function VendorHeader({ onOpenMobileMenu }: HeaderProps) {
  const { searchQuery, setSearchQuery, notifications, markNotificationRead } = useVendorStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorApi.getProfile,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle, Search, & MongoDB Live Status */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input with ⌘K badge */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, inventory SKU, buyers..."
            className="w-full pl-10 pr-12 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-850 transition-all placeholder:text-slate-400"
          />
          <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>

        {/* Live MongoDB Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>MongoDB Live • 12ms</span>
        </div>
      </div>

      {/* Right: Actions, Notifications, & Merchant Identity */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Add Product */}
        <Link
          href="/vendor/products/create"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </Link>

        {/* Public Storefront Link */}
        <Link
          href="/products"
          target="_blank"
          className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden md:inline-flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Open Marketplace Storefront"
        >
          <Store className="w-3.5 h-3.5 text-blue-600" />
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative border border-slate-200/60 dark:border-slate-700/60"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
              <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">Merchant Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-900">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                    <Radio className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                    <p>No new vendor notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !n.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Merchant Name */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          {profile?.logo ? (
            <img
              src={profile.logo}
              alt={profile.storeName || "Store"}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-500/20">
              {(profile?.storeName || "S")[0]}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {profile?.storeName || "Vendor Store"}
            </p>
            {profile?.verified ? (
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                Verified Merchant
              </div>
            ) : (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                Pending Verification
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
