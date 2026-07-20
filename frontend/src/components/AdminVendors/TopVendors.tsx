"use client";

import { AdminVendorModel } from "@/types/adminVendor";
import { Award, Star, TrendingUp } from "lucide-react";

interface Props {
  vendors: AdminVendorModel[];
  onSelectVendor: (vendor: AdminVendorModel) => void;
}

export default function TopVendors({ vendors, onSelectVendor }: Props) {
  // Sort vendors by revenue descending
  const topSellers = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Marketplace Revenue Leaders</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Quarterly GMV Standings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topSellers.map((v, rank) => (
          <div
            key={v.id}
            onClick={() => onSelectVendor(v)}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 font-extrabold text-xs flex items-center justify-center">
                  #{rank + 1}
                </span>
                <img
                  src={v.logo}
                  alt={v.storeName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{v.rating}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-blue-600 dark:hover:text-blue-400">
                {v.storeName}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{v.ownerName}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Gross Sales</p>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${v.revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Orders</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {v.ordersCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
