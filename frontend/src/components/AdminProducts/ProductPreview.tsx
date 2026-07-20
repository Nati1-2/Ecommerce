"use client";

import { useState } from "react";
import { useAdminProductStore } from "@/store/adminProductStore";
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function ProductPreview() {
  const { previewModalProduct, setPreviewModalProduct } = useAdminProductStore();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!previewModalProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold text-[10px] rounded-full">
              LIVE BUYER PREVIEW
            </span>
            <span className="text-xs text-slate-400">Sold by {previewModalProduct.vendorStore}</span>
          </div>
          <button onClick={() => setPreviewModalProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-square bg-slate-50 dark:bg-slate-800">
              <img
                src={previewModalProduct.images[activeImgIndex] || previewModalProduct.images[0]}
                alt={previewModalProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            {previewModalProduct.images.length > 1 && (
              <div className="flex gap-2">
                {previewModalProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${
                      activeImgIndex === idx ? "border-blue-600" : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                {previewModalProduct.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                {previewModalProduct.name}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{previewModalProduct.rating}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  In Stock ({previewModalProduct.stock} units)
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-baseline gap-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${previewModalProduct.price.toLocaleString()}
              </span>
              {previewModalProduct.msrp > previewModalProduct.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${previewModalProduct.msrp.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {previewModalProduct.description}
            </p>

            {previewModalProduct.variants.map((v) => (
              <div key={v.name} className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">{v.name}</label>
                <div className="flex gap-2">
                  {v.options.map((opt, i) => (
                    <button
                      key={opt}
                      className={`px-3 py-1.5 rounded-xl border font-bold text-xs ${
                        i === 0
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              disabled
              className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-not-allowed opacity-90"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (Storefront Mockup)</span>
            </button>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
