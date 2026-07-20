"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePaymentStore } from "@/store/paymentStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import PaymentMethods from "./PaymentMethods";
import StripeCardForm from "./StripeCardForm";
import BillingAddress from "./BillingAddress";
import { Smartphone, Wallet, Lock, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Initialize mock Stripe public key
const stripePromise = loadStripe("pk_test_51Nz3JGLw2GSwp1PzMOCKKEY1234567890AURA");

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onFailure: (errorMessage: string) => void;
}

export default function PaymentForm({
  orderId,
  amount,
  onSuccess,
  onFailure,
}: PaymentFormProps) {
  const { paymentMethod, paymentStatus, setPaymentStatus } = usePaymentStore();
  const [processingOther, setProcessingOther] = useState(false);

  const handleOtherPayment = async (method: string) => {
    setProcessingOther(true);
    setPaymentStatus("processing");
    // Simulate PayPal / Apple Pay API calls
    await new Promise((r) => setTimeout(r, 2200));
    setProcessingOther(false);
    setPaymentStatus("success");
    const mockTxId = `tx_${method}_${Math.random().toString(36).substr(2, 14)}`;
    onSuccess(mockTxId);
  };

  return (
    <div className="space-y-6">
      {/* 1. Payment Methods Selection */}
      <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm">
        <PaymentMethods disabled={paymentStatus === "processing"} />
      </div>

      {/* 2. Billing Address Info */}
      <BillingAddress />

      {/* 3. Conditional Payment Integrations */}
      <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4">
        <AnimatePresence mode="wait">
          {paymentMethod === "card" && (
            <motion.div
              key="stripe-elements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Secure Credit Card
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Stripe SSL
                </span>
              </div>
              <Elements stripe={stripePromise}>
                <StripeCardForm
                  orderId={orderId}
                  amount={amount}
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                />
              </Elements>
            </motion.div>
          )}

          {paymentMethod === "paypal" && (
            <motion.div
              key="paypal-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-center py-4"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900">Authorize via PayPal</h4>
                <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                  Click below to securely sign in to your PayPal account and authorize this transaction.
                </p>
              </div>
              <button
                onClick={() => handleOtherPayment("paypal")}
                disabled={processingOther || paymentStatus === "processing"}
                className="w-full max-w-xs py-3.5 px-6 bg-[#FFC439] hover:bg-[#F2B224] text-[#002C8A] font-black text-xs rounded-xl shadow transition-all mx-auto flex items-center justify-center gap-2"
              >
                {processingOther ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#002C8A]" />
                    Connecting to PayPal...
                  </>
                ) : (
                  "Pay with PayPal"
                )}
              </button>
            </motion.div>
          )}

          {(paymentMethod === "applepay" || paymentMethod === "googlepay") && (
            <motion.div
              key="express-pay"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-center py-4"
            >
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto text-gray-900">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900">
                  {paymentMethod === "applepay" ? "Apple Pay" : "Google Pay"} Express
                </h4>
                <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                  Pay instantly using card details stored securely in your device.
                </p>
              </div>
              <button
                onClick={() => handleOtherPayment(paymentMethod)}
                disabled={processingOther || paymentStatus === "processing"}
                className="w-full max-w-xs py-3.5 px-6 bg-black hover:bg-gray-900 text-white font-black text-xs rounded-xl shadow transition-all mx-auto flex items-center justify-center gap-2"
              >
                {processingOther ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initializing wallet...
                  </>
                ) : (
                  `Pay with ${paymentMethod === "applepay" ? " Pay" : "Google Pay"}`
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
