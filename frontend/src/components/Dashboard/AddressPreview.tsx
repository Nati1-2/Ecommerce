"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { MapPin, ArrowRight } from "lucide-react";

export default function AddressPreview() {
  const { addresses, selectedAddressId } = useCheckoutStore();

  const activeShipping = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <MapPin className="w-4.5 h-4.5 text-gray-400" />
          Default Destination
        </h3>
        <button className="text-[10px] font-bold text-[#007BFF] hover:underline flex items-center gap-1 transition-all">
          Manage
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-3.5 items-start">
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/50 flex items-center justify-center shrink-0 text-gray-400">
          <MapPin className="w-4 h-4 text-[#007BFF]" />
        </div>
        <div className="flex-1 min-w-0">
          {activeShipping ? (
            <div className="text-left text-xs font-semibold leading-relaxed">
              <p className="text-gray-900 font-black">
                {activeShipping.firstName} {activeShipping.lastName}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                {activeShipping.street}
                <br />
                {activeShipping.city}, {activeShipping.state} {activeShipping.postalCode}
                <br />
                {activeShipping.country}
              </p>
            </div>
          ) : (
            <div className="text-left text-xs font-semibold leading-relaxed">
              <p className="text-gray-900 font-black">John Smith</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                123 Main Street, New York, NY 10001, USA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
