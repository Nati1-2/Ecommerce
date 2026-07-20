"use client";

import { useVendorRatings } from "@/hooks/useAdminReviewQuery";
import { Store, Star, AlertCircle } from "lucide-react";

export default function VendorRatings() {
  const { data: vendors = [], isLoading } = useVendorRatings();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Vendor Review Score & Quality Audit</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Seller Reputation Index</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">Vendor Store</th>
              <th className="py-2.5 px-3">Avg Rating</th>
              <th className="py-2.5 px-3">Total Reviews</th>
              <th className="py-2.5 px-3">Complaints</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {vendors.map((v) => (
              <tr key={v.vendorStore} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{v.vendorStore}</td>
                <td className="py-3 px-3 font-extrabold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {v.avgRating}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{v.totalReviews.toLocaleString()}</td>
                <td className="py-3 px-3 text-slate-500">{v.complaintCount} reports</td>
                <td className="py-3 px-3 text-right font-bold">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                      v.status === "Top Rated"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : v.status === "Good"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
