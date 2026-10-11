"use client";

import { useState } from "react";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { useSystemStatus } from "@/hooks/useAdminQuery";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  Database,
  Command,
} from "lucide-react";
import Link from "next/link";
import AdminNotifications from "./AdminNotifications";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({ onOpenMobileMenu }: HeaderProps) {
  const { searchQuery, setSearchQuery, notifications, setIsAnnouncementModalOpen } =
    useAdminDashboardStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: systemStatus } = useSystemStatus();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isDbConnected =
    systemStatus?.database === "Connected" || (systemStatus as any)?.database?.status === "connected";
  const dbLatency = (systemStatus as any)?.dbLatencyMs ?? 0;

  return (
    <header className="sticky top-0 z-20 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platform metrics, vendors, orders..."
            className="w-full pl-10 pr-12 py-2 text-xs font-semibold bg-slate-100/80 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs pointer-events-none">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Center: Live DB Connection Pill */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
        <span
          className={`w-2 h-2 rounded-full ${
            isDbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
          }`}
        />
        <Database className="w-3.5 h-3.5" />
        <span>DB: {isDbConnected ? "Online" : "Connecting"}</span>
        {dbLatency > 0 && (
          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 rounded font-black">
            {dbLatency}ms
          </span>
        )}
      </div>

      {/* Right: Actions & SuperAdmin Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Broadcast Announcement Action */}
        <button
          onClick={() => setIsAnnouncementModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-200/60 dark:border-blue-900/60 shadow-2xs focus:outline-none"
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>

        {/* View Marketplace Storefront */}
        <Link
          href="/products"
          target="_blank"
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hidden md:flex items-center gap-1.5 text-xs font-bold focus:outline-none"
          title="Open Public Marketplace Storefront"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Theme Toggle (Light / Dark mode) */}
        <ThemeToggle />

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Admin Notifications Dropdown */}
          <AdminNotifications
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* SuperAdmin Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-blue-500/20 shadow-2xs shrink-0">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">
              Platform Admin
            </p>
            <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-extrabold mt-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              Root Authority
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
