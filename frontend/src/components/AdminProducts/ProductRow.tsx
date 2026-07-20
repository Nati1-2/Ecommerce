"use client";

import { useState } from "react";
import { AdminProductModel } from "@/types/adminProduct";
import { useAdminProductStore } from "@/store/adminProductStore";
import {
  FileCheck,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Trash2,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  product: AdminProductModel;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, isSelected, onToggleSelect, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    setReviewDrawerProduct,
    setApproveModalProduct,
    setRejectModalProduct,
    setRequestChangesProduct,
    setPreviewModalProduct,
  } = useAdminProductStore();

  const getStatusBadge = (status: AdminProductModel["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "Reported":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
      case "Rejected":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700";
      default:
        return "bg-purple-50 text-purple-600 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800";
    }
  };

  return (
    <tr className={cn("hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors", isSelected && "bg-blue-50/30 dark:bg-blue-900/10")}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </td>

      {/* Image & Title */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80"}
            alt={product.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <h4
              onClick={() => setReviewDrawerProduct(product)}
              className="font-bold text-slate-900 dark:text-white text-xs truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            >
              {product.name}
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
        </div>
      </td>

      {/* Vendor Store */}
      <td className="py-4 px-6">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.vendorStore}</p>
        <p className="text-[11px] text-slate-400">ID: {product.vendorId}</p>
      </td>

      {/* Category */}
      <td className="py-4 px-6">
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {product.category}
        </span>
      </td>

      {/* Price */}
      <td className="py-4 px-6">
        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
          ${product.price.toLocaleString()}
        </p>
        {product.msrp > product.price && (
          <p className="text-[10px] text-slate-400 line-through">${product.msrp.toLocaleString()}</p>
        )}
      </td>

      {/* Stock Level */}
      <td className="py-4 px-6">
        <span
          className={cn(
            "text-[11px] font-bold px-2 py-0.5 rounded-full",
            product.stock > 10
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : product.stock > 0
              ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
              : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
          )}
        >
          {product.stock} in stock
        </span>
      </td>

      {/* Rating */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{product.rating}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getStatusBadge(product.status))}>
          {product.status}
        </span>
      </td>

      {/* Created Date */}
      <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {product.createdAt}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setReviewDrawerProduct(product)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="Review Product Submission"
          >
            <FileCheck className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPreviewModalProduct(product)}
            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
            title="Customer View Live Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left text-xs font-semibold">
                <button
                  onClick={() => {
                    setReviewDrawerProduct(product);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Review Submission</span>
                </button>

                <button
                  onClick={() => {
                    setPreviewModalProduct(product);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-500" />
                  <span>Customer Preview</span>
                </button>

                {product.status !== "Approved" && (
                  <button
                    onClick={() => {
                      setApproveModalProduct(product);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Product</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setRequestChangesProduct(product);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>

                {product.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      setRejectModalProduct(product);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Product</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onDelete(product.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Listing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
