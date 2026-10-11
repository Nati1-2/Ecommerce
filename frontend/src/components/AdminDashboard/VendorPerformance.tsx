"use client";

import { AdminVendor } from "@/types/admin";
import { Store, Star, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  vendors: AdminVendor[];
  onApproveVendor: (id: string) => void;
}

export default function VendorPerformance({ vendors, onApproveVendor }: Props) {
  const safeVendors = Array.isArray(vendors) ? vendors : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Marketplace Vendor Performance & Verification
            </h3>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {safeVendors.length} Stores
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-vendor ledger: GMV sales volume, customer feedback scores, and merchant verification.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Store & Merchant</th>
              <th className="py-3 px-4">Buyer Rating</th>
              <th className="py-3 px-4">Total Orders</th>
              <th className="py-3 px-4">Gross Revenue</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {safeVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Store className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      No vendor profiles registered in MongoDB yet.
                    </p>
                    <p className="text-xs text-slate-400">
                      When vendors register and create stores, their real-time performance will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              safeVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vendor.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"}
                        alt={vendor.storeName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                          {vendor.storeName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{typeof vendor.rating === "number" ? vendor.rating.toFixed(1) : "5.0"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {(vendor.orders ?? 0).toLocaleString()} orders
                  </td>
                  <td className="py-4 px-4 text-xs font-black text-slate-900 dark:text-white">
                    ${(vendor.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full border shadow-2xs inline-flex items-center gap-1",
                        vendor.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/80 dark:border-amber-800"
                      )}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {vendor.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {vendor.status === "Pending" ? (
                      <button
                        onClick={() => onApproveVendor(vendor.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                      >
                        Approve Store
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
