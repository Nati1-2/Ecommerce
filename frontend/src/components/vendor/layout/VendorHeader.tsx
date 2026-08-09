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
    <header className="sticky top-0 z-20 bg-white  border-b border-slate-200  px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600  hover:bg-slate-100  transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, SKU, orders, customers..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100  text-slate-900  rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Create Product Button */}
        <Link
          href="/vendor/products/create"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>

        {/* View Storefront */}
        <Link
          href="/products"
          target="_blank"
          className="p-2 text-slate-600  hover:bg-slate-100  rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
          title="Open Public Storefront"
        >
          <Store className="w-4 h-4 text-blue-600 " />
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600  hover:bg-slate-100  transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white  animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white  rounded-2xl shadow-2xl border border-slate-200  py-3 z-50">
              <div className="px-4 pb-3 border-b border-slate-100  flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900  text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100  text-blue-600  rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 ">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50  cursor-pointer transition-colors ${
                        !n.read ? "bg-blue-50/50 " : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 ">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600  mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ">
          {profile?.logo ? (
            <img
              src={profile.logo}
              alt={profile.storeName || "Store"}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-600/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {(profile?.storeName || "S")[0]}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900  leading-tight">
              {profile?.storeName || "Vendor Store"}
            </p>
            {profile?.verified ? (
              <div className="flex items-center gap-1 text-[10px] text-green-600  font-semibold mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Verified Seller
              </div>
            ) : (
              <span className="text-[10px] text-amber-600 font-semibold mt-0.5">
                Pending Verification
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

