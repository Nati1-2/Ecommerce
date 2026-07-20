"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  LineChart,
  MessageSquareText,
  Bell,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ isMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdminDashboardStore();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users, badge: "125k" },
    { label: "Vendors", href: "/admin/vendors", icon: Store, badge: "18 pending" },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: LineChart },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquareText },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 relative",
        isMobile ? "w-full h-full" : isSidebarCollapsed ? "w-20" : "w-64",
        "h-screen sticky top-0 z-30 select-none"
      )}
    >
      {/* Platform Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <Link
          href="/admin/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30 font-black text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-white text-base truncate">
                Apex Admin
              </div>
              <span className="text-[11px] text-blue-400 font-semibold tracking-wide">
                Marketplace Engine
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors absolute -right-3.5 top-7 border border-slate-800 shadow-md"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href === "/admin/dashboard" ? "/admin/dashboard" : "#"}
              onClick={(e) => {
                if (item.href !== "/admin/dashboard") {
                  e.preventDefault();
                  alert(`Navigating to ${item.label} section`);
                }
                if (onCloseMobile) onCloseMobile();
              }}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
                isActive
                  ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25"
                  : "hover:bg-slate-900 hover:text-white text-slate-400"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />

              {(!isSidebarCollapsed || isMobile) && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {item.badge && (!isSidebarCollapsed || isMobile) && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    item.badge.includes("pending")
                      ? "bg-amber-500/20 text-amber-400"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-500/20 text-blue-400"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed desktop */}
              {isSidebarCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-900 shrink-0">
        <button
          onClick={() => alert("Logged out from Admin Console")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-400" />
          {(!isSidebarCollapsed || isMobile) && <span>Exit Super Admin</span>}
        </button>
      </div>
    </aside>
  );
}
