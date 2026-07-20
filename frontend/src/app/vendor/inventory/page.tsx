"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/services/api/vendorApi";
import { useVendorStore } from "@/store/vendorStore";
import StockModal from "@/components/vendor/inventory/StockModal";
import { InventoryItem } from "@/types/vendor";
import {
  Boxes,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Upload,
  Download,
  Edit3,
  Wifi,
  Search,
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
      showToast("Stock quantity updated successfully", "success");
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Socket.IO banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Control System</h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Wifi className="w-3 h-3 animate-pulse" />
              Socket.IO Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time warehouse stock tracking, reserve management, and low stock notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Simulated CSV Import", "info")}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => showToast("Inventory exported to CSV", "success")}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Stock</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStock}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-emerald-600 font-medium">Available</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{availableStock}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-purple-500 font-medium">Reserved (Orders)</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{reservedStock}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-amber-500 font-medium">Low Stock Items</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{lowStockCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs text-rose-500 font-medium">Out of Stock</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by product or SKU..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-6">Warehouse</th>
                <th className="py-3.5 px-6">Available</th>
                <th className="py-3.5 px-6">Reserved</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {item.productName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-700 dark:text-slate-300">
                    {item.sku}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                    {item.warehouse}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                    {item.availableStock} units
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400 font-semibold">
                    {item.reservedStock} reserved
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                        item.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40"
                          : item.status === "Low Stock"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40"
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
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
