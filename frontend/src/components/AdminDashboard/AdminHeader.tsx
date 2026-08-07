"use client";

import { useState } from "react";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  Settings,
  Activity,
  ShieldCheck,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import AdminNotifications from "./AdminNotifications";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({ onOpenMobileMenu }: HeaderProps) {
  const { searchQuery, setSearchQuery, notifications, setIsAnnouncementModalOpen } =
    useAdminDashboardStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platform users, vendors, products, transactions, audit logs..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-100/80 text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Center: Live Database & System Status Pill */}
      <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 bg-emerald-50/90 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>MongoDB Database Connected</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-200/60 text-emerald-800 rounded-md font-extrabold">Live DB</span>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Broadcast Announcement Shortcut */}
        <button
          onClick={() => setIsAnnouncementModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors border border-blue-200/60"
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>

        {/* View Marketplace Storefront */}
        <Link
          href="/products"
          target="_blank"
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
          title="Open Public Marketplace"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Admin Notifications Dropdown */}
          <AdminNotifications
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Super Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
            alt="Super Admin"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-600/40"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              Nati Demo Admin
            </p>
            <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              Super Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
