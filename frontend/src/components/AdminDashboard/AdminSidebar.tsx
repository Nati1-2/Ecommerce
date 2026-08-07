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
  usersBadge?: string | number;
  vendorsBadge?: string | number;
}

function formatBadge(val?: string | number): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
    return `${val}`;
  }
  return val;
}

export default function AdminSidebar({
  isMobile = false,
  onCloseMobile,
  usersBadge,
  vendorsBadge,
}: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdminDashboardStore();

  const formattedUsersBadge = formatBadge(usersBadge);
  const formattedVendorsBadge = formatBadge(vendorsBadge);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users, badge: formattedUsersBadge },
    { label: "Vendors", href: "/admin/vendors", icon: Store, badge: formattedVendorsBadge },
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
        "flex flex-col bg-white text-slate-600 border-r border-slate-200/80 shadow-sm transition-all duration-300 relative",
        isMobile ? "w-full h-full" : isSidebarCollapsed ? "w-20" : "w-64",
        "h-screen sticky top-0 z-30 select-none"
      )}
    >
      {/* Platform Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
        <Link
          href="/admin/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25 font-black text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base truncate tracking-tight">
                Nati Store Admin
              </div>
              <span className="text-[11px] text-blue-600 font-semibold tracking-wide">
                SuperAdmin Portal
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors absolute -right-3.5 top-7 border border-slate-200 shadow-sm"
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
              href={item.href}
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
              }}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "hover:bg-blue-50/70 text-slate-600 hover:text-blue-600"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />

              {(!isSidebarCollapsed || isMobile) && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {item.badge && (!isSidebarCollapsed || isMobile) && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-extrabold",
                    item.badge.includes("pending")
                      ? "bg-amber-100 text-amber-700"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed desktop */}
              {isSidebarCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button
          onClick={() => {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-red-600" />
          {(!isSidebarCollapsed || isMobile) && <span>Exit Super Admin</span>}
        </button>
      </div>
    </aside>
  );
}
