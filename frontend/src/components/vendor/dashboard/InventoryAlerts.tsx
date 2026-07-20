"use client";

import { VendorProduct } from "@/types/vendor";
import { AlertTriangle, PackageX, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  products: VendorProduct[];
  onRestockQuick?: (productId: string) => void;
}

export default function InventoryAlerts({ products, onRestockQuick }: Props) {
  const alertProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Stock Alerts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Products requiring immediate replenishment</p>
        </div>
        <Link
          href="/vendor/inventory"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage Stock →
        </Link>
      </div>

      {alertProducts.length === 0 ? (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
          All inventory levels are healthy!
        </div>
      ) : (
        <div className="space-y-3">
          {alertProducts.map((p) => {
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isOutOfStock
                    ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
                    : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isOutOfStock ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40" : "bg-amber-100 text-amber-600 dark:bg-amber-900/40"
                    }`}
                  >
                    {isOutOfStock ? <PackageX className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      SKU: <span className="font-mono">{p.sku}</span> • Stock:{" "}
                      <span className={`font-bold ${isOutOfStock ? "text-rose-600" : "text-amber-600"}`}>
                        {p.stock} remaining
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRestockQuick && onRestockQuick(p.id)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Restock</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
