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
  Globe,
  MessageSquareText,
  Bell,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Zap,
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
  return String(val);
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

  const navSections = [
    {
      title: "Core Platform",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: LineChart },
        { label: "Visitor Tracker", href: "/admin/visitors", icon: Globe, badge: "Live" },
      ],
    },
    {
      title: "E-Commerce",
      items: [
        { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Vendors", href: "/admin/vendors", icon: Store, badge: formattedVendorsBadge },
        { label: "Users", href: "/admin/users", icon: Users, badge: formattedUsersBadge },
        { label: "Payments", href: "/admin/payments", icon: CreditCard },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Reviews", href: "/admin/reviews", icon: MessageSquareText },
        { label: "Notifications", href: "/admin/notifications", icon: Bell },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-r border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-300 relative",
        isMobile ? "w-full h-full" : isSidebarCollapsed ? "w-20" : "w-64",
        "h-screen sticky top-0 z-30 select-none"
      )}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <Link
          href="/admin/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white text-base tracking-tight truncate">
                Nati Admin
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold tracking-wider uppercase">
                Enterprise Cloud
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all absolute -right-3.5 top-7 border border-slate-200 dark:border-slate-800 shadow-xs"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {(!isSidebarCollapsed || isMobile) && (
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative group",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}
                  />

                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="truncate flex-1 tracking-tight">{item.label}</span>
                  )}

                  {item.badge && (!isSidebarCollapsed || isMobile) && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1",
                        item.badge === "Live"
                          ? isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : String(item.badge).includes("pending")
                          ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                          : isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {item.badge === "Live" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
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
          </div>
        ))}
      </nav>

      {/* Logout / User Info Footer */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <button
          onClick={() => {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-600 transition-colors" />
          {(!isSidebarCollapsed || isMobile) && <span>Sign Out Portal</span>}
        </button>
      </div>
    </aside>
  );
}
