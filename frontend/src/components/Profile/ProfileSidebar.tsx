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
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ProfileTab =
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
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
        {menuItems.map((item) => {
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
                "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200",
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
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Drawer bar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-[104px] z-30">
        <span className="text-xs font-black text-gray-900 capitalize">
          Profile Settings: {activeTab}
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-gray-50 border border-gray-100 rounded-xl"
        >
          <Menu className="w-4.5 h-4.5 text-gray-700" />
        </button>
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
