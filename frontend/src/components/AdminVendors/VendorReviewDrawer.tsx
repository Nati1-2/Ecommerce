"use client";

import { useAdminVendorStore } from "@/store/adminVendorStore";
import {
  X,
  FileCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  User,
  CreditCard,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function VendorReviewDrawer() {
  const {
    reviewDrawerVendor,
    setReviewDrawerVendor,
    setApprovalModalVendor,
    setRejectModalVendor,
  } = useAdminVendorStore();

  if (!reviewDrawerVendor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setReviewDrawerVendor(null)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Vendor Onboarding Review
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Application ID: {reviewDrawerVendor.id}</p>
              </div>
            </div>
            <button
              onClick={() => setReviewDrawerVendor(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner & Store Header */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src={reviewDrawerVendor.banner}
              alt="Store Banner"
              className="w-full h-28 object-cover"
            />
            <div className="p-4 bg-white dark:bg-slate-900 flex items-center gap-3">
              <img
                src={reviewDrawerVendor.logo}
                alt={reviewDrawerVendor.storeName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {reviewDrawerVendor.storeName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{reviewDrawerVendor.category}</p>
              </div>
            </div>
          </div>

          {/* Verification Checklist Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Verification Status Checklist
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  ✓ Identity Verified
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  ✓ Business EIN
                </span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                  ⌛ Stripe Bank Payout
                </span>
              </div>
            </div>
          </div>

          {/* Business & Owner Info */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" /> Business Entity:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{reviewDrawerVendor.businessName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-500" /> Tax Identification (EIN):
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{reviewDrawerVendor.taxId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" /> Authorized Owner:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{reviewDrawerVendor.ownerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-500" /> Stripe Payout Account:
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">•••• {reviewDrawerVendor.bankAccountLast4}</span>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verification Documents</h4>
            <div className="space-y-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">Business License (PDF)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">IRS Tax Verification (W-9 / EIN)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">Owner Government ID Passport</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Action Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setRejectModalVendor(reviewDrawerVendor);
                setReviewDrawerVendor(null);
              }}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Reject Application
            </button>

            <button
              onClick={() => {
                setApprovalModalVendor(reviewDrawerVendor);
                setReviewDrawerVendor(null);
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
