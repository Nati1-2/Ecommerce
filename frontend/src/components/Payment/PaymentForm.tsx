"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Zap,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/auth";
import { paymentApi } from "@/services/api/paymentApi";
import { orderApi } from "@/services/api/orderApi";

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onFailure: (errorMessage: string) => void;
  payButtonText?: string;
}

export default function PaymentForm({
  orderId,
  amount,
  onSuccess,
  onFailure,
  payButtonText,
}: PaymentFormProps) {
  const router = useRouter();
  const { paymentStatus, setPaymentStatus } = usePaymentStore();
  const { isAuthenticated } = useAuthStore();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingTestPay, setLoadingTestPay] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [tabOpened, setTabOpened] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if order is already marked as PAID
  const checkOrderStatus = useCallback(async (): Promise<boolean> => {
    try {
      const res = await orderApi.getOrder(orderId);
      const order = res?.data;
      const status = (order?.paymentStatus || "").toUpperCase();
      if (status === "PAID" || order?.orderStatus === "PAID") {
        setIsPaid(true);
        setPaymentStatus("success");
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        const txnId = order?.paymentIntentId || `txn_${Date.now()}`;
        setTimeout(() => onSuccess(txnId), 1600);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [orderId, onSuccess, setPaymentStatus]);

  // Handle cross-tab sync via storage events and BroadcastChannel
  useEffect(() => {
    checkOrderStatus();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `order_paid_${orderId}` || e.key === "nati_order_paid") {
        setIsPaid(true);
        setPaymentStatus("success");
        setTimeout(() => onSuccess(`txn_${Date.now()}`), 1600);
      }
    };
    window.addEventListener("storage", handleStorage);

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("order_status_channel");
        bc.onmessage = (event) => {
          if (event.data?.orderId === orderId && event.data?.status === "PAID") {
            setIsPaid(true);
            setPaymentStatus("success");
            setTimeout(() => onSuccess(`txn_${Date.now()}`), 1600);
          }
        };
      }
    } catch {}

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (bc) bc.close();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [orderId, checkOrderStatus, onSuccess, setPaymentStatus]);

  // Start polling when Stripe tab is opened
  useEffect(() => {
    if (tabOpened && !isPaid) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(() => {
        checkOrderStatus();
      }, 2500);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [tabOpened, isPaid, checkOrderStatus]);

  // 1. Launch Stripe Checkout in a New Tab
  const handlePayWithStripe = async () => {
    setLoadingCheckout(true);
    setErrorMsg("");
    setPopupBlocked(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!isAuthenticated && !token) {
      router.push(`/login?redirect=/payment?orderId=${orderId}`);
      return;
    }

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await paymentApi.createCheckoutSession({
        orderId,
        amount,
        currency: "USD",
        successUrl: `${origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/payment?orderId=${orderId}&canceled=true`,
      });

      const url = res.data?.checkoutUrl;
      if (url) {
        setStripeUrl(url);
        setTabOpened(true);

        const opened = window.open(url, "_blank");
        if (!opened || opened.closed || typeof opened.closed === "undefined") {
          setPopupBlocked(true);
        }
      } else {
        setIsPaid(true);
        setPaymentStatus("success");
        setTimeout(() => onSuccess(`txn_${Date.now()}`), 1500);
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not initiate Stripe checkout. Please try again.";
      setErrorMsg(msg);
      onFailure(msg);
    } finally {
      setLoadingCheckout(false);
    }
  };

  // 2. Instant Test Payment Simulation
  const handleInstantTestPayment = async () => {
    setLoadingTestPay(true);
    setErrorMsg("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      await axios.post(
        "/api/payments/confirm",
        {
          orderId,
          isTest: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      try {
        localStorage.setItem(`order_paid_${orderId}`, Date.now().toString());
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("order_status_channel");
          bc.postMessage({ orderId, status: "PAID" });
          bc.close();
        }
      } catch {}

      setIsPaid(true);
      setPaymentStatus("success");
      setTimeout(() => onSuccess(`test_txn_${Date.now()}`), 1500);
    } catch (err: any) {
      console.error("Test payment error:", err);
      const msg = err?.response?.data?.error || err?.message || "Test payment failed";
      setErrorMsg(msg);
      onFailure(msg);
    } finally {
      setLoadingTestPay(false);
    }
  };

  // 3. Manual Payment Status Check
  const handleManualVerify = async () => {
    setVerifying(true);
    setErrorMsg("");
    try {
      const paid = await checkOrderStatus();
      if (!paid) {
        setErrorMsg("Payment is not yet confirmed. If you completed Stripe checkout, please allow a moment and try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const formattedAmount = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const buttonLabel = payButtonText || `Pay Now ($${formattedAmount})`;

  // ── PAID / CONFIRMED STATE ────────────────────────────────────────────────
  if (isPaid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-8 rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white text-center space-y-6 shadow-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25"
        >
          <Check className="w-10 h-10 stroke-[3px]" />
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PAID • ${amount.toFixed(2)}</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Payment Confirmed!
          </h3>
          <p className="text-xs text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
            Order <span className="text-gray-900 font-bold">#{orderId}</span> is marked as <span className="text-emerald-600 font-bold">PAID</span>. Redirecting to your receipt...
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSuccess(`txn_${Date.now()}`)}
            className="w-full max-w-xs mx-auto py-3.5 px-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Order Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-gray-900">Payment Gateway</h3>
          <p className="text-xs text-gray-400 font-medium">Encrypted Stripe Checkout</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stripe SSL 256-Bit</span>
        </div>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold border border-red-100 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span className="flex-1">{errorMsg}</span>
        </motion.div>
      )}

      {/* Order Amount Summary Card */}
      <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Order Reference
          </span>
          <p className="text-xs font-black text-gray-800">#{orderId}</p>
        </div>
        <div className="text-right space-y-0.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Total to Pay
          </span>
          <p className="text-lg font-black text-[#007BFF] tracking-tight">
            ${formattedAmount}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tabOpened ? (
          <motion.div
            key="tab-opened-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-6 rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white text-center space-y-5"
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20 animate-ping" />
              <div className="relative w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ExternalLink className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#007BFF] text-[11px] font-bold">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Stripe Checkout Opened in New Tab</span>
              </div>
              <h4 className="text-base font-black text-gray-900">
                Awaiting Payment Confirmation
              </h4>
              <p className="text-xs text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                Complete payment in the opened Stripe tab. As soon as you finish, this page will automatically confirm and mark your order as <span className="text-emerald-600 font-bold">PAID</span>.
              </p>
            </div>

            {popupBlocked && stripeUrl && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center justify-between gap-2">
                <span>Popup window blocked by browser.</span>
                <a
                  href={stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shrink-0 inline-flex items-center gap-1"
                >
                  <span>Open Stripe Checkout</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {stripeUrl && (
                <button
                  type="button"
                  onClick={() => window.open(stripeUrl, "_blank")}
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#007BFF]" />
                  <span>Reopen Stripe Tab</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleManualVerify}
                disabled={verifying}
                className="w-full sm:w-auto px-6 py-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>I&apos;ve Completed Payment</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Testing without a card?</span>
              <button
                type="button"
                onClick={handleInstantTestPayment}
                disabled={loadingTestPay}
                className="text-[#007BFF] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Simulate Instant Test Pay</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="initial-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-3xl border border-gray-200/90 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-50 text-[#007BFF] rounded-2xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900">
                    Pay with Stripe Checkout
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    Credit/Debit Cards, Apple Pay, Google Pay & Link
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-1.5 py-1">
                {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay", "Link"].map((brand) => (
                  <span
                    key={brand}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600"
                  >
                    {brand}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePayWithStripe}
                disabled={loadingCheckout}
                className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {loadingCheckout ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Stripe Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{buttonLabel}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 font-medium text-center">
                Opens Stripe in a new secure tab. Your order status will update to <span className="text-emerald-600 font-bold">PAID</span> automatically upon completion.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
