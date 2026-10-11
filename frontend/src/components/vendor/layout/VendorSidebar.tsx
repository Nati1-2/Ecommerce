"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVendorStore } from "@/store/vendorStore";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
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
  ExternalLink,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function VendorSidebar({ isMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useVendorStore();

  const { data: profile } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorApi.getProfile,
  });

  const { data: metrics } = useQuery({
    queryKey: ["vendor-metrics"],
    queryFn: vendorApi.getMetrics,
  });

  const pendingOrders = (metrics?.pendingOrdersCount ?? 0) + (metrics?.processingOrdersCount ?? 0);
  const ordersBadge = pendingOrders > 0 ? String(pendingOrders) : undefined;

  const navGroups = [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/vendor/analytics", icon: LineChart },
      ],
    },
    {
      group: "Catalog & Stock",
      items: [
        { label: "Products", href: "/vendor/products", icon: Package },
        { label: "Inventory", href: "/vendor/inventory", icon: Boxes },
      ],
    },
    {
      group: "Sales & Buyers",
      items: [
        { label: "Orders", href: "/vendor/orders", icon: ShoppingBag, badge: ordersBadge },
        { label: "Customers", href: "/vendor/customers", icon: Users },
        { label: "Reviews", href: "/vendor/reviews", icon: MessageSquareText },
      ],
    },
    {
      group: "Finances & Store",
      items: [
        { label: "Payments", href: "/vendor/payments", icon: CreditCard },
        { label: "Settings", href: "/vendor/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 relative select-none",
        isMobile ? "w-full h-full" : isSidebarCollapsed ? "w-20" : "w-64",
        "h-screen sticky top-0 z-30"
      )}
    >
      {/* Store Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <Link
          href="/vendor/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 font-bold text-lg overflow-hidden group-hover:scale-105 transition-transform">
            {profile?.logo ? (
              <img src={profile.logo} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-5 h-5" />
            )}
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="min-w-0 font-sans">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm truncate">
                {profile?.storeName || "My Store"}
                <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                Vendor Hub
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors absolute -right-3.5 top-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {(!isSidebarCollapsed || isMobile) && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/vendor/dashboard");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                    )}
                  />

                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="truncate flex-1 tracking-tight">{item.label}</span>
                  )}

                  {item.badge && (!isSidebarCollapsed || isMobile) && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isSidebarCollapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Public Storefront Link & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0 space-y-1.5">
        {(!isSidebarCollapsed || isMobile) && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Mode</span>
            <ThemeToggle variant="pill" />
          </div>
        )}
        <Link
          href="/products"
          target="_blank"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="View Marketplace Storefront"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
          {(!isSidebarCollapsed || isMobile) && <span>Live Storefront</span>}
        </Link>

        <button
          onClick={() => (window.location.href = "/login")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group",
            isSidebarCollapsed && !isMobile && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-600" />
          {(!isSidebarCollapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
