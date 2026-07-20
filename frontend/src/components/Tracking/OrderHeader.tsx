"use client";

import { useTrackingStore } from "@/store/trackingStore";
import { Clipboard, Phone, Calendar, Compass } from "lucide-react";

interface OrderHeaderProps {
  orderId: string;
  placedDate: string;
}

export default function OrderHeader({ orderId, placedDate }: OrderHeaderProps) {
  const { orderStatus, deliveryTime } = useTrackingStore();

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Badge status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Tracking Number
            </span>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full select-all">
              {orderId}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 mt-1">
            <Compass className="w-6 h-6 text-[#007BFF] animate-spin" style={{ animationDuration: "10s" }} />
            {orderStatus}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <button className="py-2.5 px-4 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            Support Help
          </button>
        </div>
      </div>

      {/* Date metadata grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs font-semibold">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Placed Date
            </p>
            <p className="text-gray-900 font-black mt-0.5">{placedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Estimated Delivery
            </p>
            <p className="text-gray-900 font-black mt-0.5">{deliveryTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
