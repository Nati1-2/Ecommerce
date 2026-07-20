"use client";

import { useTrackingStore } from "@/store/trackingStore";
import { MessageCircle, XCircle, RefreshCw, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrackingActions() {
  const { orderStatus } = useTrackingStore();

  // Cancel is only allowed before package departs fulfillment center ("Order Placed", "Payment Confirmed", "Order Processing")
  const canCancel =
    orderStatus === "Order Placed" ||
    orderStatus === "Payment Confirmed" ||
    orderStatus === "Order Processing";

  // Return is only allowed after delivery ("Delivered")
  const canReturn = orderStatus === "Delivered";

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Manage Shipment</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Contact Courier */}
        <button className="py-3 px-4 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          Contact Courier
        </button>

        {/* Buy Again */}
        <button className="py-3 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-500/10">
          <ShoppingCart className="w-4 h-4" />
          Buy Items Again
        </button>

        {/* Cancel Order (conditional) */}
        {canCancel && (
          <button className="sm:col-span-2 py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
            <XCircle className="w-4 h-4 text-red-400" />
            Cancel Shipment
          </button>
        )}

        {/* Return Product (conditional) */}
        {canReturn && (
          <button className="sm:col-span-2 py-3 px-4 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" style={{ animationDuration: "3s" }} />
            Request Return / Exchange
          </button>
        )}
      </div>
    </div>
  );
}
