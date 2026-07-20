"use client";

import { useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BillingAddress() {
  const {
    billingAddress,
    sameAsShipping,
    setBillingAddress,
    setSameAsShipping,
  } = usePaymentStore();

  const { addresses, selectedAddressId } = useCheckoutStore();

  // Find active shipping address to sync with billing address
  const activeShipping = addresses.find((a) => a.id === selectedAddressId);

  useEffect(() => {
    if (sameAsShipping && activeShipping) {
      setBillingAddress({
        name: `${activeShipping.firstName} ${activeShipping.lastName}`,
        country: activeShipping.country || "United States",
        city: activeShipping.city,
        address: activeShipping.street,
        postalCode: activeShipping.postalCode,
      });
    }
  }, [sameAsShipping, activeShipping, setBillingAddress]);

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-base font-black text-gray-900">Billing Information</h3>

      <div className="space-y-4">
        {/* Toggle option */}
        <label
          onClick={() => setSameAsShipping(!sameAsShipping)}
          className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all",
            sameAsShipping
              ? "border-[#007BFF] bg-blue-50/20"
              : "border-gray-100 hover:border-gray-200"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
              sameAsShipping
                ? "border-[#007BFF] bg-[#007BFF] text-white"
                : "border-gray-300 bg-white"
            )}
          >
            {sameAsShipping && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900">Same as shipping address</p>
            {activeShipping && sameAsShipping && (
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
                {activeShipping.firstName} {activeShipping.lastName} • {activeShipping.street}, {activeShipping.city}
              </p>
            )}
          </div>
        </label>

        {/* Display active shipping address values if synced, else form fields */}
        <AnimatePresence mode="wait">
          {!sameAsShipping ? (
            <motion.div
              key="billing-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-4 pt-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={billingAddress.name}
                    onChange={(e) => setBillingAddress({ name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Country
                  </label>
                  <select
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({ country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  Billing Address
                </label>
                <input
                  type="text"
                  value={billingAddress.address}
                  onChange={(e) => setBillingAddress({ address: e.target.value })}
                  placeholder="Street address, apartment, suite"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({ city: e.target.value })}
                    placeholder="New York"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={billingAddress.postalCode}
                    onChange={(e) => setBillingAddress({ postalCode: e.target.value })}
                    placeholder="10001"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="billing-info-synced"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 p-4 rounded-2xl bg-gray-50 border border-gray-100/50"
            >
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                Your billing details are automatically kept in sync with your selected shipping address.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
