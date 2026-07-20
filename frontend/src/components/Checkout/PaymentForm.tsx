"use client";

import { useState } from "react";
import { CreditCard, Lock, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentFormProps {
  onSuccess: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  const isValid =
    cardNumber.replace(/\s/g, "").length >= 16 &&
    expiry.length >= 5 &&
    cvv.length >= 3 &&
    nameOnCard.length >= 2;

  const handlePay = async () => {
    if (!isValid) return;
    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    setProcessing(false);
    setCompleted(true);
    setTimeout(() => onSuccess(), 1500);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center gap-4 py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-emerald-600 stroke-[3px]" />
        </motion.div>
        <h3 className="text-xl font-black text-gray-900">Payment Successful!</h3>
        <p className="text-sm text-gray-400 font-semibold max-w-xs">
          Your order has been confirmed. Redirecting to confirmation page...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900">Payment Details</h3>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Encrypted & Secure</span>
        </div>
      </div>

      {/* Payment method selector */}
      <div className="flex gap-3">
        <div className="flex-1 p-3.5 rounded-xl border-2 border-[#007BFF] bg-blue-50/30 flex items-center gap-2 cursor-pointer">
          <CreditCard className="w-4 h-4 text-[#007BFF]" />
          <span className="text-xs font-bold text-[#007BFF]">Credit / Debit Card</span>
        </div>
        <div className="flex-1 p-3.5 rounded-xl border border-gray-200 flex items-center gap-2 cursor-pointer hover:border-gray-300 transition-colors opacity-50">
          <span className="text-xs font-bold text-gray-400">PayPal</span>
        </div>
      </div>

      {/* Card form */}
      <div className="space-y-4 p-5 rounded-2xl border border-gray-100 bg-[#F5F7FA]/50">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 tracking-widest"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Name on Card
          </label>
          <input
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="John Smith"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 tracking-widest"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              CVV
            </label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 tracking-widest"
            />
          </div>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={!isValid || processing}
        className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay Securely
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 font-semibold text-center">
        Your payment information is encrypted with 256-bit SSL. We never store your full card details.
      </p>
    </div>
  );
}
