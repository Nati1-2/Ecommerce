"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import StockModal from "@/components/vendor/inventory/StockModal";
import { InventoryItem } from "@/types/vendor";
import {
  Boxes,
  Upload,
  Download,
  Edit3,
  Wifi,
  Search,
  PackageOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorInventoryPage() {
  const queryClient = useQueryClient();
  const { showToast } = useVendorStore();
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["vendor-inventory"],
    queryFn: vendorApi.getInventory,
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      vendorApi.updateStock(productId, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      showToast("Stock quantity updated successfully in database", "success");
      setEditingItem(null);
    },
  });

  // Calculate Metrics
  const totalStock = inventory.reduce((acc, i) => acc + i.totalStock, 0);
  const availableStock = inventory.reduce((acc, i) => acc + i.availableStock, 0);
  const reservedStock = inventory.reduce((acc, i) => acc + i.reservedStock, 0);
  const lowStockCount = inventory.filter((i) => i.status === "Low Stock").length;
  const outOfStockCount = inventory.filter((i) => i.status === "Out of Stock").length;

  const filtered = inventory.filter(
    (i) =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Live Sync banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Inventory & Warehouse Control
            </h1>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Stock Sync</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time warehouse stock tracking, reserve allocations, SKU thresholds, and rapid reorders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast("Simulated CSV Import", "info")}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => showToast("Inventory exported to CSV", "success")}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Total In-Warehouse</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{totalStock}</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available to Sell</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{availableStock}</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Reserved in Orders</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{reservedStock}</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Low Stock Items</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">{lowStockCount}</p>
        </div>

        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Out of Stock</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search warehouse inventory by SKU or product..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Warehouse Facility</th>
                <th className="py-3.5 px-6">Available Stock</th>
                <th className="py-3.5 px-6">Reserved</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    Loading live warehouse inventory from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Boxes className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          No Warehouse Inventory Found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Products added to your catalog will automatically sync here for stock tracking.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0"
                        />
                        <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.sku}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {item.warehouse}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white tabular-nums">
                      {item.availableStock} units
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                      {item.reservedStock} reserved
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
                          item.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                            : item.status === "Low Stock"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      <StockModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={(productId, stock) => updateStockMutation.mutate({ productId, stock })}
      />
    </div>
  );
}
