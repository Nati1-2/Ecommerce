"use client";

import { formatPrice } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  originalPrice: number;
  discount: number;
}

export default function ProductPrice({ price, originalPrice, discount }: ProductPriceProps) {
  return (
    <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100 p-5 rounded-2xl">
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-black text-gray-900 tracking-tight">
            {formatPrice(price)}
          </span>
          {originalPrice > price && (
            <span className="text-base text-gray-400 line-through font-semibold">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>

      {discount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-md shadow-red-500/10 shrink-0">
          -{discount}% OFF
        </span>
      )}
    </div>
  );
}
