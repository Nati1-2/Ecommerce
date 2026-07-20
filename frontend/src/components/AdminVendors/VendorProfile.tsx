"use client";

import { useAdminVendorStore } from "@/store/adminVendorStore";
import VendorAnalytics from "./VendorAnalytics";
import { X, Store, Star, ShoppingBag, DollarSign, User, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorProfile() {
  const { profileModalVendor, setProfileModalVendor } = useAdminVendorStore();

  if (!profileModalVendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={profileModalVendor.logo}
              alt={profileModalVendor.storeName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {profileModalVendor.storeName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  {profileModalVendor.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {profileModalVendor.id}</p>
            </div>
          </div>
          <button onClick={() => setProfileModalVendor(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-800">
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Gross Revenue</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              ${profileModalVendor.revenue.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-800">
            <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Total Orders</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {profileModalVendor.ordersCount.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-800">
            <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Buyer Rating</p>
            <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-900 dark:text-white text-lg">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{profileModalVendor.rating}</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Seller Score</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              98 / 100
            </p>
          </div>
        </div>

        {/* Contact & Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Owner: <strong>{profileModalVendor.ownerName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Email: <strong>{profileModalVendor.email}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Phone: <strong>{profileModalVendor.phone}</strong></span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Store className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Legal Entity: <strong>{profileModalVendor.businessName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Tax ID (EIN): <strong className="font-mono">{profileModalVendor.taxId}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Onboarded: <strong>{profileModalVendor.joinedDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Recharts Analytics Chart */}
        <VendorAnalytics vendorId={profileModalVendor.id} />

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => setProfileModalVendor(null)}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
