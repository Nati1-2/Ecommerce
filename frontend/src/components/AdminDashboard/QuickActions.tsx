"use client";

import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { Store, Package, Users, CreditCard, Megaphone, ArrowUpRight } from "lucide-react";

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
      label: "Review Vendors",
      desc: "Approve merchant applications",
      icon: Store,
      onClick: onApproveVendorClick,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
    },
    {
      label: "Moderate Catalog",
      desc: "Clear product listings",
      icon: Package,
      onClick: onReviewProductClick,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40",
    },
    {
      label: "Platform Buyers",
      desc: "Manage customer accounts",
      icon: Users,
      onClick: () => {
        window.location.href = "/admin/users";
      },
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40",
    },
    {
      label: "Stripe Escrow",
      desc: "View payout & fee ledger",
      icon: CreditCard,
      onClick: () => {
        window.location.href = "/admin/payments";
      },
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40",
    },
    {
      label: "Platform Broadcast",
      desc: "Send system announcements",
      icon: Megaphone,
      onClick: () => setIsAnnouncementModalOpen(true),
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Administrative Shortcuts & Commands
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant 1-click execution for catalog moderation, seller clearance, and broadcast notices.
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
              className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 text-left transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl ${act.color} group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 dark:text-white text-xs truncate">
                    {act.label}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                    {act.desc}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
