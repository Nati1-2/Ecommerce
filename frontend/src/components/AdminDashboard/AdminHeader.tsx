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
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            placeholder="Search platform users, vendors, products, transactions, audit logs..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Center: System Status Pill */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800/50">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>All Systems Operational (99.99% Uptime)</span>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Broadcast Announcement Shortcut */}
        <button
          onClick={() => setIsAnnouncementModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-colors"
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>

        {/* View Marketplace Storefront */}
        <Link
          href="/products"
          target="_blank"
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
          title="Open Public Marketplace"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Admin Notifications Dropdown */}
          <AdminNotifications
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Super Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
            alt="Super Admin"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-600/40"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Sarah Jenkins
            </p>
            <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              Super Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
