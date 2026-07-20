"use client";

import { MarketplaceHealthData } from "@/types/admin";
import { Store, Package, AlertTriangle, RotateCcw, CheckCircle2, ChevronRight } from "lucide-react";

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
      title: "Active Verified Vendors",
      count: data.activeVendors.toLocaleString(),
      status: "Healthy",
      icon: Store,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Pending Vendor Applications",
      count: data.pendingVendors,
      action: "Review Vendors",
      onClick: onApproveVendorClick,
      icon: Store,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Pending Product Approvals",
      count: data.pendingProducts,
      action: "Review Catalog",
      onClick: onApproveProductClick,
      icon: Package,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Customer Complaints Flagged",
      count: data.customerComplaints,
      status: "Attention Required",
      icon: AlertTriangle,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
    },
    {
      title: "Open Refund Requests",
      count: data.refundRequests,
      status: "Processing",
      icon: RotateCcw,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Marketplace Moderation & Health</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Seller onboarding status, catalog clearance queues, and dispute resolution flags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.status && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.status}
                  </span>
                )}
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{item.count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                  {item.title}
                </p>
              </div>

              {item.action && item.onClick && (
                <button
                  onClick={item.onClick}
                  className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
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
