"use client";

import { VendorProduct } from "@/types/vendor";
import { X, Star, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface Props {
  product: VendorProduct | null;
  onClose: () => void;
}

export default function ProductPreviewModal({ product, onClose }: Props) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
          Storefront Preview Mode
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="h-64 sm:h-72 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === img ? "border-blue-600" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{product.brand}</p>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{product.name}</h2>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white ml-1">4.9</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">In Stock ({product.stock} available)</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed line-clamp-4">
                {product.description}
              </p>

              {/* Variants Selection */}
              {product.variants.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Option</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVariant === v.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Add To Cart */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Shopping Cart
              </button>

              <div className="flex items-center justify-around text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-500" />
                  {product.deliveryTimeDays}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Official Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
