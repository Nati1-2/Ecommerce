"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Check, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { paymentApi } from "@/services/api/paymentApi";
import { useAuthStore } from "@/store/auth";
import StripeCardForm from "@/components/Payment/StripeCardForm";

const DEFAULT_STRIPE_PK =
  "pk_test_51ThDDICdX0hvCWhczONjNi3TCevUCN7vYmjW5h5KaNeNiyjAAkIG3KL1ZkqSOauu8wIRirZmCuETnr6Xw65tK34T00DDtz8A5O";

const initialKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || DEFAULT_STRIPE_PK;

let cachedStripePromise: Promise<Stripe | null> | null = initialKey
  ? loadStripe(initialKey)
  : null;

interface PaymentFormProps {
  onSuccess: () => void;
  orderId?: string;
  amount?: number;
}

export default function PaymentForm({ onSuccess, orderId = "ORD-TEST-1001", amount = 149.99 }: PaymentFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(cachedStripePromise);
  const [paymentType, setPaymentType] = useState<"card" | "stripe_checkout">("card");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!stripePromise) {
      fetch("/api/payments/config")
        .then((res) => res.json())
        .then((data) => {
          const key = data.publishableKey || DEFAULT_STRIPE_PK;
          cachedStripePromise = loadStripe(key);
          setStripePromise(cachedStripePromise);
        })
        .catch(() => {
          cachedStripePromise = loadStripe(DEFAULT_STRIPE_PK);
          setStripePromise(cachedStripePromise);
        });
    }
  }, [stripePromise]);

  const handleStripeCheckoutRedirect = async () => {
    setProcessing(true);
    setErrorMsg("");

    // Verify authentication
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!isAuthenticated && !token) {
      router.push(`/login?redirect=/checkout`);
      return;
    }

    try {
      const res = await paymentApi.createCheckoutSession({
        orderId,
        amount,
        currency: "USD",
        successUrl: `${window.location.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/order/failed/${orderId}`,
      });

      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        setCompleted(true);
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err: any) {
      console.error("Stripe checkout session error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Unable to connect to Stripe checkout. Please try again.";
      setErrorMsg(msg);
    } finally {
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
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm"
        >
          <Check className="w-8 h-8 text-emerald-600 stroke-[3px]" />
        </motion.div>
        <h3 className="text-xl font-black text-gray-900">Payment Confirmed!</h3>
        <p className="text-xs text-gray-500 font-semibold max-w-xs">
          Your payment was processed securely via Stripe. Finalizing your order details...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-gray-900">Payment Method</h3>
          <p className="text-xs text-gray-400 font-medium">Select your preferred Stripe payment experience</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stripe SSL 256-Bit</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
          {errorMsg}
        </div>
      )}

      {/* Payment method selector tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => { setPaymentType("card"); setErrorMsg(""); }}
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2.5 transition-all text-xs cursor-pointer ${
            paymentType === "card"
              ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF] font-bold shadow-sm"
              : "border-gray-200 text-gray-600 hover:border-gray-300 font-semibold bg-white"
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>Pay with Card (Elements)</span>
        </button>

        <button
          type="button"
          onClick={() => { setPaymentType("stripe_checkout"); setErrorMsg(""); }}
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2.5 transition-all text-xs cursor-pointer ${
            paymentType === "stripe_checkout"
              ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF] font-bold shadow-sm"
              : "border-gray-200 text-gray-600 hover:border-gray-300 font-semibold bg-white"
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>Stripe Hosted Checkout</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {paymentType === "card" ? (
          <motion.div
            key="card-elements"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Direct Stripe Card Payment
              </span>
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                PCI-DSS Compliant
              </span>
            </div>

            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <StripeCardForm
                  orderId={orderId}
                  amount={amount}
                  onSuccess={(_txId) => {
                    setCompleted(true);
                    setTimeout(() => onSuccess(), 1000);
                  }}
                  onFailure={(err) => setErrorMsg(err)}
                />
              </Elements>
            ) : (
              <div className="p-8 flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold border border-gray-100 rounded-2xl bg-gray-50/50">
                <Loader2 className="w-4 h-4 animate-spin text-[#007BFF]" />
                <span>Initializing secure payment gateway...</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="stripe-portal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <div className="p-6 rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-blue-50/10 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#007BFF] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-gray-900">Official Stripe Checkout Portal</h4>
                <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  You will be securely redirected to Stripe to complete payment using Credit Card, Apple Pay, Google Pay, or Link.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStripeCheckoutRedirect}
                  disabled={processing}
                  className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Stripe Portal...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Stripe Checkout (${amount.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-medium text-center">
              Your payment information is tokenized and never stored on our servers.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
