"use client";

import { Address } from "@/types";
import { Truck, MapPin, Calendar } from "lucide-react";

interface DeliveryInfoProps {
  shippingAddress: Address;
}

export default function DeliveryInfo({ shippingAddress }: DeliveryInfoProps) {
  // Generate mock delivery date range (e.g., +5 to +7 days from now)
  const getDeliveryRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 5);
    const end = new Date(today);
    end.setDate(today.getDate() + 8);

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900">Delivery Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping address details */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Shipping Address
            </p>
            <p className="text-xs font-black text-gray-900 mt-1 leading-snug">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5 leading-snug">
              {shippingAddress.street}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Estimated arrival window */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Estimated Delivery
            </p>
            <p className="text-xs font-black text-gray-900 mt-1 leading-snug">
              {getDeliveryRange()}
            </p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5 leading-snug">
              Carrier partners will update tracking links within 24 hours of shipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
