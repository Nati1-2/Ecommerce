"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { MapPin, ArrowRight } from "lucide-react";

export default function AddressPreview({ onManage }: { onManage?: () => void }) {
  const { addresses, selectedAddressId } = useCheckoutStore();

  const activeShipping = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          Default Destination
        </h3>
        <button
          onClick={onManage}
          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex gap-3.5 items-start">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          {activeShipping ? (
            <div className="text-left text-xs font-semibold leading-relaxed">
              <p className="text-slate-900 dark:text-white font-black truncate">
                {activeShipping.firstName} {activeShipping.lastName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {activeShipping.street}
                <br />
                {activeShipping.city}, {activeShipping.state} {activeShipping.postalCode}
                <br />
                {activeShipping.country}
              </p>
            </div>
          ) : (
            <div className="text-left text-xs space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-bold">No saved addresses</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Add an address to speed up checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
