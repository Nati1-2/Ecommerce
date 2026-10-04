"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/auth";
import { paymentApi } from "@/services/api/paymentApi";
import PaymentMethods from "./PaymentMethods";
import StripeCardForm from "./StripeCardForm";
import BillingAddress from "./BillingAddress";
import { Smartphone, Wallet, Lock, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

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
  const router = useRouter();
  const { paymentMethod, paymentStatus, setPaymentStatus } = usePaymentStore();
  const { isAuthenticated } = useAuthStore();
  const [processingRedirect, setProcessingRedirect] = useState(false);
  const [redirectError, setRedirectError] = useState("");

  const handleWalletCheckoutRedirect = async () => {
    setProcessingRedirect(true);
    setRedirectError("");

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
        throw new Error(res.message || "Failed to initialize secure checkout session");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to redirect to checkout portal.";
      setRedirectError(msg);
      onFailure(msg);
    } finally {
      setProcessingRedirect(false);
    }
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
        {redirectError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
            {redirectError}
          </div>
        )}

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
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <StripeCardForm
                    orderId={orderId}
                    amount={amount}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                  />
                </Elements>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-semibold">
                  Stripe Publishable Key is not configured.
                </div>
              )}
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
                <h4 className="text-sm font-black text-gray-900">Checkout via Stripe Portal (PayPal / Wallets)</h4>
                <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                  Click below to proceed to the secure Stripe portal supporting PayPal, Link, and card options.
                </p>
              </div>
              <button
                type="button"
                onClick={handleWalletCheckoutRedirect}
                disabled={processingRedirect || paymentStatus === "processing"}
                className="w-full max-w-xs py-3.5 px-6 bg-[#FFC439] hover:bg-[#F2B224] text-[#002C8A] font-black text-xs rounded-xl shadow transition-all mx-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingRedirect ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#002C8A]" />
                    <span>Connecting to Portal...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Proceed to Stripe Checkout (${amount.toFixed(2)})</span>
                  </>
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
                  Complete your purchase through Stripe Hosted Checkout with 1-click device wallet support.
                </p>
              </div>
              <button
                type="button"
                onClick={handleWalletCheckoutRedirect}
                disabled={processingRedirect || paymentStatus === "processing"}
                className="w-full max-w-xs py-3.5 px-6 bg-black hover:bg-gray-900 text-white font-black text-xs rounded-xl shadow transition-all mx-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingRedirect ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Checkout...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>{paymentMethod === "applepay" ? " Pay via Stripe" : "Google Pay via Stripe"} (${amount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
