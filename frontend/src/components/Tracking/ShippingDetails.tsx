"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { Truck, Navigation, MapPin } from "lucide-react";

interface ShippingDetailsProps {
  trackingNumber: string;
  carrier: string;
}

export default function ShippingDetails({
  trackingNumber,
  carrier,
}: ShippingDetailsProps) {
  const { addresses, selectedAddressId } = useCheckoutStore();

  const activeShipping = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900">Shipment Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
        {/* Carrier info */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Carrier Partner
              </p>
              <p className="text-xs font-black text-gray-900 mt-0.5">
                {carrier} Express
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
              <Navigation className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Logistics Tracking Number
              </p>
              <p className="text-xs font-black text-gray-900 mt-0.5 font-mono select-all">
                {trackingNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Destination Address */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Delivery Address
            </p>
            {activeShipping ? (
              <div className="mt-1 space-y-0.5 text-left">
                <p className="text-xs font-black text-gray-900">
                  {activeShipping.firstName} {activeShipping.lastName}
                </p>
                <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                  {activeShipping.street}
                  <br />
                  {activeShipping.city}, {activeShipping.state} {activeShipping.postalCode}
                  <br />
                  {activeShipping.country}
                </p>
              </div>
            ) : (
              <p className="text-xs font-black text-gray-900 mt-0.5">
                John Smith • 123 Main Street, New York
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
