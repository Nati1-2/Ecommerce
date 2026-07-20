"use client";

import { useState } from "react";
import { useAdminProductStore } from "@/store/adminProductStore";
import ProductQualityCheck from "./ProductQualityCheck";
import {
  X,
  FileCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Tag,
  DollarSign,
  Package,
  Globe,
  Store,
} from "lucide-react";

export default function ProductReviewDrawer() {
  const {
    reviewDrawerProduct,
    setReviewDrawerProduct,
    setApproveModalProduct,
    setRejectModalProduct,
    setRequestChangesProduct,
    setPreviewModalProduct,
  } = useAdminProductStore();

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!reviewDrawerProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setReviewDrawerProduct(null)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Product Moderation Review
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {reviewDrawerProduct.sku}</p>
              </div>
            </div>
            <button
              onClick={() => setReviewDrawerProduct(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* High-Res Image Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-800">
              <img
                src={reviewDrawerProduct.images[activeImgIndex] || reviewDrawerProduct.images[0]}
                alt={reviewDrawerProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {reviewDrawerProduct.images.length > 1 && (
              <div className="flex items-center gap-2">
                {reviewDrawerProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImgIndex === idx
                        ? "border-blue-600 ring-2 ring-blue-500/30"
                        : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Overview */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                {reviewDrawerProduct.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <Store className="w-3.5 h-3.5 text-blue-500" />
                {reviewDrawerProduct.vendorStore}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
              {reviewDrawerProduct.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {reviewDrawerProduct.description}
            </p>
          </div>

          {/* Pricing & Inventory Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold">Marketplace Price</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                ${reviewDrawerProduct.price.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold">MSRP Retail Price</p>
              <p className="text-base font-bold text-slate-500 line-through mt-0.5">
                ${reviewDrawerProduct.msrp.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold">Inventory Stock</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {reviewDrawerProduct.stock} units
              </p>
            </div>
          </div>

          {/* Automated Quality Checklist Widget */}
          <ProductQualityCheck check={reviewDrawerProduct.qualityCheck} />

          {/* Variants */}
          {reviewDrawerProduct.variants.length > 0 && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Product Variants & Options</h4>
              <div className="space-y-1.5">
                {reviewDrawerProduct.variants.map((v) => (
                  <div key={v.name} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{v.name}:</span>
                    <div className="flex gap-1">
                      {v.options.map((opt) => (
                        <span key={opt} className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => {
                setPreviewModalProduct(reviewDrawerProduct);
              }}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              Live Preview
            </button>

            <button
              onClick={() => {
                setRequestChangesProduct(reviewDrawerProduct);
                setReviewDrawerProduct(null);
              }}
              className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Request Changes
            </button>

            <button
              onClick={() => {
                setRejectModalProduct(reviewDrawerProduct);
                setReviewDrawerProduct(null);
              }}
              className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>

            <button
              onClick={() => {
                setApproveModalProduct(reviewDrawerProduct);
                setReviewDrawerProduct(null);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
