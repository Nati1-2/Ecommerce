"use client";

import { VendorProduct } from "@/types/vendor";
import { Edit3, Copy, Trash2, Eye, PackageOpen, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  products: VendorProduct[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (product: VendorProduct) => void;
}

export default function ProductTable({
  products,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDuplicate,
  onDelete,
  onPreview,
}: Props) {
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(products.map((p) => p.id));
    }
  };

  const getStatusBadge = (status: VendorProduct["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60";
      case "Draft":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "Pending":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60";
      case "Rejected":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                />
              </th>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">SKU / Brand</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Price</th>
              <th className="py-3.5 px-6">Stock Status</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Sales</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                      <PackageOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        No Products Found in Catalog
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Start selling by adding your first product with images, pricing, and variants.
                      </p>
                    </div>
                    <Link
                      href="/vendor/products/create"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Product</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <tr
                    key={product.id}
                    className={cn(
                      "hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors",
                      isSelected && "bg-blue-50/40 dark:bg-blue-950/20"
                    )}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Tag className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            ID: {product.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {product.sku}
                      </p>
                      <p className="text-[11px] text-slate-400">{product.brand}</p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {product.category}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through tabular-nums">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 tabular-nums border",
                          product.stock === 0
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900"
                            : product.stock <= product.lowStockThreshold
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                        )}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
                          getStatusBadge(product.status)
                        )}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {product.salesCount} sold
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onPreview(product)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Preview Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/vendor/products/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDuplicate(product.id)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
