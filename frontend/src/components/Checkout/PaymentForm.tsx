"use client";

import { useState } from "react";
import { CreditCard, Lock, Check, Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { paymentApi } from "@/services/api/paymentApi";

interface PaymentFormProps {
  onSuccess: () => void;
  orderId?: string;
  amount?: number;
}

export default function PaymentForm({ onSuccess, orderId = "ORD-TEST-1001", amount = 149.99 }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<"stripe_checkout" | "card">("stripe_checkout");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  const isCardValid =
    cardNumber.replace(/\s/g, "").length >= 16 &&
    expiry.length >= 5 &&
    cvv.length >= 3 &&
    nameOnCard.length >= 2;

  const handlePay = async () => {
    setProcessing(true);
    setErrorMsg("");

    try {
      if (paymentType === "stripe_checkout") {
        const res = await paymentApi.createCheckoutSession({
          orderId,
          amount,
          currency: "USD",
          successUrl: `${window.location.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/order/failed/${orderId}`
        });

        if (res.data?.checkoutUrl) {
          window.location.href = res.data.checkoutUrl;
          return;
        } else {
          setErrorMsg("Failed to generate checkout URL");
          setProcessing(false);
        }
      } else {
        setErrorMsg("Direct card payment is not supported yet. Please use Stripe Checkout.");
        setProcessing(false);
      }
    } catch (err: any) {
      console.error("Checkout session creation failed:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to create checkout session");
      setProcessing(false);
    }
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
          Your payment has been verified with Stripe. Redirecting to confirmation...
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
          <span>Stripe 256-Bit Encrypted</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Payment method selector */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPaymentType("stripe_checkout")}
          className={`flex-1 p-3.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
            paymentType === "stripe_checkout"
              ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF] font-bold"
              : "border-gray-200 text-gray-500 hover:border-gray-300 font-semibold"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-xs">Stripe Checkout</span>
        </button>
      </div>

      {paymentType === "stripe_checkout" ? (
        <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/30 text-center space-y-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-[#007BFF]">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Secure Stripe Gateway</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
              You will be redirected to Stripe’s official encrypted payment portal to complete your order safely.
            </p>
          </div>
        </div>
      ) : (
        /* Card form */
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
                placeholder="4242 4242 4242 4242"
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
              placeholder="Nati Customer"
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
                placeholder="12/28"
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
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={processing || (paymentType === "card" && !isCardValid)}
        className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting to Stripe Gateway...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            {paymentType === "stripe_checkout" ? "Proceed to Stripe Checkout" : "Pay Securely"}
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 font-semibold text-center">
        Your payment is protected by 256-bit SSL encryption & Stripe Fraud Prevention.
      </p>
    </div>
  );
}
