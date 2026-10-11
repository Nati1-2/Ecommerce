"use client";

import { AdminProduct } from "@/types/admin";
import { Package, Eye, CheckCircle2, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  products: AdminProduct[];
  onApproveProduct: (id: string) => void;
}

export default function ProductPerformance({ products, onApproveProduct }: Props) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Marketplace Product Catalog & Performance
            </h3>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {safeProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time catalog sales, merchant attribution, and moderation status from MongoDB.
          </p>
        </div>
      </div>

      {safeProducts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-2">
            No products in marketplace database yet.
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Products created by registered vendors will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {safeProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/60 transition-all hover:shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={prod.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"}
                  alt={prod.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{prod.vendorName}</p>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs inline-block mt-1",
                      prod.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    )}
                  >
                    {prod.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Sales Units</p>
                  <p className="font-black text-slate-900 dark:text-white mt-0.5">
                    {(prod.sales ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Revenue</p>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ${(prod.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {prod.status === "Reported" || prod.status === "Pending" ? (
                <button
                  onClick={() => onApproveProduct(prod.id)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                >
                  Approve Product
                </button>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    {(prod.views ?? 0).toLocaleString()} views
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${prod.price ?? 0}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
