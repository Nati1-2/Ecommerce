"use client";

import { useProductRatings } from "@/hooks/useAdminReviewQuery";
import { Package, Star } from "lucide-react";

export default function ProductRatings() {
  const { data: products = [], isLoading } = useProductRatings();

  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Product Rating Performance</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Top & Lowest Rated</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3">Vendor Store</th>
              <th className="py-2.5 px-3">Total Reviews</th>
              <th className="py-2.5 px-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {products.map((p) => (
              <tr key={p.productName} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{p.productName}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{p.vendorStore}</td>
                <td className="py-3 px-3 text-slate-500">{p.totalReviews.toLocaleString()} reviews</td>
                <td className="py-3 px-3 text-right font-extrabold text-amber-500 flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
