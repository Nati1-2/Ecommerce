"use client";

import { AdminVendor } from "@/types/admin";
import { Store, Star, CheckCircle2, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  vendors: AdminVendor[];
  onApproveVendor: (id: string) => void;
}

export default function VendorPerformance({ vendors, onApproveVendor }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Marketplace Vendor Ranking</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leaderboard of highest revenue-generating stores, buyer ratings, and verification status.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Store & Owner</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Total Orders</th>
              <th className="py-3 px-4">Gross Revenue</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.logo}
                      alt={vendor.storeName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {vendor.storeName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{vendor.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vendor.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {vendor.orders.toLocaleString()} orders
                </td>
                <td className="py-3.5 px-4 text-xs font-extrabold text-slate-900 dark:text-white">
                  ${vendor.revenue.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                      vendor.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
                    )}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {vendor.status === "Pending" ? (
                    <button
                      onClick={() => onApproveVendor(vendor.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Inspecting vendor ${vendor.storeName}`)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
