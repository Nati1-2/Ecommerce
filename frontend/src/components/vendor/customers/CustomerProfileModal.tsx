"use client";

import { VendorCustomer } from "@/types/vendor";
import { X, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Award } from "lucide-react";

interface Props {
  customer: VendorCustomer | null;
  onClose: () => void;
}

export default function CustomerProfileModal({ customer, onClose }: Props) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white  rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200  shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600  hover:bg-slate-100  transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Banner */}
        <div className="flex items-center gap-4">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 ">{customer.name}</h2>
              {customer.status === "VIP" && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-100  text-amber-600  rounded-full">
                  <Award className="w-3 h-3" />
                  VIP Member
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{customer.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-slate-50  rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-slate-600 ">
            <Phone className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 ">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{customer.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 ">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Member since {customer.memberSince}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 ">
            <ShoppingBag className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Last order: {customer.lastPurchaseDate}</span>
          </div>
        </div>

        {/* LTV & Orders */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-blue-50  rounded-2xl border border-blue-200 ">
            <p className="text-xs font-semibold text-blue-600 ">Total Lifetime Orders</p>
            <p className="text-2xl font-bold text-slate-900  mt-1">{customer.totalOrders} orders</p>
          </div>
          <div className="p-4 bg-emerald-50  rounded-2xl border border-emerald-200 ">
            <p className="text-xs font-semibold text-emerald-600 ">Lifetime Spent (LTV)</p>
            <p className="text-2xl font-bold text-slate-900  mt-1">
              ${customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
