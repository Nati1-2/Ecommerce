"use client";

import { cn } from "@/lib/utils";
import {
  User,
  ShieldCheck,
  MapPin,
  CreditCard,
  ShoppingBag,
  Heart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type ProfileTab =
  | "dashboard"
  | "overview"
  | "personal"
  | "security"
  | "addresses"
  | "payments"
  | "orders"
  | "wishlist"
  | "notifications"
  | "settings";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  onLogout,
}: ProfileSidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileMenuItems = [
    { id: "overview", label: "Profile Overview", icon: UserCheck },
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security & 2FA", icon: ShieldCheck },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex-1 space-y-1.5 py-4 px-3">
        {/* Prominent User Dashboard Button */}
        <button
          onClick={() => {
            router.push("/dashboard");
            setMobileOpen(false);
          }}
          className="w-full flex items-center justify-between px-4 py-3 mb-2.5 rounded-2xl text-xs font-bold bg-blue-50/90 hover:bg-blue-100 text-[#007BFF] border border-blue-200/80 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#007BFF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              <LayoutDashboard className="w-3.5 h-3.5" />
            </div>
            <span>User Dashboard</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#007BFF] text-white rounded-full">
            Main
          </span>
        </button>

        {profileMenuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer",
                isSelected
                  ? "bg-[#007BFF] text-white shadow-lg shadow-blue-500/15"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const currentItem =
    profileMenuItems.find((item) => item.id === activeTab) || profileMenuItems[0];
  const CurrentIcon = currentItem.icon;

  return (
    <>
      {/* Mobile Toggle Drawer bar */}
      <div className="w-full flex md:hidden items-center justify-between gap-3 p-3 bg-white border border-gray-200/90 rounded-2xl shadow-sm mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] border border-blue-100 flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-tight">
              Profile Settings
            </span>
            <span className="text-xs font-black text-gray-900 truncate block mt-0.5">
              {currentItem.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-[#007BFF] border border-blue-200/80 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
            title="Go to User Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
            title="Open account menu"
          >
            <Menu className="w-4 h-4 text-gray-700" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Desktop static sidebar */}
      <aside className="hidden md:block w-64 bg-white border border-gray-100 rounded-3xl overflow-hidden shrink-0 shadow-sm sticky top-28 self-start">
        <SidebarContent />
      </aside>

      {/* Mobile modal slider drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="text-sm font-black text-gray-900">Account Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900"
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
