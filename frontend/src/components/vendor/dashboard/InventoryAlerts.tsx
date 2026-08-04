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
    <div className="bg-white  p-6 rounded-3xl border border-slate-100  shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 ">Inventory Stock Alerts</h3>
          <p className="text-xs text-slate-500  mt-0.5">Products requiring immediate replenishment</p>
        </div>
        <Link
          href="/vendor/inventory"
          className="text-xs font-semibold text-blue-600  hover:underline"
        >
          Manage Stock →
        </Link>
      </div>

      {alertProducts.length === 0 ? (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-50  rounded-2xl">
          All inventory levels are healthy!
        </div>
      ) : (
        <div className="space-y-3">
          {alertProducts.map((p) => {
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 bg-white  ${
                  isOutOfStock
                    ? "border-rose-100 "
                    : "border-amber-100 "
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isOutOfStock ? "bg-rose-100 text-rose-600 " : "bg-amber-100 text-amber-600 "
                    }`}
                  >
                    {isOutOfStock ? <PackageX className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900  truncate">{p.name}</h4>
                    <p className="text-[11px] text-slate-500  mt-0.5">
                      SKU: <span className="font-mono">{p.sku}</span> • Stock:{" "}
                      <span className={`font-bold ${isOutOfStock ? "text-rose-600" : "text-amber-600"}`}>
                        {p.stock} remaining
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRestockQuick && onRestockQuick(p.id)}
                  className="px-3 py-1.5 bg-white  text-slate-900  border border-slate-200  hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-sm"
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
