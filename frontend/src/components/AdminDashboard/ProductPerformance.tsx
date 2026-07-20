"use client";

import { AdminProduct } from "@/types/admin";
import { Package, Eye, CheckCircle2, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  products: AdminProduct[];
  onApproveProduct: (id: string) => void;
}

export default function ProductPerformance({ products, onApproveProduct }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Product Catalog & Best Sellers</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Top grossing catalog items, view counts, and copyright review status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {prod.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">{prod.vendorName}</p>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.2 rounded-full border inline-block mt-1",
                    prod.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800"
                  )}
                >
                  {prod.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Total Sales</p>
                <p className="font-extrabold text-slate-900 dark:text-white">
                  {prod.sales.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Revenue</p>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${(prod.revenue / 1000).toFixed(1)}k
                </p>
              </div>
            </div>

            {prod.status === "Reported" ? (
              <button
                onClick={() => onApproveProduct(prod.id)}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Clear Flag & Approve
              </button>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {prod.views.toLocaleString()} views
                </span>
                <span className="font-mono font-semibold">${prod.price}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
