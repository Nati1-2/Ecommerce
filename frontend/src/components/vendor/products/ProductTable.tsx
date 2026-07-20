"use client";

import { VendorProduct } from "@/types/vendor";
import { Edit3, Copy, Trash2, Eye, MoreHorizontal, AlertCircle } from "lucide-react";
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
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40";
      case "Draft":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40";
      case "Rejected":
        return "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </th>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">SKU / Brand</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Price</th>
              <th className="py-3.5 px-6">Stock</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Sales</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                  No products found matching your filters.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <tr
                    key={product.id}
                    className={cn(
                      "hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors",
                      isSelected && "bg-blue-50/40 dark:bg-blue-900/10"
                    )}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {product.id}
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
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300">
                      {product.category}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discountPrice && (
                        <span className="text-[10px] text-emerald-600 line-through">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-md",
                          product.stock === 0
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                            : product.stock <= product.lowStockThreshold
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                            : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                          getStatusBadge(product.status)
                        )}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
