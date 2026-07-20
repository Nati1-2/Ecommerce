"use client";

import { Calendar, CreditCard, Clipboard, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderInfoCardProps {
  orderId: string;
  date: string;
  paymentStatus: string;
  status: string;
  total: number;
}

export default function OrderInfoCard({
  orderId,
  date,
  paymentStatus,
  status,
  total,
}: OrderInfoCardProps) {
  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900">Order Information</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Order ID */}
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <Clipboard className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Order Number
            </p>
            <p className="text-xs font-black text-gray-900 mt-0.5 truncate">
              {orderId}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Order Date
            </p>
            <p className="text-xs font-black text-gray-900 mt-0.5 truncate">
              {date}
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Payment Status
            </p>
            <p className="text-xs font-black text-emerald-600 mt-0.5 truncate">
              {paymentStatus}
            </p>
          </div>
        </div>

        {/* Total Price */}
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <CreditCard className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Amount Paid
            </p>
            <p className="text-xs font-black text-gray-900 mt-0.5 truncate">
              {formatPrice(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
