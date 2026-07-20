"use client";

import { formatPrice } from "@/lib/utils";

interface PriceSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function PriceSummary({
  subtotal,
  discount,
  shipping,
  tax,
  total,
}: PriceSummaryProps) {
  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Price Details</h3>

      <div className="space-y-2.5 text-xs font-semibold">
        <div className="flex justify-between">
          <span className="text-gray-500 font-bold">Subtotal</span>
          <span className="text-gray-900 font-black">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-emerald-600 font-bold">Coupon Discount</span>
            <span className="text-emerald-600 font-black">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500 font-bold">Shipping</span>
          <span className="text-gray-900 font-black">
            {shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-bold">Estimated Tax</span>
          <span className="text-gray-900 font-black">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-baseline">
          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
            Total Paid
          </span>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
