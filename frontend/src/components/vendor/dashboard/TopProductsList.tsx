"use client";

import { VendorProduct } from "@/types/vendor";
import { TrendingUp, ShoppingBag, Package } from "lucide-react";

interface Props {
  products: VendorProduct[];
}

export default function TopProductsList({ products }: Props) {
  // Sort by revenue generated
  const sorted = [...(products || [])].sort((a, b) => (b.revenueGenerated || 0) - (a.revenueGenerated || 0)).slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Top Performing Products
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest grossing catalog items</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-10 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">
            No products listed in your store yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/60 transition-all hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      {product.salesCount ?? 0} sold
                    </span>
                    <span>•</span>
                    <span className="font-mono">SKU: {product.sku}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  ${(product.revenueGenerated ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800 mt-1 inline-block">
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
