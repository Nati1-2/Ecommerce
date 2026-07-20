"use client";

import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Store, Package, Users, CreditCard, Megaphone, ShieldCheck } from "lucide-react";

interface Props {
  onApproveVendorClick: () => void;
  onReviewProductClick: () => void;
}

export default function QuickActions({
  onApproveVendorClick,
  onReviewProductClick,
}: Props) {
  const setIsAnnouncementModalOpen = useAdminDashboardStore((state) => state.setIsAnnouncementModalOpen);
  const showToast = useAdminDashboardStore((state) => state.showToast);

  const actions = [
    {
      label: "Approve Vendors",
      desc: "Review seller applications",
      icon: Store,
      onClick: onApproveVendorClick,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100",
    },
    {
      label: "Review Products",
      desc: "Approve catalog submissions",
      icon: Package,
      onClick: onReviewProductClick,
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100",
    },
    {
      label: "Manage Users",
      desc: "View buyer accounts & security",
      icon: Users,
      onClick: () => showToast("Opening User Management Panel", "info"),
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100",
    },
    {
      label: "View Payments",
      desc: "Stripe escrow & payouts",
      icon: CreditCard,
      onClick: () => showToast("Opening Payments & Escrow Ledger", "info"),
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100",
    },
    {
      label: "Send Announcement",
      desc: "Broadcast platform alert",
      icon: Megaphone,
      onClick: () => setIsAnnouncementModalOpen(true),
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin Quick Shortcuts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            1-click actions for seller approval, catalog clearance, and announcements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.label}
              onClick={act.onClick}
              className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-left transition-all flex items-start gap-3.5 group ${act.color}`}
            >
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {act.label}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
