"use client";

import { VendorProduct } from "@/types/vendor";
import { TrendingUp, ShoppingBag } from "lucide-react";

interface Props {
  products: VendorProduct[];
}

export default function TopProductsList({ products }: Props) {
  // Sort by revenue generated
  const sorted = [...products].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Performing Products</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest revenue contributors</p>
        </div>
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover bg-white shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    {product.salesCount} sold
                  </span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                ${product.revenueGenerated.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">
                ${product.price} / unit
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
