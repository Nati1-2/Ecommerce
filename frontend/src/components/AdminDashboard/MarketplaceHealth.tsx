"use client";

import { MarketplaceHealthData } from "@/types/admin";
import { Store, Package, AlertTriangle, RotateCcw, CheckCircle2, ChevronRight, ShieldAlert } from "lucide-react";

interface Props {
  data: MarketplaceHealthData;
  onApproveVendorClick: () => void;
  onApproveProductClick: () => void;
}

export default function MarketplaceHealth({
  data,
  onApproveVendorClick,
  onApproveProductClick,
}: Props) {
  const items = [
    {
      title: "Verified Active Sellers",
      count: (data?.activeVendors ?? 0).toLocaleString(),
      status: "Operational",
      icon: Store,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40",
    },
    {
      title: "Vendor Onboarding Queue",
      count: data?.pendingVendors ?? 0,
      action: "Review Sellers",
      onClick: onApproveVendorClick,
      icon: Store,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40",
      highlight: (data?.pendingVendors ?? 0) > 0,
    },
    {
      title: "Catalog Clearance Queue",
      count: data?.pendingProducts ?? 0,
      action: "Clear Catalog",
      onClick: onApproveProductClick,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40",
      highlight: (data?.pendingProducts ?? 0) > 0,
    },
    {
      title: "Flagged Feedback Issues",
      count: data?.customerComplaints ?? 0,
      status: (data?.customerComplaints ?? 0) > 0 ? "Requires Review" : "Clear",
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40",
    },
    {
      title: "Open Return / Refund Cases",
      count: data?.refundRequests ?? 0,
      status: (data?.refundRequests ?? 0) > 0 ? "In Escrow" : "Settled",
      icon: RotateCcw,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Marketplace Moderation & Compliance Health
            </h3>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/80 dark:border-blue-800">
              Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time seller onboarding queue, catalog compliance status, and buyer satisfaction monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`p-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 ${
                item.highlight
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/20 shadow-xs"
                  : "border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.status && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {item.status}
                  </span>
                )}
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {item.count}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 truncate">
                  {item.title}
                </p>
              </div>

              {item.action && item.onClick && (
                <button
                  onClick={item.onClick}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs hover:shadow-md"
                >
                  <span>{item.action}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
