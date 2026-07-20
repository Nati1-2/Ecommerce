"use client";

import { useAdminReviewStore } from "@/store/adminReviewStore";
import ModerationScore from "./ModerationScore";
import {
  X,
  Star,
  ShieldCheck,
  User,
  Store,
  Package,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function ReviewDetails() {
  const { reviewDetailsModal, setReviewDetailsModal, setApproveModalReview, setRemoveModalReview } =
    useAdminReviewStore();

  if (!reviewDetailsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 h-full max-w-xl w-full p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Review Inspection Drawer
              </h3>
              <span className="font-mono font-bold text-blue-600 text-xs px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 rounded-full">
                {reviewDetailsModal.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Submitted on {reviewDetailsModal.createdAt}</p>
          </div>
          <button onClick={() => setReviewDetailsModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Moderation Risk Analysis Widget */}
        <ModerationScore reviewId={reviewDetailsModal.id} />

        {/* Customer Profile Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={reviewDetailsModal.customerAvatar}
              alt={reviewDetailsModal.customerName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {reviewDetailsModal.customerName}
                {reviewDetailsModal.isVerifiedBuyer && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-full font-bold text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </p>
              <p className="text-slate-400">{reviewDetailsModal.customerEmail}</p>
            </div>
          </div>
        </div>

        {/* Product & Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-500" /> Target Product
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{reviewDetailsModal.productName}</p>
            <p className="text-slate-400 font-mono text-[10px]">SKU: {reviewDetailsModal.productSku}</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-500" /> Vendor Store
            </h4>
            <p className="font-bold text-slate-800 dark:text-slate-200">{reviewDetailsModal.vendorStore}</p>
            <p className="text-slate-400">Marketplace Seller</p>
          </div>
        </div>

        {/* Customer Comment & Rating */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < reviewDetailsModal.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                />
              ))}
              <span className="ml-1 font-bold text-slate-900 dark:text-white text-xs">
                {reviewDetailsModal.rating}.0 / 5.0
              </span>
            </div>
            <span className="font-bold px-2.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full text-[10px]">
              Status: {reviewDetailsModal.status}
            </span>
          </div>

          <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "{reviewDetailsModal.comment}"
          </p>

          {/* Customer Uploaded Media Gallery */}
          {reviewDetailsModal.images.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-900 dark:text-white">Uploaded Photos ({reviewDetailsModal.images.length})</h5>
              <div className="flex items-center gap-2">
                {reviewDetailsModal.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Customer upload" className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {reviewDetailsModal.status !== "Published" && (
            <button
              onClick={() => {
                setApproveModalReview(reviewDetailsModal);
                setReviewDetailsModal(null);
              }}
              className="px-4 py-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve & Publish
            </button>
          )}

          {reviewDetailsModal.status !== "Removed" && (
            <button
              onClick={() => {
                setRemoveModalReview(reviewDetailsModal);
                setReviewDetailsModal(null);
              }}
              className="px-4 py-2 font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Remove Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
