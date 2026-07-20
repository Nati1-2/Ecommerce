"use client";

import { Check, Star } from "lucide-react";
import { Product } from "@/types";
import { RatingStars } from "@/components/shared/RatingStars";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const stockCount = product.stock !== undefined ? product.stock : 10;
  const features = product.features || [
    "Premium quality material construction",
    "Ergonomic, modern design details",
    "Backed by a full 1-year manufacturer warranty",
    "Environmentally friendly packaging materials"
  ];

  return (
    <div className="space-y-4">
      {/* Brand & Stock */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#007BFF] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          {product.brand}
        </span>
        <span className={`text-xs font-semibold ${stockCount <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
          {stockCount <= 5 ? `⚠️ Only ${stockCount} left in stock!` : "🟢 In Stock • Ready to ship"}
        </span>
      </div>

      {/* Product Title */}
      <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-snug tracking-tight">
        {product.name}
      </h2>

      {/* Review Rating stars */}
      <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
        <RatingStars rating={product.rating} />
        <span className="text-sm font-semibold text-gray-900 mt-0.5">{product.rating}</span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">
          ({product.reviewCount.toLocaleString()} verified customer reviews)
        </span>
      </div>

      {/* Product Description */}
      <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
        {product.description}
      </p>

      {/* Bullet Features Checklist */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Features</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-[#007BFF] shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
