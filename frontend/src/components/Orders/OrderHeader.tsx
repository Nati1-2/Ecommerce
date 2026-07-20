"use client";

import { Compass } from "lucide-react";

export default function OrderHeader() {
  return (
    <div className="space-y-1.5 select-none text-left">
      <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
        <Compass className="w-6 h-6 text-[#007BFF]" />
        My Orders
      </h2>
      <p className="text-xs text-gray-400 font-semibold tracking-wide">
        Track delivery status, request invoice downloads, and manage return orders.
      </p>
    </div>
  );
}
