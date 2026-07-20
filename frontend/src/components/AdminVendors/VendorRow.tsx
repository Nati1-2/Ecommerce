"use client";

import { useState } from "react";
import { AdminVendorModel } from "@/types/adminVendor";
import { useAdminVendorStore } from "@/store/adminVendorStore";
import {
  Eye,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Star,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  vendor: AdminVendorModel;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function VendorRow({ vendor, isSelected, onToggleSelect }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    setReviewDrawerVendor,
    setApprovalModalVendor,
    setRejectModalVendor,
    setSuspendModalVendor,
    setProfileModalVendor,
  } = useAdminVendorStore();

  const getStatusBadge = (status: AdminVendorModel["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "Rejected":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700";
      case "Suspended":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
    }
  };

  return (
    <tr className={cn("hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors", isSelected && "bg-blue-50/30 dark:bg-blue-900/10")}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(vendor.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </td>

      {/* Store Logo & Name */}
      <td className="py-4 px-6 max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={vendor.logo}
            alt={vendor.storeName}
            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <h4
              onClick={() => setProfileModalVendor(vendor)}
              className="font-bold text-slate-900 dark:text-white text-xs truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            >
              {vendor.storeName}
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">ID: {vendor.id}</span>
          </div>
        </div>
      </td>

      {/* Owner & Email */}
      <td className="py-4 px-6">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{vendor.ownerName}</p>
        <p className="text-[11px] text-slate-400">{vendor.email}</p>
      </td>

      {/* Category */}
      <td className="py-4 px-6">
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {vendor.category}
        </span>
      </td>

      {/* Rating & Sales */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{vendor.rating}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{vendor.salesCount.toLocaleString()} sales</p>
      </td>

      {/* Revenue */}
      <td className="py-4 px-6">
        <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
          ${vendor.revenue.toLocaleString()}
        </p>
        <p className="text-[11px] text-slate-400">{vendor.ordersCount.toLocaleString()} orders</p>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full border", getStatusBadge(vendor.status))}>
          {vendor.status}
        </span>
      </td>

      {/* Verification Checklist */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
              vendor.verificationDetails.identity
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400"
            )}
            title="Identity Verification"
          >
            ID
          </span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
              vendor.verificationDetails.business
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400"
            )}
            title="Business EIN License"
          >
            BIZ
          </span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
              vendor.verificationDetails.payment
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400"
            )}
            title="Stripe Payout Bank Verification"
          >
            PAY
          </span>
        </div>
      </td>

      {/* Joined Date */}
      <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {vendor.joinedDate}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setReviewDrawerVendor(vendor)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="Review Onboarding Application"
          >
            <FileCheck className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left text-xs font-semibold">
                <button
                  onClick={() => {
                    setReviewDrawerVendor(vendor);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Review Application</span>
                </button>

                <button
                  onClick={() => {
                    setProfileModalVendor(vendor);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-500" />
                  <span>View Store Profile</span>
                </button>

                {vendor.status !== "Approved" && (
                  <button
                    onClick={() => {
                      setApprovalModalVendor(vendor);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Vendor</span>
                  </button>
                )}

                {vendor.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      setRejectModalVendor(vendor);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                )}

                {vendor.status !== "Suspended" && (
                  <button
                    onClick={() => {
                      setSuspendModalVendor(vendor);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Suspend Store</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
