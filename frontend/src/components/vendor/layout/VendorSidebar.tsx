"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVendorStore } from "@/store/vendorStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  MessageSquareText,
  LineChart,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function VendorSidebar({ isMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useVendorStore();

  const navItems = [
    { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/vendor/products", icon: Package },
    { label: "Inventory", href: "/vendor/inventory", icon: Boxes },
    { label: "Orders", href: "/vendor/orders", icon: ShoppingBag, badge: "12" },
    { label: "Customers", href: "/vendor/customers", icon: Users },
    { label: "Reviews", href: "/vendor/reviews", icon: MessageSquareText },
    { label: "Analytics", href: "/vendor/analytics", icon: LineChart },
    { label: "Payments", href: "/vendor/payments", icon: CreditCard },
    { label: "Settings", href: "/vendor/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 relative",
        isMobile ? "w-full h-full" : isSidebarCollapsed ? "w-20" : "w-64",
        "h-screen sticky top-0 z-30 select-none"
      )}
    >
      {/* Store Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <Link
          href="/vendor/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20 font-bold text-lg">
            <Store className="w-5 h-5" />
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-white text-base truncate">
                Apex Tech Labs
                <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Seller Portal</span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors absolute -right-3.5 top-7 border border-slate-700 shadow-md"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "hover:bg-slate-800/80 hover:text-white text-slate-400"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />

              {(!isSidebarCollapsed || isMobile) && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {item.badge && (!isSidebarCollapsed || isMobile) && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isSidebarCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout Footer */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={() => alert("Logged out from Seller Account")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-400" />
          {(!isSidebarCollapsed || isMobile) && <span>Logout Seller</span>}
        </button>
      </div>
    </aside>
  );
}
