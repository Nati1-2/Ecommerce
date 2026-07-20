"use client";

import { useState } from "react";
import { AdminReviewModel } from "@/types/adminReview";
import { useAdminReviewStore } from "@/store/adminReviewStore";
import {
  Eye,
  CheckCircle2,
  Trash2,
  Star,
  ShieldCheck,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  review: AdminReviewModel;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function ReviewRow({ review, isSelected, onToggleSelect }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const { setReviewDetailsModal, setApproveModalReview, setRemoveModalReview } =
    useAdminReviewStore();

  const getStatusBadge = (status: AdminReviewModel["status"]) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "Reported":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
      case "Removed":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <tr className={cn("hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors", isSelected && "bg-blue-50/30 dark:bg-blue-900/10")}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(review.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </td>

      {/* Customer Info */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={review.customerAvatar}
            alt={review.customerName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-xs truncate flex items-center gap-1">
              {review.customerName}
              {review.isVerifiedBuyer && (
                <span title="Verified Buyer">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </span>
              )}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{review.customerEmail}</p>
          </div>
        </div>
      </td>

      {/* Product */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-2">
          <img
            src={review.productImage}
            alt={review.productName}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{review.productName}</p>
            <p className="text-[10px] text-slate-400 font-mono">SKU: {review.productSku}</p>
          </div>
        </div>
      </td>

      {/* Vendor Store */}
      <td className="py-4 px-6">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{review.vendorStore}</span>
      </td>

      {/* Rating */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400" : "text-slate-200 dark:text-slate-700"}`}
            />
          ))}
        </div>
      </td>

      {/* Comment Snippet */}
      <td className="py-4 px-6 max-w-md">
        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 italic">
          "{review.comment}"
        </p>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getStatusBadge(review.status))}>
          {review.status}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {review.createdAt}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setReviewDetailsModal(review)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="Inspect & AI Risk Check"
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
                    setReviewDetailsModal(review);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>Inspect Review & AI</span>
                </button>

                {review.status !== "Published" && (
                  <button
                    onClick={() => {
                      setApproveModalReview(review);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                )}

                {review.status !== "Removed" && (
                  <button
                    onClick={() => {
                      setRemoveModalReview(review);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Review</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
