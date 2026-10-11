"use client";

import { VendorProduct } from "@/types/vendor";
import { AlertTriangle, PackageX, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
  products: VendorProduct[];
  onRestockQuick?: (productId: string) => void;
}

export default function InventoryAlerts({ products, onRestockQuick }: Props) {
  const alertProducts = (products || []).filter(
    (p) => p.stock !== undefined && p.stock <= (p.lowStockThreshold ?? 5)
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Inventory Stock Alerts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Products requiring replenishment in MongoDB
          </p>
        </div>
        <Link
          href="/vendor/inventory"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Manage Stock →
        </Link>
      </div>

      {alertProducts.length === 0 ? (
        <div className="py-10 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 stroke-[1.5]" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            All warehouse inventory levels are healthy!
          </p>
          <p className="text-[11px] text-slate-400">Zero items below replenishment threshold.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertProducts.map((p) => {
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 bg-white dark:bg-slate-800/50 shadow-2xs ${
                  isOutOfStock
                    ? "border-rose-200/80 dark:border-rose-900/60"
                    : "border-amber-200/80 dark:border-amber-900/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isOutOfStock
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}
                  >
                    {isOutOfStock ? <PackageX className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      SKU: <span className="font-mono">{p.sku}</span> • Stock:{" "}
                      <span className={`font-black ${isOutOfStock ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {p.stock} units
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRestockQuick && onRestockQuick(p.id)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>+25</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
