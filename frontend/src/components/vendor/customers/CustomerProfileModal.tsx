"use client";

import { VendorCustomer } from "@/types/vendor";
import { X, Mail, MapPin, Calendar, ShoppingBag, DollarSign, Award } from "lucide-react";

interface Props {
  customer: VendorCustomer | null;
  onClose: () => void;
}

export default function CustomerProfileModal({ customer, onClose }: Props) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Banner */}
        <div className="flex items-center gap-4">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 bg-slate-100 dark:bg-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{customer.name}</h2>
              {customer.status === "VIP" && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                  <Award className="w-3 h-3" />
                  VIP Buyer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{customer.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{customer.location || "Online Marketplace"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Customer since {customer.memberSince}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShoppingBag className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Last order: {customer.lastPurchaseDate}</span>
          </div>
        </div>

        {/* LTV & Orders */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Total Store Orders</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {customer.totalOrders} orders
            </p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Lifetime Value (LTV)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              ${customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
