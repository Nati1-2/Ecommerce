"use client";

import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export type DashboardTab =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payments"
  | "reviews"
  | "notifications"
  | "security"
  | "settings";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
}

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  onLogout,
}: DashboardSidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "security", label: "Security & Devices", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const currentItem =
    menuItems.find(
      (item) => item.id === activeTab || (item.id === "overview" && activeTab === "profile")
    ) || menuItems[0];
  const CurrentIcon = currentItem.icon;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none">
      {/* Menu item links */}
      <nav aria-label="Customer dashboard navigation" className="flex-1 space-y-1.5 py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected =
            activeTab === item.id || (item.id === "overview" && activeTab === "profile");

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "security") {
                  router.push("/account?tab=security");
                } else if (item.id === "overview") {
                  setActiveTab("overview");
                } else {
                  setActiveTab(item.id as DashboardTab);
                }
                setMobileOpen(false);
              }}
              aria-current={isSelected ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-left",
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer controls: Theme toggle & Logout */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Appearance</span>
          <ThemeToggle variant="pill" />
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button Header */}
      <div className="w-full flex md:hidden items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-tight">
              Dashboard
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block mt-0.5">
              {currentItem.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
          title="Open dashboard menu"
          aria-label="Open dashboard navigation menu"
        >
          <Menu className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          <span>Menu</span>
        </button>
      </div>

      {/* Desktop static sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shrink-0 shadow-xs sticky top-28 self-start">
        <SidebarContent />
      </aside>

      {/* Mobile drawer modal overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col md:hidden border-r border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-sm font-black text-slate-900 dark:text-white">Dashboard Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
