"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  Sparkles,
  Mail,
  Copy,
  Check,
  CreditCard,
  Gift,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Coffee,
  Award,
  Crown,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDonationStore } from "@/store/donationStore";
import PayoneerLogo from "./PayoneerLogo";

const PRESET_AMOUNTS = [
  { value: 5, label: "$5", subtitle: "Coffee ☕", icon: Coffee },
  { value: 15, label: "$15", subtitle: "Supporter 🌟", icon: Heart },
  { value: 50, label: "$50", subtitle: "Champion 🏆", icon: Award },
  { value: 100, label: "$100", subtitle: "Patron 👑", icon: Crown },
];

const PLATFORM_PAYONEER_EMAIL = "natnaelsolomon571@gmail.com";

export default function DonationPopup() {
  const {
    isOpen,
    openDonationModal,
    closeDonationModal,
    dismissUntilTomorrow,
    isDismissed,
  } = useDonationStore();

  const [selectedAmount, setSelectedAmount] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [payoneerEmail, setPayoneerEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successData, setSuccessData] = useState<any>(null);
  const [copiedPayoneer, setCopiedPayoneer] = useState<boolean>(false);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);

  // Auto-trigger popup like an ad after 4.5 seconds if user hasn't dismissed it
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDismissed()) return;

    const timer = setTimeout(() => {
      openDonationModal();
    }, 4500);

    return () => clearTimeout(timer);
  }, [isDismissed, openDonationModal]);

  const handleClose = () => {
    if (dontShowAgain) {
      dismissUntilTomorrow();
    } else {
      closeDonationModal();
    }
  };

  const effectiveAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleCopyPayoneer = () => {
    navigator.clipboard.writeText(PLATFORM_PAYONEER_EMAIL);
    setCopiedPayoneer(true);
    setTimeout(() => setCopiedPayoneer(false), 2000);
  };

  const handleCopyReceipt = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!donorEmail || !donorEmail.includes("@")) {
      setError("Please provide a valid donor email address.");
      setLoading(false);
      return;
    }

    if (!payoneerEmail || !payoneerEmail.includes("@")) {
      setError("Please provide your valid Payoneer account email.");
      setLoading(false);
      return;
    }

    if (!effectiveAmount || effectiveAmount < 1) {
      setError("Please enter a donation amount of at least $1.00.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorEmail,
          donorName,
          payoneerEmail,
          amount: effectiveAmount,
          currency,
          message,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSuccessData(data.donation);
        if (dontShowAgain) {
          dismissUntilTomorrow();
        }
      } else {
        throw new Error(data?.error || "Failed to submit donation. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while processing your donation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Window (Ad / Pop-up Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Top Promotional Header Banner */}
          <div className="relative bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500 p-5 sm:p-6 text-white text-center shrink-0 overflow-hidden">
            {/* Decorative background glows */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Sparkle Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider mb-2 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Community Support & Open Source</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Support Nati Platform & Creators 💖
            </h3>
            <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto leading-relaxed">
              Help us maintain lightning-fast cloud infrastructure, zero-downtime scaling, and open developer tools.
            </p>
          </div>

          {/* Form Content / Success Screen */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white space-y-4">
            {successData ? (
              /* Success Celebration Screen */
              <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900">
                    Thank You for Your Donation! 🎉
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Your contribution of <strong className="text-slate-900 font-bold">${successData.amount} {successData.currency}</strong> via Payoneer empowers our community!
                  </p>
                </div>

                {/* Receipt Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Reference Receipt</span>
                    <button
                      type="button"
                      onClick={() => handleCopyReceipt(successData.referenceId)}
                      className="text-blue-600 font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      {copiedReceipt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {successData.referenceId}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                    <span>Payoneer Sender:</span>
                    <span className="font-semibold text-slate-800">{successData.payoneerEmail}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 text-left flex items-start gap-2">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    A confirmation notice has been dispatched to <strong>{successData.donorEmail}</strong>.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Continue Browsing Storefront
                </button>
              </div>
            ) : (
              /* Donation Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Choose Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Select Donation Amount
                    </label>
                    <div className="flex items-center gap-1">
                      {["USD", "EUR", "GBP"].map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setCurrency(curr)}
                          className={`px-2 py-0.5 text-[10px] font-black rounded ${
                            currency === curr
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AMOUNTS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = selectedAmount === preset.value && !customAmount;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(preset.value);
                            setCustomAmount("");
                          }}
                          className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-2 ring-rose-500/10"
                              : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-xs font-black">{preset.label}</div>
                          <div className="text-[9px] font-semibold text-slate-400 truncate">
                            {preset.subtitle}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      $
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Or enter custom amount (e.g. 25.00)"
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Donor Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="donor@example.com (for donation receipt)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Payoneer Integration Box */}
                <div className="bg-gradient-to-b from-orange-50/60 to-rose-50/40 p-3.5 rounded-2xl border border-orange-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <PayoneerLogo />
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      Verified Method
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Your Payoneer Account / Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={payoneerEmail}
                      onChange={(e) => setPayoneerEmail(e.target.value)}
                      placeholder="your.account@payoneer.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    />
                  </div>

                  {/* Recipient Account Details with 1-Click Copy */}
                  <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Official Recipient Payoneer Account
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {PLATFORM_PAYONEER_EMAIL}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPayoneer}
                      className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPayoneer ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPayoneer ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Optional Donor Name & Message */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Donor Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Support Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Keep up the great work!"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>
                        Submit Donation of ${effectiveAmount.toFixed(2)} via Payoneer
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Don't show again checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium text-slate-500">
                      Don't show this ad popup again for 24 hours
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Maybe later
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Guarantee */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Payoneer Integration</span>
            </div>
            <span>Encrypted • Zero Platform Fee</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
